// Manual preview: real contact handler, with all provider credentials explicitly disabled.
import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {handleContact} from '../src/lib/contact';

const root = await fs.realpath('dist');
const redirects = (await fs.readFile(path.join(root, '_redirects'), 'utf8')).trim().split('\n').map(line => line.trim().split(/\s+/));
const headerRules: {pattern:string; headers:Record<string,string>}[] = [];
for (const line of (await fs.readFile(path.join(root, '_headers'), 'utf8')).split('\n')) {
 if (!line.trim() || line.trim().startsWith('#')) continue;
 if (!/^\s/.test(line)) headerRules.push({pattern:line.trim(),headers:{}});
 else {const colon=line.indexOf(':'); headerRules.at(-1)!.headers[line.slice(0,colon).trim()]=line.slice(colon+1).trim();}
}
const mime:Record<string,string>={'.html':'text/html; charset=utf-8','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon','.woff2':'font/woff2','.xml':'application/xml','.txt':'text/plain'};
// Bound hosts plus localhost, with the effective port: the allow-list is the trust boundary.
let allowed=new Set<string>();
const handler=(scheme:'http'|'https')=>async(req:http.IncomingMessage,res:http.ServerResponse)=>{
 try {
  const host=req.headers.host;
  // Reject unknown Host values (DNS rebinding) before serving files or the API.
  if(!host||!allowed.has(host)){res.writeHead(403);res.end();return;}
  const origin=`${scheme}://${host}`;
  const url=new URL(req.url!,origin);
  for(const rule of headerRules) if(rule.pattern.endsWith('*') ? url.pathname.startsWith(rule.pattern.slice(0,-1)) : url.pathname===rule.pattern) for(const [key,value] of Object.entries(rule.headers)) res.setHeader(key,value);
  res.setHeader('X-Robots-Tag','noindex, nofollow');
  if(url.pathname==='/api/contact') {
   const headers=new Headers();for(const [key,value] of Object.entries(req.headers)) if(value!==undefined) headers.set(key,Array.isArray(value)?value.join(','):value);
   let body:Buffer|undefined;
   // Only valid POST envelopes need reading. Stop accumulating immediately at 16 KiB.
   if(req.method==='POST' && headers.get('origin')===origin && headers.get('content-type')?.split(';')[0].trim()==='application/json') {
    body=await new Promise<Buffer|undefined>((resolve,reject)=>{
     let size=0;const chunks:Buffer[]=[];
     const oversized=()=>{req.pause();res.setHeader('Connection','close');resolve(undefined);};
     if(Number(headers.get('content-length'))>16384){headers.set('content-length','16385');oversized();return;}
     req.on('data',(chunk:Buffer)=>{size+=chunk.length;if(size>16384){headers.set('content-length','16385');oversized();}else chunks.push(chunk);});
     req.on('end',()=>resolve(Buffer.concat(chunks)));req.on('error',reject);
    });
   }
   const request=new Request(new URL('/api/contact',origin),{method:req.method,headers,...(body?{body:new Uint8Array(body)}:{})});
   const result=await handleContact(request,{SITE_ORIGIN:origin,MAIL_FROM:'',RESEND_API_KEY:'',TURNSTILE_SECRET_KEY:''});
   res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());return;
  }
  if(!['GET','HEAD'].includes(req.method!)){res.writeHead(405);res.end();return;}
  const redirect=redirects.find(([from])=>from===url.pathname);
  if(redirect){res.writeHead(Number(redirect[2]),{Location:redirect[1]});res.end();return;}
  let file=path.resolve(root,`.${decodeURIComponent(url.pathname)}`);
  if(!file.startsWith(root+path.sep)||path.basename(file).startsWith('_')){res.writeHead(403);res.end();return;}
  let status=200;
  try {
   if((await fs.stat(file)).isDirectory()) {
    if(!url.pathname.endsWith('/')){res.writeHead(301,{Location:url.pathname+'/'+url.search});res.end();return;}
    file=path.join(file,'index.html');
   }
   file=await fs.realpath(file);
   if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  } catch {
   status=404;const locale=url.pathname.split('/')[1];file=path.join(root,['es','en','pt'].includes(locale)?`${locale}/404/index.html`:'404.html');
  }
  const body=await fs.readFile(file);
  res.writeHead(status,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Content-Length':body.length});res.end(req.method==='HEAD'?undefined:body);
 } catch {res.writeHead(400);res.end('Local request error');}
};
// One listener per requested host on a shared port: exactly the approved exposure, never 0.0.0.0.
const hosts=(process.env.LOCAL_HOSTS||'127.0.0.1').split(',').map(host=>host.trim()).filter(Boolean);
const loopback=(host:string)=>['127.0.0.1','::1','localhost'].includes(host);
// Network hosts need TLS: over plain HTTP they are not a secure context and the form script,
// which calls crypto.randomUUID(), never installs its submit handler. Loopback stays on HTTP.
const scheme=(host:string):'http'|'https'=>loopback(host)?'http':'https';
async function certificate(){
 const key='.local/key.pem', cert='.local/cert.pem', marker='.local/cert.san';
 const san=[...new Set([...hosts,'127.0.0.1','localhost'])].map(host=>/^[\d.]+$/.test(host)?`IP:${host}`:`DNS:${host}`).join(',');
 await fs.mkdir('.local',{recursive:true});
 // Reuse the certificate while the host list holds, so an accepted exception survives restarts.
 if(await fs.readFile(marker,'utf8').catch(()=>'')!==san){
  execFileSync('/usr/bin/openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',key,'-out',cert,'-days','30','-subj','/CN=OpenXpand local preview','-addext',`subjectAltName=${san}`],{stdio:'ignore'});
  await fs.chmod(key,0o600);await fs.writeFile(marker,san);
 }
 return {key:await fs.readFile(key),cert:await fs.readFile(cert)};
}
const credentials=hosts.some(host=>!loopback(host))?await certificate():undefined;
const listen=(server:http.Server|https.Server,host:string,port:number)=>new Promise<number>((resolve,reject)=>{
 server.once('error',reject);
 server.listen(port,host,()=>{server.removeListener('error',reject);resolve((server.address() as import('node:net').AddressInfo).port);});
});
let port=Number(process.env.LOCAL_PORT||4321);
let servers:(http.Server|https.Server)[]=[];
for(let attempt=0;;attempt++){
 servers=hosts.map(host=>scheme(host)==='http'?http.createServer(handler('http')):https.createServer(credentials!,handler('https')));
 try {
  // The first bind fixes the port for the rest; port 0 asks the kernel for a free one.
  let bound=port;
  for(const [index,host] of hosts.entries()) bound=await listen(servers[index],host,index===0?port:bound);
  port=bound;break;
 } catch(error) {
  await Promise.all(servers.map(server=>new Promise<void>(resolve=>server.close(()=>resolve()))));
  if((error as NodeJS.ErrnoException).code!=='EADDRINUSE'||attempt===4) throw error;
  port=0; // Never stop whatever owns the busy port; take another one.
 }
}
allowed=new Set([...hosts,'localhost'].map(host=>`${host}:${port}`));
const urls=hosts.map(host=>`${scheme(host)}://${host}:${port}/es/`);
await fs.mkdir('.local',{recursive:true});await fs.writeFile('.local/url',urls.join('\n')+'\n');
console.log(`Local preview (mail disabled): ${urls.join(' ')}`);
