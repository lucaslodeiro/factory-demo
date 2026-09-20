import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
const base=process.env.TEST_URL||'http://127.0.0.1:4321';
const managed=Boolean(process.env.FACTORY_BROWSER_CDP_URL);
const browser=managed ? await chromium.connectOverCDP(process.env.FACTORY_BROWSER_CDP_URL) : await chromium.launch({executablePath:process.env.CHROME_PATH||'/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',headless:true});
await mkdir('evidence',{recursive:true});
const contexts=[];
async function newContext(options){const context=await browser.newContext(options);contexts.push(context);context.setDefaultTimeout(15000);return context;}
const report=[];
const names=['SIM Swap','Number Verification','Device Status','IMEI Fraud','Know your Customer','One-Time Password','Device Location','Quality on Demand','Geofencing','Connectivity Insights','Simple Edge Discovery'];
try {
for(const [lang,path] of [['es','/'],['en','/en/'],['pt','/pt/']]){
 console.log('Verifying',lang);
 const response=await fetch(base+path); assert.equal(response.status,200); const html=await response.text();
 for(const name of names)assert.ok(html.includes(name),name);
 const context=await newContext();const page=await context.newPage();await page.goto(base+path);
 assert.equal(await page.locator('html').getAttribute('lang'),lang);assert.equal(await page.locator('h1').count(),1);
 assert.equal(await page.locator('link[rel=canonical]').getAttribute('href'),'https://openxpand.com'+path);
 for(const alternate of ['es','en','pt','x-default'])assert.equal(await page.locator(`link[hreflang="${alternate}"]`).count(),1);
 assert.ok(await page.title());assert.ok(await page.locator('meta[name=description]').getAttribute('content'));
 const schema=JSON.parse(await page.locator('script[type="application/ld+json"]').textContent());assert.equal(schema['@graph'][0].email,'info@openxpand.com');
 assert.equal(await page.locator('form').count(),0);
 const mails=await page.locator('a[href^="mailto:"]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
 const subjects=new Set();for(const href of mails){const u=new URL(href);assert.equal(u.pathname,'info@openxpand.com');if(u.search)subjects.add(u.searchParams.get('subject'));}assert.equal(subjects.size,2);
 // Intercept activation without handing off to an email client or sending mail.
 await page.evaluate(()=>document.querySelectorAll('a[href^="mailto:"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();document.body.dataset.activated=a.getAttribute('href');})));
 for(const link of await page.locator('.hero a[href^="mailto:"]').all()){await link.click();assert.equal(await page.locator('body').getAttribute('data-activated'),await link.getAttribute('href'));}
 for(const id of ['developers','telcos','apis','platform','contact']){
  for(const target of ['es','en','pt']){
   await page.goto(base+path+'#'+id);
   const link=page.locator('[data-language][lang="'+target+'"]');
   assert.ok((await link.getAttribute('href')).endsWith('#'+id));
   await link.click();
   assert.equal(await page.locator('html').getAttribute('lang'),target);
   assert.equal(new URL(page.url()).hash,'#'+id);
  }
 }
 const urls=await page.locator('a[href],img[src],link[rel=stylesheet]').evaluateAll(es=>es.map(e=>e.getAttribute('href')||e.getAttribute('src')));
 for(const href of urls){if(href.startsWith('#'))assert.equal(await page.locator(href).count(),1);else if(href.startsWith('/'))assert.equal((await fetch(base+href.split('#')[0])).status,200);}
 for(const width of [360,768,1440]){await page.setViewportSize({width,height:900});await page.goto(base+path);await page.evaluate(()=>document.fonts.ready);assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${lang} ${width}`);assert.ok(await page.locator('h1').evaluate(e=>e.scrollWidth<=e.clientWidth),'heading text must not be clipped');const axe=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();await writeFile(`evidence/axe-${lang}-${width}.json`,JSON.stringify(axe,null,2));assert.deepEqual(axe.violations,[],JSON.stringify(axe.violations));await page.screenshot({path:`evidence/${lang}-${width}.png`,fullPage:true});report.push({lang,width,axeViolations:axe.violations.length,horizontalOverflow:false});}
 console.log('Keyboard',lang);
 await page.goto(base+path);await page.keyboard.press('Tab');assert.equal(await page.locator(':focus').textContent(),lang==='es'?'Saltar al contenido':lang==='en'?'Skip to content':'Saltar para o conteúdo');await page.keyboard.press('Enter');assert.equal(new URL(page.url()).hash,'#main');
 for(const width of [360,1440]){
 await page.setViewportSize({width,height:900});await page.goto(base+path);const focus=[];
 for(let i=0;i<await page.locator('a[href]').count();i++){
  await page.keyboard.press('Tab');focus.push(await page.locator(':focus').evaluate(e=>({text:e.textContent.trim()||e.getAttribute('aria-label'),outline:getComputedStyle(e).outlineStyle})));
  if(width===360&&[0,10,13,16].includes(i))await page.screenshot({path:`evidence/focus-${lang}-${i}.png`});
 }
 assert.ok(focus.every(f=>f.text&&f.outline==='solid'));report.push({lang,width,keyboard:focus});
 }
 await context.close();
 const nojs=await newContext({javaScriptEnabled:false,viewport:{width:360,height:900},reducedMotion:'reduce'});const p=await nojs.newPage();await p.goto(base+path);assert.equal(await p.locator('h1').count(),1);await p.locator('a[href="#apis"]').first().click();assert.equal(new URL(p.url()).hash,'#apis');assert.equal(await p.locator('[data-language]').count(),3);assert.ok(await p.locator('a[href^="mailto:"]').count()>2);await p.locator('[data-language][lang="en"]').click();assert.equal(await p.locator('html').getAttribute('lang'),'en');await nojs.close();
}
const sitemap=await (await fetch(base+'/sitemap.xml')).text();for(const p of ['/','/en/','/pt/'])assert.ok(sitemap.includes(`<loc>https://openxpand.com${p}</loc>`));assert.ok((await (await fetch(base+'/robots.txt')).text()).includes('Sitemap: https://openxpand.com/sitemap.xml'));
// Capture the public reference if it remains accessible; reference failures are documented.
const referenceContext = await newContext();
const reference = await referenceContext.newPage();
try {
 await reference.goto('https://openxpand.com/', {waitUntil:'load',timeout:30000});
 for (const width of [360,768,1440]) {
  await reference.setViewportSize({width,height:900});
  await reference.screenshot({path:`evidence/original-${width}.png`,fullPage:true});
 }
 report.push({originalReference:'captured'});
} catch (error) {
 report.push({originalReference:'unavailable',reason:String(error)});
} finally { await referenceContext.close(); }
await writeFile('evidence/verification.json',JSON.stringify(report,null,2));console.log('PASS: three languages; HTML, portfolio, metadata, links, mail activation, anchors, 9 responsive/axe checks, keyboard and no-JS checks.');
}catch(error){console.error(error);process.exitCode=1;}finally{await Promise.all(contexts.map(context=>context.close()));if(!managed)await browser.close();}
// End this client connection without closing the supervisor-owned browser.
if(managed)process.exit(process.exitCode||0);
