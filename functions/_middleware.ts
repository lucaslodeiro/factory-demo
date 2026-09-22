// Keep a real HTTP 404 status while returning the visitor's localized error page.
export async function onRequest(context:{request:Request;next:()=>Promise<Response>;env:{ASSETS:{fetch:typeof fetch}}}) {
 const response=await context.next();
 if(response.status!==404||new URL(context.request.url).pathname.startsWith('/api/'))return response;
 const url=new URL(context.request.url);const locale=url.pathname.split('/')[1];
 if(!['es','en','pt'].includes(locale))return response;
 url.pathname=`/${locale}/404/`;url.search='';
 const page=await context.env.ASSETS.fetch(url);
 return new Response(page.body,{status:404,headers:page.headers});
}
