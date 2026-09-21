import lighthouse from 'lighthouse';import {launch} from 'chrome-launcher';import {chromium} from '@playwright/test';import fs from 'node:fs/promises';import assert from 'node:assert/strict';
const routes=['','apis/','apis/sim-swap/','operators/','contact/apis/'];const results=[];
for(const route of routes){const runs=[];for(let i=0;i<3;i++){
 const chrome=await launch({chromePath:chromium.executablePath(),chromeFlags:['--headless','--no-sandbox'],userDataDir:undefined});
 try{const {lhr}=await lighthouse(`http://127.0.0.1:4321/es/${route}`,{port:chrome.port,output:'json',onlyCategories:['performance'],formFactor:'mobile',disableStorageReset:false,logLevel:'error'});
 runs.push({performance:lhr.categories.performance.score*100,lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,externalRequests:lhr.audits['network-requests'].details.items.filter(r=>!r.url.startsWith('http://127.0.0.1')).map(r=>({url:r.url,bytes:r.transferSize,status:r.statusCode})),environment:lhr.environment});
 await fs.writeFile(`docs/evidence/lighthouse-${route.replaceAll('/','-')||'home'}-${i+1}.json`,JSON.stringify(lhr));
 }finally{await chrome.kill();}}
 const median=k=>runs.map(r=>r[k]).sort((a,b)=>a-b)[1];const result={route:`/es/${route}`,median:{performance:median('performance'),lcp:median('lcp'),cls:median('cls')},runs};results.push(result);console.log(result.route,result.median);
}
await fs.writeFile('docs/evidence/performance.json',JSON.stringify({date:new Date().toISOString(),runtime:process.version,platform:`${process.platform}/${process.arch}`,note:'Production static build; Lighthouse mobile default simulated throttling; fresh Chrome profile each run. Public Turnstile test key on contact; no mail credentials.',results},null,2));
for(const r of results){assert.ok(r.median.performance>=90,r.route+' performance');assert.ok(r.median.lcp<=2500,r.route+' LCP');assert.ok(r.median.cls<=.1,r.route+' CLS');}
