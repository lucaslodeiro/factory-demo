import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import https from 'node:https';
import {chromium, type Browser} from '@playwright/test';
// The preview certificate is self-signed on purpose; only this verification client trusts it.
process.env.NODE_TLS_REJECT_UNAUTHORIZED='0';
// Every announced URL is verified; the first one is the primary origin for the human.
const origins=(await fs.readFile('.local/url','utf8')).trim().split('\n').map(line=>new URL(line.trim()).origin);
const loopback=(origin:string)=>['127.0.0.1','localhost','[::1]'].includes(new URL(origin).hostname);
let count=0;
async function walk(origin:string,dir:string):Promise<void>{for(const entry of await fs.readdir(dir,{withFileTypes:true})){
 const file=path.join(dir,entry.name);if(entry.isDirectory())await walk(origin,file);else if(!entry.name.startsWith('_')){
 const route='/'+path.relative('dist',file).replaceAll(path.sep,'/').replace(/index\.html$/,'');
 const response=await fetch(origin+route);assert.equal(response.status,200,route);assert.equal((await response.arrayBuffer()).byteLength,(await fs.stat(file)).size,route);assert.equal(response.headers.get('x-content-type-options'),'nosniff');count++;
 }
}}
async function httpSuite(origin:string):Promise<void>{
 await walk(origin,'dist');
 for(const line of (await fs.readFile('dist/_redirects','utf8')).trim().split('\n')){const [from,to,status]=line.split(/\s+/);const response=await fetch(origin+from,{redirect:'manual'});assert.equal(response.status,Number(status));assert.equal(response.headers.get('location'),to);}
 for(const locale of ['es','en','pt']){const response=await fetch(`${origin}/${locale}/missing-page/`);assert.equal(response.status,404);assert.equal(await response.text(),await fs.readFile(`dist/${locale}/404/index.html`,'utf8'));}
 assert.equal((await fetch(origin+'/missing')).status,404);
 const headers={'Content-Type':'application/json',Origin:origin};
 const post=(body:string,extra:Record<string,string>={})=>fetch(origin+'/api/contact',{method:'POST',headers:{...headers,...extra},body});
 assert.equal((await post('{}')).status,400);
 assert.equal((await post('{}',{Origin:'https://wrong.example'})).status,403);
 assert.equal((await post('{}',{'Content-Type':'text/plain'})).status,415);
 assert.equal((await fetch(origin+'/api/contact')).status,405);
 assert.equal((await post('x'.repeat(16385))).status,413);
 const client=origin.startsWith('https:')?https:http;
 await new Promise<void>((resolve,reject)=>{const req=client.request(origin+'/api/contact',{method:'POST',headers},res=>{try{assert.equal(res.statusCode,413);res.resume();res.on('end',resolve);}catch(e){reject(e);}});req.on('error',reject);req.write('x'.repeat(10000));req.end('x'.repeat(10000));});
 assert.equal((await fetch(origin+'/%2e%2e%2fpackage.json')).status,403);
 // A Host outside the allow-list is refused before any file or API work (DNS rebinding).
 const {hostname,port}=new URL(origin);
 await new Promise<void>((resolve,reject)=>{const req=client.request({host:hostname,port,path:'/es/',headers:{Host:`rebind.example:${port}`}},res=>{try{assert.equal(res.statusCode,403,'rebind host');res.resume();res.on('end',resolve);}catch(e){reject(e);}});req.on('error',reject);req.end();});
}
async function browserSuite(browser:Browser,origin:string,locales:string[],intents:string[]):Promise<void>{
 const context=await browser.newContext({ignoreHTTPSErrors:true});
 const external:string[]=[];context.on('request',req=>{if(!req.url().startsWith(origin))external.push(req.url());});
 try {
  const page=await context.newPage();
  // Inspect draft links without invoking a host mail application.
  await page.addInitScript(()=>document.addEventListener('click',e=>{if((e.target as Element)?.closest('a')?.getAttribute('href')?.startsWith('mailto:'))e.preventDefault();},true));
  for(const locale of locales)for(const intent of intents){
   await page.goto(`${origin}/${locale}/contact/${intent}/`);
   // Without a secure context crypto.randomUUID() is missing and the form script never binds.
   assert.ok(await page.evaluate(()=>window.isSecureContext),`insecure context on ${origin}`);
   const form=page.locator('#contact');assert.equal(await form.getAttribute('data-intent'),intent);
   const fields={name:'Synthetic Tester',email:'tester@example.test',company:'Local verification',message:'Synthetic local draft — no delivery'};
   for(const [key,value] of Object.entries(fields))await form.locator(`[name="${key}"]`).fill(value);
   await form.locator('[name="api"]').selectOption({index:1});
   const selected=await form.locator('[name="api"]').inputValue();
   const responsePromise=page.waitForResponse(r=>r.url()===origin+'/api/contact');
   await form.locator('button[type="submit"]').click();
   const response=await responsePromise;assert.equal(response.status(),200);assert.deepEqual(await response.json(),{fallback:'mailto'});
   await page.locator('#mail-fallback:not([hidden])').waitFor();
   const href=new URL((await page.locator('#mail-fallback').getAttribute('href'))!);assert.equal(href.protocol,'mailto:');assert.equal(href.pathname,'info@openxpand.com');
   const body=href.searchParams.get('body')!;for(const value of [...Object.values(fields),locale,selected])assert.ok(body.includes(value));
   const copy=JSON.parse((await form.getAttribute('data-copy'))!);assert.ok(body.includes(copy.intentLabel));assert.equal(await page.locator('#status').textContent(),copy.mailDraft);assert.notEqual(copy.mailDraft,copy.success);
   for(const [key,value] of Object.entries(fields))assert.equal(await form.locator(`[name="${key}"]`).inputValue(),value);
  }
  assert.deepEqual(external,[]);
 } finally {await context.close();}
}
for(const origin of origins) await httpSuite(origin);
// The loopback URL stays operational alongside the network ones.
const local=origins.find(loopback);assert.ok(local,'no loopback origin announced');assert.equal((await fetch(local+'/es/')).status,200);
const endpoint=process.env.FACTORY_BROWSER_CDP_URL;
const browser=endpoint?await chromium.connectOverCDP(endpoint):await chromium.launch();
try {
 await browserSuite(browser,origins[0],['es','en','pt'],['apis','demo']);
 // Remote origins only need the fallback smoke; the full matrix already ran on the primary one.
 for(const origin of origins.slice(1).filter(origin=>!loopback(origin))) await browserSuite(browser,origin,['es'],['apis']);
} finally {if(!endpoint)await browser.close();}
console.log(`PASS: ${count} static responses over ${origins.length} origins (${origins.join(', ')}), redirects, localized 404s, endpoint rejections including chunked overflow and disallowed Host, six browser mailto submissions on ${origins[0]} plus smoke on remote origins; no external browser requests.`);
// End this client connection without closing the supervisor-owned browser.
process.exit(0);
