// Ortak: tarayıcı bağlamı (sahte veri, sabit saat, örnek kayıtlar)
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const {kur,ZAMAN}=require('./sahte.js');
async function baglam(opt={}){
  const b=await chromium.launch({args:['--allow-file-access-from-files','--disable-web-security','--autoplay-policy=no-user-gesture-required']});
  const ctx=await b.newContext({viewport:opt.viewport||{width:1080,height:1920},deviceScaleFactor:opt.dpr||1,timezoneId:'Europe/Istanbul',locale:'tr-TR'});
  await kur(ctx);await ctx.clock.install({time:ZAMAN});
  await ctx.addInitScript(dil=>{try{if(location.protocol!=='file:'||!location.pathname.endsWith('/www/index.html'))return;
    const s=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
    if(!localStorage.getItem('hazir')){
      s('loc',{type:'city',il:'İstanbul',ilce:'Merkez'});
      s('kabirlar',[{id:'a1',ad:'Mehmet Ali Yılmaz',dogum:'1941',vefat:'2019',yakin:'Dedem',mezarlik:'Karacaahmet Mezarlığı',sehir:'İstanbul',okunan:[],eklendi:1},{id:'a2',ad:'Fatma Yılmaz',dogum:'1946',vefat:'2022',yakin:'Babaannem',mezarlik:'Karacaahmet Mezarlığı',sehir:'İstanbul',okunan:[],eklendi:2}]);
      s('hazir',1);
    }
    if(dil)s('dil',dil);
    document.addEventListener('DOMContentLoaded',()=>{const st=document.createElement('style');st.textContent='#adph{display:none!important}:root{--adh:0px!important}';document.head.appendChild(st)});
  }catch(e){}},opt.dil||null);
  return {b,ctx};
}
module.exports={baglam};
