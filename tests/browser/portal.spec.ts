import {test,expect} from '@playwright/test';import AxeBuilder from '@axe-core/playwright';
const templates=['','apis/','apis/sim-swap/','developers/','operators/','contact/apis/','contact/demo/','privacy/','404/'];
for(const locale of ['es','en','pt'])test(`locale ${locale}: audience paths, ten APIs and equivalent languages`,async({page})=>{
 await page.goto(`/${locale}/`);await expect(page.locator('h1')).toHaveCount(1);for(const intent of ['apis','demo'])await expect(page.locator(`.hero a[href="/${locale}/contact/${intent}/"]`)).toBeVisible();
 await page.goto(`/${locale}/apis/`);await expect(page.locator('.api-card')).toHaveCount(10);
 for(const path of templates){await page.goto(`/${locale}/${path}`);await expect(page.locator('html')).toHaveAttribute('lang',locale);for(const target of ['es','en','pt'])await expect(page.locator(`.languages a[lang=${target}]`)).toHaveAttribute('href',`/${target}/${path}`);}
});
for(const width of [360,768,1440])test(`responsive, axe and keyboard at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});
 for(const route of templates){await page.goto(`/es/${route}`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();const results=await new AxeBuilder({page}).analyze();expect(results.violations.filter(v=>['serious','critical'].includes(v.impact||'')),route).toEqual([]);await page.keyboard.press('Tab');await expect(page.locator(':focus')).toBeVisible();}
});
test('200% equivalent viewport reflow and keyboard navigation',async({page})=>{
 await page.setViewportSize({width:720,height:450});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of templates){await page.goto(`/es/${route}`);await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();}
 await page.goto('/es/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page).toHaveURL(/#main$/);
});
async function enableToken(page:import('@playwright/test').Page,intent:string){await page.evaluate(intent=>{window.turnstile={render:(_el,options)=>{(options.callback as (v:string)=>void)(intent==='demo'?'demo-token':'apis-token');return 'test-widget';},reset:()=>{}};window.onTurnstileReady?.();},intent);}
for(const locale of ['es','en','pt'])for(const intent of ['apis','demo'])test(`contact ${locale}/${intent}: errors, retry, pending and success`,async({page})=>{
 await page.route('https://challenges.cloudflare.com/**',r=>r.abort());
 await page.goto(`/${locale}/contact/${intent}/?api=sim-swap`);await expect(page.locator('#api')).toHaveValue('sim-swap');await expect(page.locator('.languages a[lang=en]')).toHaveAttribute('href',`/en/contact/${intent}/?api=sim-swap`);
 await page.locator('button[type=submit]').click();await expect(page.locator('#name')).toHaveAttribute('aria-invalid','true');
 await page.locator('#name').fill('Synthetic Tester');await page.locator('#email').fill('synthetic@example.test');await page.locator('#company').fill('Synthetic Company');await page.locator('#message').fill('Synthetic browser request');await enableToken(page,intent);
 const payloads:Record<string,unknown>[]=[];await page.route('**/api/contact',async route=>{payloads.push(route.request().postDataJSON());await new Promise(r=>setTimeout(r,200));await route.fulfill({status:503,contentType:'application/json',body:'{"error":"retry"}'});});
 await page.locator('button[type=submit]').click();await expect(page.locator('button[type=submit]')).toBeDisabled();await expect(page.locator('button[type=submit]')).toBeEnabled();await expect(page.locator('#message')).toHaveValue('Synthetic browser request');
 await page.unroute('**/api/contact');await page.route('**/api/contact',async route=>{payloads.push(route.request().postDataJSON());await route.continue();});await enableToken(page,intent);await page.locator('button[type=submit]').click();await expect(page.locator('#message')).toHaveValue('');await expect(page.locator('#status')).toContainText({es:'Solicitud enviada',en:'Request sent',pt:'Solicitação enviada'}[locale]!);expect(payloads[0].requestId).toBe(payloads[1].requestId);expect(payloads[1]).toMatchObject({intent,locale,api:'sim-swap'});
});
test('root redirect, localized 404 and parameter canonical',async({request,page})=>{const root=await request.get('/',{maxRedirects:0});expect(root.status()).toBe(301);expect(root.headers().location).toBe('/es/');const missing=await request.get('/pt/missing/');expect(missing.status()).toBe(404);expect(await missing.text()).toContain('Não encontramos');await page.goto('/es/contact/apis/?api=unapproved');await expect(page.locator('#api')).toHaveValue('');await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://openxpand.com/es/contact/apis/');});
