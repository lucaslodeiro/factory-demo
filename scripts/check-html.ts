import fs from 'node:fs';import assert from 'node:assert/strict';import {gzipSync} from 'node:zlib';
import {locales,paths} from '../src/data/catalog';
let count=0;let maxJs=0;
for(const locale of locales)for(const path of paths){
 const route=`/${locale}/${path}`;const html=fs.readFileSync(`dist${route}index.html`,'utf8');count++;
 assert.ok(html.includes(`<html lang="${locale}"`),route);assert.equal((html.match(/<h1[ >]/g)||[]).length,1,route);
 for(const property of ['name="description"','rel="canonical"',...['es','en','pt','x-default'].map(l=>`hreflang="${l}"`)])assert.ok(html.includes(property),`${route} ${property}`);
 assert.ok(html.includes(`href="https://openxpand.com${route}"`),route);
 for(const match of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs))JSON.parse(match[1]);
 if(path.startsWith('contact/'))assert.ok(/<form[^>]*method="post"[^>]*action="\/api\/contact"/.test(html),route+' safe non-JS submission');
 let js=0;
 for(const script of html.matchAll(/<script(?![^>]*application\/ld\+json)([^>]*)>(.*?)<\/script>/gs)){if(script[2].trim())js+=gzipSync(script[2]).length;}
 assert.ok(!/<script type="module">/.test(html),`${route}: CSP requires external module`);
 for(const match of html.matchAll(/(?:href|src)="(\/[^"#?]*)(?:[?#][^"]*)?"/g)){
  const file=`dist${match[1]}`;assert.ok(fs.existsSync(file),`${route}: broken link ${match[1]}`);
  if(file.endsWith('.js'))js+=gzipSync(fs.readFileSync(file)).length;
 }
 assert.ok(js<=81920,`${route}: ${js} gzip bytes`);maxJs=Math.max(maxJs,js);
 for(const img of html.matchAll(/<img\b[^>]+>/g))assert.ok(/width=/.test(img[0])&&/height=/.test(img[0]));
}
assert.ok(fs.readFileSync('dist/sitemap.xml','utf8').includes('https://openxpand.com/es/'));
assert.ok(fs.readFileSync('dist/_redirects','utf8').startsWith('/ /es/ 301'));
console.log(`${count} localized HTML pages: headings, metadata, JSON-LD, links, image dimensions, permanent root rule verified. Max initial own JS: ${maxJs} gzip bytes.`);
