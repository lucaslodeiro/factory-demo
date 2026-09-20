import lighthouse from 'lighthouse';
import {launch} from 'chrome-launcher';
import {writeFile,mkdir,readFile} from 'node:fs/promises';
import {gzipSync} from 'node:zlib';
import assert from 'node:assert/strict';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
await mkdir('evidence/lighthouse',{recursive:true});
const chrome=await launch({chromePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',chromeFlags:['--headless','--no-first-run']});
const summary=[];const median=a=>a.sort((a,b)=>a-b)[1];
try{for(const path of ['/','/en/','/pt/']){const runs=[];for(let i=0;i<3;i++){const {lhr,report}=await lighthouse(base+path,{port:chrome.port,output:'json',onlyCategories:['performance'],formFactor:'mobile',logLevel:'error'});await writeFile(`evidence/lighthouse/${path==='/'?'es':path.replaceAll('/','')}-${i+1}.json`,report);runs.push({performance:lhr.categories.performance.score*100,lcp:lhr.audits['largest-contentful-paint'].numericValue,cls:lhr.audits['cumulative-layout-shift'].numericValue,version:lhr.lighthouseVersion});}const result={path,runs,median:{performance:median(runs.map(r=>r.performance)),lcp:median(runs.map(r=>r.lcp)),cls:median(runs.map(r=>r.cls))}};summary.push(result);console.log(result);assert.ok(result.median.performance>=90);assert.ok(result.median.lcp<=2500);assert.ok(result.median.cls<=.1);}
for(const path of ['index.html','en/index.html','pt/index.html']){const html=await readFile('dist/'+path,'utf8');let bytes=0;for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){if(match[1].includes('application/ld+json'))continue;const src=match[1].match(/src="([^"]+)"/);bytes+=gzipSync(src?await readFile('dist'+src[1]):match[2]).length;}assert.ok(bytes<=50*1024);summary.push({path,initialJavaScriptGzipBytes:bytes});}
await writeFile('evidence/performance.json',JSON.stringify(summary,null,2));}finally{chrome.kill();}
