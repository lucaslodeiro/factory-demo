import {chromium} from '@playwright/test';import fs from 'node:fs/promises';
await fs.mkdir('docs/evidence',{recursive:true});const browser=await chromium.launch();
for(const width of [360,1440]){const page=await browser.newPage({viewport:{width,height:1000},reducedMotion:'reduce'});
 await page.goto('https://openxpand.com/',{waitUntil:'networkidle'});await page.screenshot({path:`docs/evidence/original-${width}.png`,fullPage:true});
 for(const route of ['', 'developers/','operators/']){await page.goto(`http://127.0.0.1:4321/es/${route}`,{waitUntil:'networkidle'});await page.screenshot({path:`docs/evidence/new-${route.replace('/','')||'home'}-${width}.png`,fullPage:true});}await page.close();}
await browser.close();
