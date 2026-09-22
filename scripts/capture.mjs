// Visual evidence of the main templates, taken from the local production build.
// The run never visits an external site: anything off 127.0.0.1 is aborted.
import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
const origin=`http://127.0.0.1:${process.env.PORT||4321}`;
const routes=[['home',''],['catalog','apis/'],['api-sim-swap','apis/sim-swap/'],['developers','developers/'],['operators','operators/'],['contact-apis','contact/apis/']];
await fs.mkdir('docs/evidence',{recursive:true});
const endpoint=process.env.FACTORY_BROWSER_CDP_URL;const browser=endpoint?await chromium.connectOverCDP(endpoint):await chromium.launch();
for(const width of [360,1440]){
 const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});
 await context.route(url=>!url.href.startsWith(origin),route=>route.abort());
 const page=await context.newPage();
 for(const [name,route] of routes){
  await page.goto(`${origin}/es/${route}`,{waitUntil:'networkidle'});
  // Decode the lazy images first, so the export shows the scrolled experience and not empty slots.
  await page.locator('img').evaluateAll(async images=>{for(const img of images){img.loading='eager';await img.decode().catch(()=>{});}});
  await page.screenshot({path:`docs/evidence/new-${name}-${width}.png`,fullPage:true});
 }
 await context.close();
}
if(!endpoint)await browser.close();

// Disconnect the script process without closing the supervisor-owned browser.
if(endpoint)process.exit(0);
