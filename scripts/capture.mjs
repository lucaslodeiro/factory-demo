import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
await fs.mkdir('docs/evidence',{recursive:true});const endpoint=process.env.FACTORY_BROWSER_CDP_URL;const browser=endpoint?await chromium.connectOverCDP(endpoint):await chromium.launch();
for(const width of [360,1440]){const context=await browser.newContext({viewport:{width,height:1000},reducedMotion:'reduce'});const page=await context.newPage();
 await page.goto('https://openxpand.com/',{waitUntil:'networkidle'});await page.locator('img').evaluateAll(async images=>{for(const img of images){img.loading='eager';await img.decode().catch(()=>{});}});await page.screenshot({path:`docs/evidence/original-${width}.png`,fullPage:true});
 for(const route of ['', 'developers/','operators/']){await page.goto(`http://127.0.0.1:4321/es/${route}`,{waitUntil:'networkidle'});await page.locator('img').evaluateAll(async images=>{for(const img of images){img.loading='eager';await img.decode().catch(()=>{});}});await page.screenshot({path:`docs/evidence/new-${route.replace('/','')||'home'}-${width}.png`,fullPage:true});}await context.close();}
if(!endpoint)await browser.close();

// Disconnect the script process without closing the supervisor-owned browser.
if(endpoint)process.exit(0);
