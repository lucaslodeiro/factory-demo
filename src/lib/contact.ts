import { catalog, locales, type Locale, type Intent, type ApiId } from '../data/catalog';
export interface Contact { intent:Intent; locale:Locale; name:string; email:string; company:string; message:string; api?:ApiId; token:string; website:string; requestId:string }
export const limits = {name:100, email:254, company:160, message:5000} as const;
export function validate(input: unknown, requireToken = true): {data?: Contact; errors: string[]} {
 if (!input || typeof input !== 'object' || Array.isArray(input)) return {errors:['form']};
 const v = input as Record<string,unknown>; const errors:string[]=[];
 const allowed=['intent','locale','name','email','company','message','api','token','website','requestId'];
 if(Object.keys(v).some(k=>!allowed.includes(k))) errors.push('form');
 for (const [key,max] of Object.entries(limits)) {
  const s=v[key];
  if(typeof s!=='string'||!s.trim()||s.length>max|| (key!=='message' && /[\r\n\x00-\x1f\x7f]/.test(s))) errors.push(key);
 }
 if(typeof v.email==='string'&&!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(v.email)) errors.push('email');
 if(!['apis','demo'].includes(v.intent as string)) errors.push('intent');
 if(!locales.includes(v.locale as Locale)) errors.push('locale');
 if(v.api!==undefined && v.api!=='' && !catalog.some(a=>a.id===v.api)) errors.push('api');
 if(typeof v.token!=='string'||(requireToken&&!v.token)||v.token.length>2048) errors.push('token');
 if(v.website!=='' || typeof v.requestId!=='string'|| !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(v.requestId)) errors.push('form');
 if(errors.length) return {errors:[...new Set(errors)]};
 const data={...v} as unknown as Contact;
 for (const key of Object.keys(limits) as (keyof typeof limits)[]) data[key]=data[key].trim();
 return {data,errors:[]};
}
export interface Env { SITE_ORIGIN:string; TURNSTILE_SECRET_KEY:string; RESEND_API_KEY:string; MAIL_FROM:string }
const reply=(status:number, body:object)=>new Response(JSON.stringify(body),{status,headers:{'Content-Type':'application/json','Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
const escape=(s:string)=>s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!));
async function readLimited(request:Request) {
 if(Number(request.headers.get('content-length'))>16384) throw new Error('size');
 const reader=request.body?.getReader(); if(!reader) throw new Error('json');
 let size=0;const parts:Uint8Array[]=[];
 try { while(true){const {done,value}=await reader.read();if(done)break;size+=value.length;if(size>16384){await reader.cancel();throw new Error('size');}parts.push(value);} }
 finally {reader.releaseLock();}
 const bytes=new Uint8Array(size);let p=0;for(const part of parts){bytes.set(part,p);p+=part.length;}
 return JSON.parse(new TextDecoder('utf-8',{fatal:true}).decode(bytes));
}
export async function handleContact(request:Request, env:Env, fetcher:typeof fetch=fetch):Promise<Response> {
 if(request.method!=='POST') return reply(405,{error:'method'});
 if(!env.SITE_ORIGIN||new URL(request.url).origin!==env.SITE_ORIGIN||request.headers.get('origin')!==env.SITE_ORIGIN) return reply(403,{error:'origin'});
 if(request.headers.get('content-type')?.split(';')[0].trim()!=='application/json') return reply(415,{error:'type'});
 let input:unknown;
 try{input=await readLimited(request);}catch(e){return reply(e instanceof Error&&e.message==='size'?413:400,{error:'invalid'});}
 const mailConfigured=Boolean(env.RESEND_API_KEY&&env.MAIL_FROM);
 const {data,errors}=validate(input,mailConfigured);if(!data)return reply(400,{error:'invalid',fields:errors});
 // A draft is not a provider acceptance; no external call in unconfigured mode.
 if(!mailConfigured)return reply(200,{fallback:'mailto'});
 if(!env.TURNSTILE_SECRET_KEY||!env.RESEND_API_KEY||!env.MAIL_FROM||/[\r\n]/.test(env.MAIL_FROM)) return reply(503,{error:'unavailable'});
 try {
  const verification=await fetcher('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:data.token}),signal:AbortSignal.timeout(8000)});
  if(!verification.ok)return reply(503,{error:'retry'});
  const check=await verification.json() as {success?:boolean;hostname?:string;action?:string};
  if(!check.success||check.hostname!==new URL(env.SITE_ORIGIN).hostname||check.action!==`contact_${data.intent}`) return reply(400,{error:'antispam'});
  const text=[`Intent: ${data.intent}`,`Locale: ${data.locale}`,`Name: ${data.name}`,`Email: ${data.email}`,`Company: ${data.company}`,`API: ${data.api||'-'}`,`Message:\n${data.message}`].join('\n');
  // Bind the idempotency key to both the logical attempt and immutable message data.
  const digest=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text));
  const hash=Array.from(new Uint8Array(digest),b=>b.toString(16).padStart(2,'0')).join('');
  const sent=await fetcher('https://api.resend.com/emails',{method:'POST',headers:{Authorization:`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`contact-${data.requestId}-${hash}`},body:JSON.stringify({from:env.MAIL_FROM,to:['info@openxpand.com'],reply_to:data.email,subject:`OpenXpand | ${data.intent} | ${data.locale}`,text,html:`<pre>${escape(text)}</pre>`}),signal:AbortSignal.timeout(10000)});
  if(!sent.ok)return reply(503,{error:'retry'});
  const receipt=await sent.json() as {id?:string};
  if(!receipt.id)return reply(503,{error:'retry'});
  return reply(200,{ok:true});
 } catch {return reply(503,{error:'retry'});}
}
