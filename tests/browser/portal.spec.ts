import {test,expect,origin} from './fixtures';import AxeBuilder from '@axe-core/playwright';
const templates=['','apis/','apis/sim-swap/','developers/','operators/','contact/apis/','contact/demo/','privacy/','404/'];
for(const locale of ['es','en','pt'])test(`locale ${locale}: audience paths, ten APIs and equivalent languages`,async({page})=>{
 await page.goto(`/${locale}/`);await expect(page.locator('h1')).toHaveCount(1);for(const intent of ['apis','demo'])await expect(page.locator(`.hero a[href="/${locale}/contact/${intent}/"]`)).toBeVisible();
 await page.goto(`/${locale}/apis/`);await expect(page.locator('.api-card')).toHaveCount(10);
 for(const path of templates){await page.goto(`/${locale}/${path}`);await expect(page.locator('html')).toHaveAttribute('lang',locale);for(const target of ['es','en','pt'])await expect(page.locator(`.languages a[lang=${target}]`)).toHaveAttribute('href',`/${target}/${path}`);}
});
for(const locale of ['es','en','pt'])test(`locale ${locale}: redesigned home sections and grouped footer`,async({page})=>{
 await page.goto(`/${locale}/`);
 // The whole navigation stays visible and the header carries the primary call to action.
 await expect(page.locator('header .main-nav a')).toHaveCount(3);
 await expect(page.locator(`header .nav-cta[href="/${locale}/contact/apis/"]`)).toBeVisible();
 // Hero: one h1, both conversion paths and an artifact built from the real catalog.
 await expect(page.locator('h1')).toHaveCount(1);
 await expect(page.locator(`.hero a.button.peach[href="/${locale}/contact/apis/"]`)).toBeVisible();
 await expect(page.locator(`.hero a.button.outline[href="/${locale}/contact/demo/"]`)).toBeVisible();
 await expect(page.locator('.hero .chips li')).toHaveCount(10);
 // Audiences: each profile labelled, with its journey and the call to action matching its intent.
 const audiences=page.locator('#audiences .audience-card');await expect(audiences).toHaveCount(2);
 for(const [index,journey,intent] of [[0,'developers','apis'],[1,'operators','demo']] as const){
  await expect(audiences.nth(index).locator(`a[href="/${locale}/${journey}/"]`)).toBeVisible();
  await expect(audiences.nth(index).locator(`a[href="/${locale}/contact/${intent}/"]`)).toBeVisible();
 }
 // Capabilities: ten families in labelled groups, each one reaching its own page.
 await expect(page.locator('#capabilities .api-group .group-heading h3')).toHaveCount(4);
 const families=page.locator('#capabilities .api-card h4 a');await expect(families).toHaveCount(10);
 for(const href of await families.evaluateAll(links=>links.map(link=>link.getAttribute('href'))))expect(href).toMatch(new RegExp(`^/${locale}/apis/[a-z-]+/$`));
 await expect(page.locator('#capabilities .api-card p').first()).not.toBeEmpty();
 // How to start, responsibility instead of invented social proof, and the closing band.
 await expect(page.locator('#start ol.steps li')).toHaveCount(3);
 await expect(page.locator('#start a.button')).toHaveAttribute('href',`/${locale}/contact/apis/`);
 await expect(page.locator('#trust article')).toHaveCount(4);
 await expect(page.locator(`#trust a[href="/${locale}/privacy/"]`)).toBeVisible();
 const band=page.locator('.cta-band');
 for(const intent of ['apis','demo'])await expect(band.locator(`a[href="/${locale}/contact/${intent}/"]`)).toBeVisible();
 await expect(band.locator('a[href="mailto:info@openxpand.com"]')).toBeVisible();
 // Grouped footer, with the language links still pointing at the equivalent route.
 await expect(page.locator('footer nav')).toHaveCount(4);
 await expect(page.locator('footer .footer-title')).toHaveCount(5);
 for(const target of ['es','en','pt'])await expect(page.locator(`.footer-languages a[lang=${target}]`)).toHaveAttribute('href',`/${target}/`);
 // The home page still ships no JavaScript of its own.
 await expect(page.locator('script:not([type="application/ld+json"])')).toHaveCount(0);
});
for(const width of [360,1440])test(`first screen at ${width}px carries brand, headline and both calls to action`,async({page})=>{
 await page.setViewportSize({width,height:width===360?640:900});
 await page.goto('/es/');
 for(const selector of ['header .brand img','.hero h1','.hero .lead','.hero a.button.peach[href="/es/contact/apis/"]','.hero a.button.outline[href="/es/contact/demo/"]']){
  const box=await page.locator(selector).boundingBox();
  expect(box,selector).not.toBeNull();
  expect(box!.y+box!.height,`${selector} below the fold`).toBeLessThanOrEqual(page.viewportSize()!.height);
 }
});
for(const width of [360,768,1440])test(`responsive, axe and keyboard at ${width}px`,async({page})=>{
 await page.setViewportSize({width,height:1000});
 for(const route of templates){await page.goto(`/es/${route}`);expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBeTruthy();const results=await new AxeBuilder({page}).analyze();expect(results.violations.filter(v=>['serious','critical'].includes(v.impact||'')),route).toEqual([]);await page.keyboard.press('Tab');await expect(page.locator(':focus')).toBeVisible();}
});
test('200% equivalent viewport reflow and keyboard navigation',async({page})=>{
 await page.setViewportSize({width:720,height:450});await page.emulateMedia({reducedMotion:'reduce'});
 for(const route of templates){await page.goto(`/es/${route}`);await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),route).toBeTruthy();}
 await page.goto('/es/');await page.keyboard.press('Tab');await page.keyboard.press('Enter');await expect(page).toHaveURL(/#main$/);
});
async function enableToken(page:import('@playwright/test').Page,intent:string){await page.evaluate(intent=>{window.turnstile={render:(_el,options)=>{(options.callback as (v:string)=>void)(intent==='demo'?'demo-token':'apis-token');return 'test-widget';},reset:()=>{}};window.onTurnstileReady?.();},intent);}
for(const locale of ['es','en','pt'])for(const intent of ['apis','demo'])test(`contact ${locale}/${intent}: errors, retry, pending and success`,async({page})=>{
 await page.route('https://challenges.cloudflare.com/**',r=>r.abort());
 await page.goto(`/${locale}/contact/${intent}/?api=sim-swap`);await expect(page.locator('#api')).toHaveValue('sim-swap');await expect(page.locator('.languages a[lang=en]')).toHaveAttribute('href',`${origin}/en/contact/${intent}/?api=sim-swap`);
 await page.locator('button[type=submit]').click();await expect(page.locator('#name')).toHaveAttribute('aria-invalid','true');
 await page.locator('#name').fill('Synthetic Tester');await page.locator('#email').fill('synthetic@example.test');await page.locator('#company').fill('Synthetic Company');await page.locator('#message').fill('Synthetic browser request');await enableToken(page,intent);
 const payloads:Record<string,unknown>[]=[];await page.route('**/api/contact',async route=>{payloads.push(route.request().postDataJSON());await new Promise(r=>setTimeout(r,200));await route.fulfill({status:503,contentType:'application/json',body:'{"error":"retry"}'});});
 await page.locator('button[type=submit]').click();await expect(page.locator('button[type=submit]')).toBeDisabled();await expect(page.locator('button[type=submit]')).toBeEnabled();await expect(page.locator('#message')).toHaveValue('Synthetic browser request');
 await page.unroute('**/api/contact');await page.route('**/api/contact',async route=>{payloads.push(route.request().postDataJSON());await route.continue();});await enableToken(page,intent);await page.locator('button[type=submit]').click();await expect(page.locator('#message')).toHaveValue('');await expect(page.locator('#status')).toContainText({es:'Solicitud enviada',en:'Request sent',pt:'Solicitação enviada'}[locale]!);expect(payloads[0].requestId).toBe(payloads[1].requestId);expect(payloads[1]).toMatchObject({intent,locale,api:'sim-swap'});
});
test('root redirect, localized 404 and parameter canonical',async({request,page})=>{const root=await request.get('/',{maxRedirects:0});expect(root.status()).toBe(301);expect(root.headers().location).toBe('/es/');const missing=await request.get('/pt/missing/');expect(missing.status()).toBe(404);expect(await missing.text()).toContain('Não encontramos');await page.goto('/es/contact/apis/?api=unapproved');await expect(page.locator('#api')).toHaveValue('');await expect(page.locator('link[rel=canonical]')).toHaveAttribute('href','https://openxpand.com/es/contact/apis/');});

test('keyboard reaches every main control with visible focus',async({page})=>{
 for(const route of templates){
  await page.goto(`/es/${route}`);
  const controls=page.locator('a[href],button,input:not([type=hidden]):not([tabindex="-1"]),select,textarea,summary');
  const count=await controls.count();const seen=new Set<number>();
  for(let i=0;i<count*2+4 && seen.size<count;i++){
   await page.keyboard.press('Tab');
   const active=page.locator(':focus');if(await active.count()===0)continue;
   const index=await controls.evaluateAll(elements=>elements.findIndex(element=>element===document.activeElement));
   if(index<0)continue;seen.add(index);await expect(active).toBeVisible();
   expect(await active.evaluate(el=>getComputedStyle(el).outlineStyle)).not.toBe('none');
  }
  expect(seen.size,route).toBe(count);
 }
});

for(const locale of ['es','en','pt'])for(const intent of ['apis','demo'])test(`mail draft ${locale}/${intent}: unconfigured delivery`,async({page})=>{
 await page.route('https://challenges.cloudflare.com/**',r=>r.abort());
 await page.route('**/api/contact',r=>r.fulfill({status:200,contentType:'application/json',body:'{"fallback":"mailto"}'}));
 await page.goto(`/${locale}/contact/${intent}/?api=sim-swap`);
 // Prevent launching a native mail application while inspecting the actual generated link.
 await page.locator('#mail-fallback').evaluate(el=>el.addEventListener('click',e=>e.preventDefault()));
 await page.locator('#name').fill('Synthetic Tester');await page.locator('#email').fill('synthetic@example.test');await page.locator('#company').fill('Test & Co');await page.locator('#message').fill('Accents: á & ? #\nSecond line');
 await page.locator('button[type=submit]').click();
 const link=page.locator('#mail-fallback');await expect(link).toBeVisible();
 const href=await link.getAttribute('href');const url=new URL(href!);expect(url.protocol).toBe('mailto:');expect(url.pathname).toBe('info@openxpand.com');
 const body=url.searchParams.get('body')!;for(const value of ['Synthetic Tester','synthetic@example.test','Test & Co','Accents: á & ? #\nSecond line','sim-swap',locale])expect(body).toContain(value);
 expect(url.searchParams.get('subject')).toContain(intent==='apis'?{es:'Solicitar acceso',en:'Request API',pt:'Solicitar acesso'}[locale]!:{es:'Conversemos',en:'talk',pt:'conversar'}[locale]!);
 await expect(page.locator('#status')).toContainText({es:'Todavía no se envió',en:'It has not been sent',pt:'Ainda não foi enviado'}[locale]!);
 await expect(page.locator('#message')).toHaveValue('Accents: á & ? #\nSecond line');await expect(page).toHaveURL(new RegExp(`/${locale}/contact/${intent}/\\?api=sim-swap$`));
});
