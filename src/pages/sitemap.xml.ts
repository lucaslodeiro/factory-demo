import {locales,paths} from '../data/catalog';
export function GET(){return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${locales.flatMap(l=>paths.filter(p=>p!=='404/').map(p=>`<url><loc>https://openxpand.com/${l}/${p}</loc></url>`)).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});}
