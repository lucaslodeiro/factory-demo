interface Turnstile {render:(el:string,options:Record<string,unknown>)=>string;reset:(id:string)=>void}
declare global {interface Window {turnstile?:Turnstile;onTurnstileReady?:()=>void}}
const form=document.querySelector<HTMLFormElement>('#contact');
if(form){
 const copy=JSON.parse(form.dataset.copy!);const status=document.querySelector<HTMLElement>('#status')!;const button=form.querySelector<HTMLButtonElement>('button[type=submit]')!;
 let token='';let widget:string|undefined;let sending=false;let requestId=crypto.randomUUID();let priorPayload='';
 const selection=form.querySelector<HTMLSelectElement>('#api')!;
 const selected=new URLSearchParams(location.search).get('api');if(selected&&Array.from(selection.options).some(o=>o.value===selected))selection.value=selected;
 // Only catalog identifiers may be preserved across locale switches.
 if(selected&&selection.value===selected)document.querySelectorAll<HTMLAnchorElement>('.languages a').forEach(a=>a.search=`?api=${encodeURIComponent(selected)}`);
 window.onTurnstileReady=()=>{widget=window.turnstile!.render('#security',{'sitekey':form.dataset.sitekey,'action':`contact_${form.dataset.intent}`,'language':form.dataset.locale,'size':'flexible','response-field':false,callback:(value:string)=>{token=value;},'expired-callback':()=>{token='';},'error-callback':()=>{token='';status.textContent=copy.spamError;}});};
 if(form.dataset.sitekey){const script=document.createElement('script');script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileReady&render=explicit';script.async=true;script.onerror=()=>{status.textContent=copy.spamError;};document.head.append(script);}
 const mark=(name:string,message:string)=>{const el=form.querySelector<HTMLInputElement|HTMLTextAreaElement>(`[name="${name}"]`);const target=document.getElementById(`${name}-error`);if(el&&target){el.setAttribute('aria-invalid',message?'true':'false');target.textContent=message;}};
 form.addEventListener('submit',async event=>{
  event.preventDefault();if(sending)return;
  let first:HTMLElement|undefined;
  for(const name of ['name','email','company','message']){const el=form.elements.namedItem(name) as HTMLInputElement;const invalid=!el.checkValidity()||!el.value.trim()||(name!=='message'&&/[\r\n\x00-\x1f\x7f]/.test(el.value));mark(name,invalid?(name==='email'?copy.emailError:copy.fieldError):'');if(invalid&&!first)first=el;}
  if(first){status.textContent=copy.invalid;first.focus();return;}
  if(!token){status.textContent=copy.spamError;status.focus();return;}
  const fields=Object.fromEntries(new FormData(form));const payload={...fields,intent:form.dataset.intent,locale:form.dataset.locale};
  const fingerprint=JSON.stringify(payload);if(priorPayload&&priorPayload!==fingerprint)requestId=crypto.randomUUID();priorPayload=fingerprint;
  sending=true;button.disabled=true;form.setAttribute('aria-busy','true');status.textContent=copy.sending;
  try{
   const res=await fetch('/api/contact',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload,token,requestId}),signal:AbortSignal.timeout(22000)});
   const result=await res.json();
   if(res.ok&&result.ok===true){status.textContent=copy.success;form.reset();requestId=crypto.randomUUID();priorPayload='';}
   else{status.textContent=result.error==='antispam'?copy.spamError:copy.error;if(Array.isArray(result.fields)) for(const field of result.fields)if(['name','email','company','message'].includes(field))mark(field,field==='email'?copy.emailError:copy.fieldError);}
  }catch{status.textContent=copy.error;}
  finally{sending=false;button.disabled=false;form.removeAttribute('aria-busy');token='';if(widget!==undefined)window.turnstile?.reset(widget);status.focus();}
 });
}
export {};
