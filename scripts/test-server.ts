// Local-only verification server. Never deployed; external fetches are explicitly simulated.
import http from 'node:http';import fs from 'node:fs/promises';import path from 'node:path';
import {handleContact} from '../src/lib/contact';
// PORT lets a run bind a free port when 4321 is held by another checkout's server.
const port=Number(process.env.PORT||4321);const host=`http://127.0.0.1:${port}`;
const server=http.createServer(async(req,res)=>{try{
 const url=new URL(req.url!,host);
 if(url.pathname==='/'){res.writeHead(301,{Location:'/es/'});res.end();return;}
 if(url.pathname==='/api/contact'){
  const chunks:Buffer[]=[];for await(const chunk of req)chunks.push(chunk);
  const request=new Request(url,{method:req.method,headers:req.headers as Record<string,string>,body:Buffer.concat(chunks)});
  const result=await handleContact(request,{SITE_ORIGIN:host,MAIL_FROM:'Test <test@example.test>',RESEND_API_KEY:'test',TURNSTILE_SECRET_KEY:'test'},async(input,init)=>{
   if(String(input).includes('siteverify'))return Response.json({success:true,hostname:'127.0.0.1',action:new URLSearchParams(init?.body as string).get('response')==='demo-token'?'contact_demo':'contact_apis'});
   return Response.json({id:'local-mock-only'});
  });res.writeHead(result.status,Object.fromEntries(result.headers));res.end(await result.text());return;
 }
 const root=path.resolve('dist');let file=path.resolve(root,`.${decodeURIComponent(url.pathname)}`);if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
 let code=200;try{if((await fs.stat(file)).isDirectory())file=path.join(file,'index.html');}catch{code=404;const locale=url.pathname.split('/')[1];file=path.join(root,['es','en','pt'].includes(locale)?`${locale}/404/index.html`:'404.html');}
 const body=await fs.readFile(file);const mime:Record<string,string>={'.html':'text/html','.js':'application/javascript','.css':'text/css','.svg':'image/svg+xml','.webp':'image/webp','.xml':'application/xml','.txt':'text/plain'};
 res.writeHead(code,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});res.end(body);
 }catch{res.writeHead(500);res.end('Local verification error');}});
server.listen(port,'127.0.0.1',()=>console.log('Local production-build verification server: '+host));
