import type { APIRoute } from 'astro';
import {paths} from '../data/content';
export const GET: APIRoute = ({site}) => new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${Object.values(paths).map(path=>`<url><loc>${new URL(path,site).href}</loc></url>`).join('')}</urlset>`,{headers:{'Content-Type':'application/xml'}});
