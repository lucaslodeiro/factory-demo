import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import { parseHTML } from 'linkedom';

const origin = 'https://openxpand.com';
const base = process.env.TEST_URL || 'http://127.0.0.1:4321';
const routes = { es: '/', en: '/en/', pt: '/pt/' };
const names = ['SIM Swap', 'Number Verification', 'Device Status', 'IMEI Fraud', 'Know your Customer', 'One-Time Password', 'Device Location', 'Quality on Demand', 'Geofencing', 'Connectivity Insights', 'Simple Edge Discovery'];
const expectedSubjects = {
  es: ['Solicitud de demo para Telcos', 'Solicitud de acceso a las APIs'],
  en: ['Telco demo request', 'API access request'],
  pt: ['Pedido de demonstração para Telcos', 'Pedido de acesso às APIs'],
};
const report = [];
const titles = new Set();
const descriptions = new Set();
for (const [lang, path] of Object.entries(routes)) {
  const response = await fetch(base + path);
  assert.equal(response.status, 200);
  assert.match(response.headers.get('content-type'), /text\/html/);
  const html = await response.text();
  const { document } = parseHTML(html);
  const q = selector => document.querySelector(selector);
  assert.equal(q('html').lang, lang);
  assert.equal(document.querySelectorAll('h1').length, 1);
  assert.ok(q('h1').textContent.length > 40);
  for (const id of ['main', 'developers', 'telcos', 'apis', 'platform', 'contact']) assert.ok(q('#' + id));
  assert.equal(document.querySelectorAll('.api-card').length, 3);
  const apiLabels = [...document.querySelectorAll('.api-card li')].map(e => e.textContent.replace('↗', '').trim());
  assert.deepEqual(apiLabels, names);
  assert.equal(document.querySelectorAll('.capabilities article').length, 5);
  assert.equal(document.querySelectorAll('form,input,textarea,iframe').length, 0);
  assert.equal(q('link[rel="canonical"]').getAttribute('href'), origin + path);
  for (const [locale, target] of Object.entries({ ...routes, 'x-default': '/' })) {
    assert.equal(q(`link[hreflang="${locale}"]`).getAttribute('href'), origin + target);
  }
  titles.add(q('title').textContent);
  descriptions.add(q('meta[name="description"]').getAttribute('content'));
  assert.equal(q('meta[property="og:title"]').getAttribute('content'), q('title').textContent);
  assert.equal(q('meta[property="og:description"]').getAttribute('content'), q('meta[name="description"]').getAttribute('content'));
  assert.equal(q('meta[property="og:url"]').getAttribute('content'), origin + path);
  const graph = JSON.parse(q('script[type="application/ld+json"]').textContent)['@graph'];
  assert.deepEqual(graph.map(e => e['@type']), ['Organization', 'WebSite']);
  assert.equal(graph[0].email, 'info@openxpand.com');
  assert.equal(graph[0].url, origin + '/');
  assert.deepEqual(graph[1].inLanguage, ['es', 'en', 'pt']);
  const subjects = new Set();
  for (const a of document.querySelectorAll('a')) {
    const href = a.getAttribute('href');
    assert.ok(a.textContent.trim() || a.getAttribute('aria-label') || a.querySelector('img[alt]'));
    if (href.startsWith('mailto:')) {
      const url = new URL(href);
      assert.equal(url.pathname, 'info@openxpand.com');
      if (url.search) subjects.add(url.searchParams.get('subject'));
    } else if (href.startsWith('#')) {
      assert.ok(q(href), `Missing anchor ${href}`);
    } else {
      assert.ok(href.startsWith('/'), `Unexpected external navigation ${href}`);
      assert.equal((await fetch(base + href)).status, 200);
    }
  }
  assert.deepEqual([...subjects].sort(), expectedSubjects[lang].sort());
  assert.ok(q('.email').textContent.includes('info@openxpand.com'));
  let ownJs = 0;
  for (const script of document.querySelectorAll('script')) {
    if (script.type === 'application/ld+json') continue;
    const src = script.getAttribute('src');
    if (src) assert.ok(src.startsWith('/'));
    const code = src ? await readFile('dist' + src) : script.textContent;
    ownJs += gzipSync(code).length;
  }
  assert.ok(ownJs <= 51200);
  for (const image of document.querySelectorAll('img')) {
    assert.ok(image.getAttribute('width') && image.getAttribute('height') && image.getAttribute('alt'));
    assert.equal((await fetch(base + image.getAttribute('src'))).status, 200);
    if (image.closest('footer')) assert.equal(image.getAttribute('loading'), 'lazy');
  }
  for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
    const cssResponse = await fetch(base + link.getAttribute('href'));
    assert.equal(cssResponse.status, 200);
    const css = await cssResponse.text();
    assert.match(css, /font-display:swap/);
    for (const match of css.matchAll(/url\(([^)]+)\)/g)) {
      const resource = match[1].replaceAll('"', '').replaceAll("'", '');
      assert.ok(resource.startsWith('/'), resource);
      assert.equal((await fetch(base + resource)).status, 200);
    }
  }
  report.push({ lang, route: path, status: response.status, apiCount: apiLabels.length, initialOwnJavaScriptGzipBytes: ownJs, staticChecks: 'passed' });
}
assert.equal(titles.size, 3);
assert.equal(descriptions.size, 3);
const sitemap = await (await fetch(base + '/sitemap.xml')).text();
for (const route of Object.values(routes)) assert.ok(sitemap.includes(`<loc>${origin}${route}</loc>`));
assert.equal((sitemap.match(/<loc>/g) || []).length, 3);
const robots = await (await fetch(base + '/robots.txt')).text();
assert.ok(robots.includes('Sitemap: ' + origin + '/sitemap.xml'));
assert.ok(!robots.includes('Disallow: /'));
await mkdir('evidence', { recursive: true });
await writeFile('evidence/static.json', JSON.stringify(report, null, 2) + '\n');
console.log('PASS: 3 static HTTP routes; complete portfolio, sections, localized mailto, metadata, structured data, local resources, anchors, sitemap, robots and JS budget.', report);
