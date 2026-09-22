import assert from 'node:assert/strict';
import {translations} from '../src/data/i18n';
import {apiGroups,catalog,locales,paths} from '../src/data/catalog';
function shape(v:unknown):unknown {if(Array.isArray(v))return v.map(shape);if(v&&typeof v==='object')return Object.fromEntries(Object.entries(v).map(([k,x])=>[k,shape(x)]));assert.equal(typeof v,'string');assert.ok((v as string).trim());return 'string';}
for(const l of locales){assert.deepEqual(shape(translations[l]),shape(translations.es));for(const api of catalog){assert.equal(api.copy[l].length,2);api.copy[l].forEach(s=>assert.ok(s.length>20));}}
assert.equal(catalog.length,10);assert.equal(new Set(catalog.map(a=>a.id)).size,10);assert.equal(new Set(paths).size,paths.length);
const grouped=apiGroups.flatMap(g=>g.apis as readonly string[]);
assert.deepEqual([...grouped].sort(),catalog.map(a=>a.id).sort(),'every API family belongs to exactly one group');
for(const l of locales)assert.equal(translations[l].apiGroups.length,apiGroups.length,`${l} group labels`);
console.log(`Content: three complete locale trees; ten unique API families in ${apiGroups.length} labelled groups; all descriptions and use cases present.`);
