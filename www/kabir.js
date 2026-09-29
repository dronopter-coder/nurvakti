/* Nûr Vakti – Kabir modülü: mezar fotoğrafı, taştan bilgi okuma (OCR), kayıtlar, Cuma Fâtiha/Yâsîn okuması */
(function(){
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const $$=s=>document.querySelectorAll(s);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,6);

/* ---------- Kayıt deposu: bilgiler localStorage, fotoğraflar IndexedDB ---------- */
let kayit=ls.get('kabirlar',[]);
const kaydet=()=>ls.set('kabirlar',kayit);
const idb=(()=>{
  let db;
  const open=()=>db||(db=new Promise((res,rej)=>{
    const r=indexedDB.open('nurvakti-kabir',1);
    r.onupgradeneeded=()=>r.result.createObjectStore('foto');
    r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);
  }));
  const tx=async(mode,fn)=>{const d=await open();return new Promise((res,rej)=>{const t=d.transaction('foto',mode),q=fn(t.objectStore('foto'));t.oncomplete=()=>res(q&&q.result);t.onerror=()=>rej(t.error)})};
  return{get:k=>tx('readonly',s=>s.get(k)),set:(k,v)=>tx('readwrite',s=>s.put(v,k)),del:k=>tx('readwrite',s=>s.delete(k))};
})();
const urls={};
async function fotoUrl(id,thumb){
  const key=id+(thumb?':t':'');
  if(urls[key])return urls[key];
  try{const b=await idb.get(key);if(b)return urls[key]=URL.createObjectURL(b)}catch(e){}
  return null;
}
function dropUrl(id){[id,id+':t'].forEach(k=>{if(urls[k]){URL.revokeObjectURL(urls[k]);delete urls[k]}})}

/* ---------- Cuma döngüsü: bugün Cuma ise bugün, değilse gelecek Cuma ---------- */
function cumaAnahtar(d=new Date()){
  const x=new Date(d.getFullYear(),d.getMonth(),d.getDate());
  x.setDate(x.getDate()+((5-x.getDay()+7)%7));
  return x.getFullYear()+'-'+p2(x.getMonth()+1)+'-'+p2(x.getDate());
}
const bugunCuma=()=>new Date().getDay()===5;
const cumaGecesi=()=>new Date().getDay()===4&&new Date().getHours()>=17;
const okundu=k=>(k.okunan||[]).includes(cumaAnahtar());
const bekleyen=()=>kayit.filter(k=>!okundu(k));

/* ---------- Taş yazısı ayrıştırma ---------- */
const fold=s=>s.toLocaleUpperCase('tr').replace(/İ/g,'I').replace(/Ğ/g,'G').replace(/Ü/g,'U').replace(/Ş/g,'S').replace(/Ö/g,'O').replace(/Ç/g,'C').replace(/[ÂÎÛ]/g,m=>({'Â':'A','Î':'I','Û':'U'}[m]));
const DURAK=/RUHUNA|RUHUN|FATIHA|MERHUM|RAHMETL|ALLAH|RAHMET|EYLES|HUVELBAKI|BAKI\b|DOGUM|OLUM|VEFAT|TARIH|MEZAR|YASIN|INNA|ILEYH/;
const UNVAN=/^(MERHUM[AE]?|RAHMETLI|HACI|HACCI|HAC|HAFIZ|DR|PROF)\.?\s+/;
const baslikYaz=s=>s.trim().split(/\s+/).map(w=>w.charAt(0).toLocaleUpperCase('tr')+w.slice(1).toLocaleLowerCase('tr')).join(' ');
function kbParse(text){
  const out={ad:'',dogum:'',vefat:'',hamTarih:[]};
  const lines=String(text||'').split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const yilMax=new Date().getFullYear();
  const items=[];
  lines.forEach((l,li)=>{
    let rest=l;
    rest=rest.replace(/(\d{1,2})\s*[.\-\/]\s*(\d{1,2})\s*[.\-\/]\s*((?:18|19|20)\d{2})/g,(m,d,mo,y)=>{
      if(+y<=yilMax&&+mo>=1&&+mo<=12&&+d>=1&&+d<=31)items.push({y:+y,s:p2(+d)+'.'+p2(+mo)+'.'+y,li});
      return ' ';
    });
    (rest.match(/(?<!\d)(?:18|19|20)\d{2}(?!\d)/g)||[]).forEach(y=>{if(+y<=yilMax)items.push({y:+y,s:y,li})});
  });
  // Aynı yıl hem tam tarih hem yıl olarak çıkmışsa tam tarihi tut
  const uniq=[];
  items.forEach(it=>{const j=uniq.findIndex(u=>u.y===it.y);if(j<0)uniq.push(it);else if(it.s.length>uniq[j].s.length)uniq[j]=it});
  uniq.sort((a,b)=>a.y-b.y);
  if(uniq.length>=2){out.dogum=uniq[0].s;out.vefat=uniq[uniq.length-1].s}
  else if(uniq.length===1){
    const f=fold(lines[uniq[0].li]);
    if(/DOGUM|\bD[.:]/.test(f))out.dogum=uniq[0].s;else out.vefat=uniq[0].s;
  }
  // Ad soyad: rakamsız, yalnız harf içeren, ibare olmayan satırlar
  const adaylar=[];
  lines.forEach(l=>{
    if(/\d/.test(l))return;
    let t=l.replace(/[^A-Za-zÇĞİIÖŞÜçğıiöşüÂâÎîÛû.'\s]/g,' ').replace(/\s+/g,' ').trim();
    const um=fold(t).match(UNVAN);if(um)t=t.slice(um[0].length);
    const f=fold(t);
    if(t.replace(/[^A-Za-zÇĞİIÖŞÜçğıiöşü]/g,'').length<4||DURAK.test(f))return;
    const w=t.split(' ').filter(x=>x.replace(/\./g,'').length>1);
    if(!w.length||w.length>5)return;
    adaylar.push({t:w.join(' '),n:w.length});
  });
  const iyi=adaylar.find(a=>a.n>=2&&a.n<=4)||adaylar[0];
  if(iyi)out.ad=baslikYaz(iyi.t);
  return out;
}
window.kbParse=kbParse;

/* ---------- OCR (Tesseract, tamamen cihazda; ocr/ klasöründen çalışır) ---------- */
let ocrWorker=null,ocrProg=()=>{};
const mutlak=p=>new URL(p,location.href).href;
function betikYukle(src){return new Promise((res,rej)=>{if(window.Tesseract)return res();const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=()=>rej(new Error('ocr'));document.head.appendChild(s)})}
async function ocrHazir(){
  if(ocrWorker)return ocrWorker;
  await betikYukle('ocr/tesseract.min.js');
  ocrWorker=await Tesseract.createWorker('tur',1,{
    workerPath:mutlak('ocr/worker.min.js'),corePath:mutlak('ocr/'),langPath:mutlak('ocr/'),
    gzip:false,workerBlobURL:false,cacheMethod:'none',
    logger:m=>{if(m.status==='recognizing text')ocrProg(m.progress)}
  });
  await ocrWorker.setParameters({tessedit_pageseg_mode:'11',preserve_interword_spaces:'1'});
  return ocrWorker;
}
function resimYukle(blob){return new Promise((res,rej)=>{const u=URL.createObjectURL(blob),i=new Image();i.onload=()=>{URL.revokeObjectURL(u);res(i)};i.onerror=()=>{URL.revokeObjectURL(u);rej(new Error('img'))};i.src=u})}
function tuvale(img,maks,mode){ // mode: 0 = olduğu gibi, 1 = gri + kontrast, 2 = gri + kontrast + ters
  const w0=img.naturalWidth||img.width,h0=img.naturalHeight||img.height;
  let k=Math.min(1,maks/Math.max(w0,h0));
  if(mode&&Math.max(w0,h0)<1400)k=1400/Math.max(w0,h0);
  const c=document.createElement('canvas');c.width=Math.round(w0*k);c.height=Math.round(h0*k);
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0,c.width,c.height);
  if(!mode)return c;
  const d=x.getImageData(0,0,c.width,c.height),p=d.data,hist=new Uint32Array(256);
  for(let i=0;i<p.length;i+=4){const g=(p[i]*.299+p[i+1]*.587+p[i+2]*.114)|0;p[i]=g;hist[g]++}
  const n=p.length/4;let a=0,lo=0,hi=255;
  for(;lo<255&&(a+=hist[lo])<n*.02;lo++);a=0;for(;hi>0&&(a+=hist[hi])<n*.02;hi--);
  const r=Math.max(hi-lo,1);
  for(let i=0;i<p.length;i+=4){let g=Math.max(0,Math.min(255,((p[i]-lo)*255/r)|0));if(mode===2)g=255-g;p[i]=p[i+1]=p[i+2]=g}
  x.putImageData(d,0,0);return c;
}
async function tastanOku(blob,ilerle){
  const img=await resimYukle(blob);
  ocrProg=ilerle;
  const w=await ocrHazir();
  let en=null;
  for(const mode of [1,2,0]){
    const {data}=await w.recognize(tuvale(img,2000,mode));
    const say=(data.text.match(/[A-Za-zÇĞİÖŞÜçğıöşü0-9]/g)||[]).length;
    const skor=data.confidence*Math.min(say,60);
    if(!en||skor>en.skor)en={skor,text:data.text,conf:data.confidence};
    if(data.confidence>=75&&say>=12)break;
  }
  return en;
}
async function kucult(blob,maks,kalite){
  const img=await resimYukle(blob),c=tuvale(img,maks,0);
  return new Promise(r=>c.toBlob(r,'image/jpeg',kalite));
}

/* ---------- Arayüz ---------- */
const V=document.createElement('section');V.id='v-kabir';V.className='view';
V.innerHTML=`<div class="panel"><div class="tabs"><button class="on">Kabirlerim</button></div>
<div class="kb-top"><div id="kbCuma"></div><div class="kb-btns"><button class="btn gold" id="kbEkle">＋ Kabir ekle (fotoğraf)</button></div></div>
<div id="kbList"></div></div>`;
document.querySelector('#nav').before(V);
const nb=document.createElement('button');nb.dataset.v='kabir';
nb.innerHTML='<svg viewBox="0 0 24 24"><path d="M6 21V10a6 6 0 0 1 12 0v11"/><path d="M3 21h18"/><path d="M12 8v6M9.5 10.5h5"/></svg><span>Kabir</span>';
$('#nav').appendChild(nb);nb.onclick=()=>go('kabir');

const ov=document.createElement('div');ov.className='kb-ov';ov.id='kbOv';ov.innerHTML='<div class="kb-box" id="kbBox"></div>';document.body.appendChild(ov);
ov.onclick=e=>{if(e.target===ov&&!ov.dataset.kilit)kapat()};
const kapat=()=>{ov.classList.remove('open');delete ov.dataset.kilit;$('#kbBox').innerHTML=''};
const ac=h=>{$('#kbBox').innerHTML=h;ov.classList.add('open');$('#kbBox').scrollTop=0};

const _go=go;
go=function(v){_go(v);if(v==='kabir')cizKabir()};

function ozet(k){
  const y=(k.dogum.match(/\d{4}/)||[])[0],z=(k.vefat.match(/\d{4}/)||[])[0];
  const yil=y&&z?`${y} – ${z}`:(z?`† ${z}`:(y?`D. ${y}`:''));
  return [yil,k.mezarlik,k.sehir].filter(Boolean).join(' · ')||'Bilgi eklenmedi';
}
async function cizKabir(){
  const bek=bekleyen(),n=kayit.length;
  const cm=$('#kbCuma');
  if(!n){cm.innerHTML=''}
  else{
    const bas=bugunCuma()?'Bugün Cuma – hayırlı Cumalar':cumaGecesi()?'Cuma gecesi':'Cumaya hazırlık';
    const alt=bek.length?`${bek.length} kişi için bu Cuma Fâtiha ve Yâsîn okunmayı bekliyor.`:'Bu Cuma tüm kabirler için okundu. Allah kabul etsin.';
    cm.innerHTML=`<div class="kb-cuma${bek.length?'':' dim'}"><b>${bas}</b><p>${alt}</p><div class="kb-btns"><button class="btn gold" id="kbOkuBtn">Fâtiha ve Yâsîn oku</button></div></div>`;
    $('#kbOkuBtn').onclick=()=>okuBaslat(bek.length?bek.map(k=>k.id):kayit.map(k=>k.id));
  }
  const L=$('#kbList');
  if(!n){L.innerHTML=`<div class="kb-empty"><svg viewBox="0 0 24 24"><path d="M6 21V10a6 6 0 0 1 12 0v11"/><path d="M3 21h18"/><path d="M12 8v6M9.5 10.5h5"/></svg><br>Henüz kabir eklenmedi.<br>Mezarlığa gittiğinde mezar taşının fotoğrafını çek; isim ve tarihleri taştan okuyup kaydı oluşturalım.<br>Her Cuma ruhuna Fâtiha ve Yâsîn okuyalım.</div>`;return}
  L.innerHTML=kayit.map(k=>`<button class="kb-card" data-id="${k.id}"><div class="kb-th" id="th${k.id}">✦</div><div class="kb-inf"><div class="kb-ad">${esc(k.ad||'İsimsiz kayıt')}</div><div class="kb-alt">${esc(ozet(k))}</div></div><span class="kb-ok${okundu(k)?'':' bekle'}">${okundu(k)?'Okundu':'Bekliyor'}</span></button>`).join('');
  L.querySelectorAll('.kb-card').forEach(b=>b.onclick=()=>detay(b.dataset.id));
  kayit.forEach(async k=>{const u=await fotoUrl(k.id,true);const e=document.getElementById('th'+k.id);if(u&&e){e.style.backgroundImage=`url(${u})`;e.textContent=''}});
}

/* --- Ekle / düzenle --- */
let tasla=null; // {id?, blob, thumb, alan}
function ekleBasla(){
  ac(`<h3>Kabir ekle</h3>
  <p class="kb-uyari">Mezar taşının yazılı yüzünü, ışık yansımadan ve dik açıyla çekin. Yazıyı cihazın kendisi okur; fotoğraf internete gönderilmez.</p>
  <div class="kb-btns"><button class="btn gold" id="kbKam">📷 Fotoğraf çek</button><button class="btn" id="kbGal">Galeriden seç</button></div>
  <button class="btn" id="kbEl">Fotoğrafsız, elle gireceğim</button>`);
  const pick=(cap)=>{const i=document.createElement('input');i.type='file';i.accept='image/*';if(cap)i.setAttribute('capture','environment');i.onchange=()=>i.files[0]&&fotoSecildi(i.files[0]);i.click()};
  $('#kbKam').onclick=()=>pick(true);$('#kbGal').onclick=()=>pick(false);
  $('#kbEl').onclick=()=>form({blob:null,alan:{},yeni:true});
}
async function fotoSecildi(file){
  ac(`<h3>Taş okunuyor…</h3><div class="kb-prog"><i id="kbPr"></i></div><div class="kb-durum" id="kbDu">Fotoğraf hazırlanıyor</div><p class="kb-uyari">İlk seferde okuma motoru yüklenirken birkaç saniye sürebilir.</p>`);
  ov.dataset.kilit='1';
  let blob,thumb,ham='',alan={};
  try{
    blob=await kucult(file,1600,.82);thumb=await kucult(file,240,.7);
    $('#kbDu').textContent='Yazı okunuyor…';
    const r=await tastanOku(file,p=>{const e=$('#kbPr');if(e)e.style.width=Math.round(p*100)+'%'});
    ham=r.text;alan=kbParse(r.text);
    tasla={blob,thumb,alan,ham,conf:Math.round(r.conf),yeni:true};
  }catch(e){
    if(!blob){delete ov.dataset.kilit;toast('Fotoğraf açılamadı');return kapat()}
    tasla={blob,thumb,alan:{},ham:'',conf:-1,yeni:true};
  }
  delete ov.dataset.kilit;form(tasla);
}
async function form(t){
  tasla=t;const a=t.alan||{};
  const url=t.blob?URL.createObjectURL(t.blob):null;
  const bulundu=t.conf>=0&&(a.ad||a.dogum||a.vefat);
  ac(`<h3>${t.yeni?'Kabir bilgileri':'Kaydı düzenle'}</h3>
  ${url?`<img class="kb-foto" src="${url}" alt="Mezar taşı">`:''}
  ${t.yeni&&url?`<p class="kb-uyari">${t.conf<0?'Yazı otomatik okunamadı; bilgileri elle girebilirsiniz.':bulundu?'Taştan okunan bilgiler aşağıya yazıldı. Okuma hatalı olabilir; lütfen fotoğrafla karşılaştırıp düzeltin.':'Taştan anlamlı bir yazı çıkarılamadı (taş aşınmış veya yazı okunaksız olabilir). Bilgileri elle girin.'}</p>`:''}
  <label>Ad soyad<input type="text" id="fAd" value="${esc(a.ad)}" autocomplete="off"></label>
  <div class="kb-row"><label>Doğum<input type="text" id="fDg" value="${esc(a.dogum)}" placeholder="GG.AA.YYYY veya yıl"></label><label>Vefat<input type="text" id="fVf" value="${esc(a.vefat)}" placeholder="GG.AA.YYYY veya yıl"></label></div>
  <label>Yakınlık (anne, baba, dede…)<input type="text" id="fYk" value="${esc(a.yakin)}" autocomplete="off"></label>
  <div class="kb-row"><label>Mezarlık<input type="text" id="fMz" value="${esc(a.mezarlik)}" autocomplete="off"></label><label>Şehir / ilçe<input type="text" id="fSh" value="${esc(a.sehir)}" autocomplete="off"></label></div>
  <label>Not (ada/parsel, kabir sırası vb.)<textarea id="fNt">${esc(a.not)}</textarea></label>
  <div class="kb-durum" id="fKonum">${a.lat?'📍 Konum kaydedildi':''}</div>
  <button class="btn" id="fGps">📍 Bulunduğum konumu mezar konumu olarak kaydet</button>
  <div class="kb-btns"><button class="btn" id="fIptal">Vazgeç</button><button class="btn gold" id="fKaydet">Kaydet</button></div>`);
  if(t.ham&&t.yeni)$('#fNt').placeholder='';
  $('#fIptal').onclick=()=>{kapat()};
  $('#fGps').onclick=async()=>{
    $('#fKonum').textContent='Konum alınıyor…';
    try{
      let pos;
      if(P.Geolocation){await P.Geolocation.requestPermissions().catch(()=>{});pos=await P.Geolocation.getCurrentPosition({timeout:12000,enableHighAccuracy:true})}
      else pos=await new Promise((r,j)=>navigator.geolocation.getCurrentPosition(r,j,{timeout:12000,enableHighAccuracy:true}));
      a.lat=pos.coords.latitude;a.lon=pos.coords.longitude;$('#fKonum').textContent='📍 Konum kaydedildi';
    }catch(e){$('#fKonum').textContent='Konum alınamadı'}
  };
  $('#fKaydet').onclick=async()=>{
    const v=id=>$(id).value.trim();
    const rec=Object.assign(t.rec||{id:uid(),okunan:[],eklendi:Date.now()},{ad:v('#fAd'),dogum:v('#fDg'),vefat:v('#fVf'),yakin:v('#fYk'),mezarlik:v('#fMz'),sehir:v('#fSh'),not:v('#fNt'),lat:a.lat,lon:a.lon});
    if(!rec.ad&&!t.blob){toast('En azından bir isim yazın');return}
    if(t.blob&&t.yeni){try{await idb.set(rec.id,t.blob);await idb.set(rec.id+':t',t.thumb);dropUrl(rec.id)}catch(e){toast('Fotoğraf kaydedilemedi');}}
    if(!t.rec)kayit.unshift(rec);
    kaydet();kapat();cizKabir();toast('Kayıt oluşturuldu. Allah rahmet eylesin.');planKabirNotif(false);
  };
}

/* --- Ayrıntı --- */
async function detay(id){
  const k=kayit.find(x=>x.id===id);if(!k)return;
  const u=await fotoUrl(id,false);
  const harita=k.lat?`<a class="btn" style="text-align:center;text-decoration:none;display:block" target="_blank" rel="noopener" href="https://www.google.com/maps/search/?api=1&query=${k.lat},${k.lon}">📍 Mezar konumuna git</a>`:'';
  const sat=(e,d)=>d?`<div class="gr"><span class="gd">${e}</span><span>${esc(d)}</span></div>`:'';
  ac(`<h3>${esc(k.ad||'İsimsiz kayıt')}</h3>
  ${u?`<img class="kb-foto" src="${u}" alt="Mezar taşı">`:''}
  <div>${sat('Doğum',k.dogum)}${sat('Vefat',k.vefat)}${sat('Yakınlık',k.yakin)}${sat('Mezarlık',k.mezarlik)}${sat('Şehir',k.sehir)}${sat('Not',k.not)}${sat('Okunma',(k.okunan||[]).length+' Cuma')}</div>
  ${harita}
  <button class="btn gold" id="dOku">Ruhuna Fâtiha ve Yâsîn oku</button>
  <div class="kb-btns"><button class="btn" id="dDuz">Düzenle</button><button class="btn kb-danger" id="dSil">Sil</button></div>
  <button class="btn" id="dKapat">Kapat</button>`);
  $('#dKapat').onclick=kapat;
  $('#dOku').onclick=()=>{kapat();okuBaslat([id])};
  $('#dDuz').onclick=()=>{const t={rec:k,blob:null,alan:{...k},yeni:false};form(t)};
  $('#dSil').onclick=()=>{
    if(!confirm('Bu kayıt ve fotoğrafı silinsin mi?'))return;
    kayit=kayit.filter(x=>x.id!==id);kaydet();idb.del(id).catch(()=>{});idb.del(id+':t').catch(()=>{});dropUrl(id);kapat();cizKabir();
  };
}

/* --- Okuma ekranı --- */
const AR=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const ayetler=a=>a.map((t,i)=>`${t}<span class="no">﴿${AR(i+1)}﴾</span>`).join(' ');
const BESMELE='بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ';
const O=document.createElement('div');O.id='kbOku';
O.innerHTML=`<div class="ok-bar"><button id="okKapat">✕ Kapat</button><div style="display:flex;gap:6px"><button id="okKucuk">A−</button><button id="okBuyuk">A+</button></div></div>
<div class="ok-steps"><button data-s="niyet" class="on">Niyet</button><button data-s="fatiha">Fâtiha</button><button data-s="yasin">Yâsîn</button><button data-s="dua">Dua</button></div>
<div id="okBody"></div><div id="okAlt"><button class="btn gold" id="okBitti">Okudum, Allah kabul etsin</button></div>`;
document.body.appendChild(O);
let okuIds=[],arpx=+ls.get('arpx',27);
function okuBaslat(ids){
  okuIds=ids.filter(i=>kayit.some(k=>k.id===i));
  if(!okuIds.length)return;
  const isimler=okuIds.map(i=>kayit.find(k=>k.id===i).ad||'İsimsiz kayıt');
  const liste=isimler.length>8?isimler.slice(0,8).map(esc).join(', ')+` ve ${isimler.length-8} kişi daha`:isimler.map(esc).join(', ');
  O.style.setProperty('--arpx',arpx+'px');
  $('#okBody').innerHTML=`
  <div id="s-niyet" class="ok-niyet">Niyet ederim; okuyacağım Fâtiha-i Şerîf ve Yâsîn-i Şerîf'in sevabını Allah rızası için şu ruhlara hediye etmek üzere:<em>${liste}</em>Allah hepsine rahmet eylesin.<br><small style="color:var(--soluk)">Sıra ile: Besmele, Fâtiha, Yâsîn ve dua.</small></div>
  <div id="s-fatiha"><div class="ok-baslik">Fâtiha Sûresi</div><div class="ok-ar">${ayetler(OKUMA.fatiha)}</div></div>
  <div id="s-yasin"><div class="ok-baslik">Yâsîn Sûresi</div><div class="ok-ar">${BESMELE}</div><div class="ok-ar">${ayetler(OKUMA.yasin)}</div></div>
  <div id="s-dua"><div class="ok-baslik">Dua</div><div class="ok-dua">Allah'ım! Okuduğumuz Fâtiha ve Yâsîn-i Şerîf'in sevabını Nebîn Muhammed Mustafa'nın (s.a.v.) ruhuna, ardından ${liste} ve bütün mü'min kardeşlerimizin ruhlarına ulaştır.<br><br>Allah'ım! Onlara rahmetinle muamele et, kusurlarını bağışla, kabirlerini genişlet ve nurlandır, onları cennetinle şereflendir. Bizleri de imanla yaşat, imanla vefat ettir ve onlarla cennette buluştur.<br><br>Âmin.</div></div>`;
  O.querySelectorAll('.ok-steps button').forEach(b=>b.classList.remove('bit'));
  O.classList.add('open');$('#okBody').scrollTop=0;stepOn('niyet');
}
function stepOn(s){O.querySelectorAll('.ok-steps button').forEach(b=>b.classList.toggle('on',b.dataset.s===s))}
O.querySelectorAll('.ok-steps button').forEach(b=>b.onclick=()=>{const e=$('#s-'+b.dataset.s);if(e)e.scrollIntoView({block:'start'});stepOn(b.dataset.s)});
$('#okBody').addEventListener('scroll',()=>{
  const body=$('#okBody'),top=body.getBoundingClientRect().top;
  let cur='niyet';
  ['niyet','fatiha','yasin','dua'].forEach(s=>{const e=$('#s-'+s);if(e&&e.getBoundingClientRect().top-top<80)cur=s});
  stepOn(cur);
  ['niyet','fatiha','yasin'].forEach(s=>{const e=$('#s-'+s),b=O.querySelector(`.ok-steps [data-s=${s}]`);if(e&&b)b.classList.toggle('bit',e.getBoundingClientRect().bottom-top<40)});
},{passive:true});
$('#okKapat').onclick=()=>O.classList.remove('open');
const boyut=d=>{arpx=Math.max(20,Math.min(48,arpx+d));ls.set('arpx',arpx);O.style.setProperty('--arpx',arpx+'px')};
$('#okKucuk').onclick=()=>boyut(-3);$('#okBuyuk').onclick=()=>boyut(3);
$('#okBitti').onclick=()=>{
  const key=cumaAnahtar();
  kayit.forEach(k=>{if(okuIds.includes(k.id)){k.okunan=k.okunan||[];if(!k.okunan.includes(key))k.okunan.push(key)}});
  kaydet();O.classList.remove('open');cizKabir();toast('Okumanız kaydedildi. Allah kabul etsin.');
};

/* --- Ekle düğmesi --- */
$('#kbEkle').onclick=ekleBasla;

/* --- Cuma hatırlatması (haftalık yerel bildirim; ezan bildirimleriyle karışmaması için id ≥ 9000) --- */
const CS=Object.assign({on:true},ls.get('kabirS',{}));
async function planKabirNotif(ask){
  const LN=P.LocalNotifications;if(!LN)return;
  try{
    const p=await LN.getPending();
    const eski=p.notifications.filter(x=>x.id>=9000);
    if(eski.length)await LN.cancel({notifications:eski});
    if(!CS.on||!kayit.length)return;
    let pr=await LN.checkPermissions();
    if(pr.display!=='granted'){if(!ask)return;pr=await LN.requestPermissions();if(pr.display!=='granted')return}
    await LN.createChannel({id:'kabir',name:'Cuma hatırlatması',description:'Kabirler için Cuma okuması',importance:4,vibration:true,visibility:1}).catch(()=>{});
    await LN.schedule({notifications:[
      {id:9001,title:'Hayırlı Cumalar',body:'Merhumlarınız için Fâtiha ve Yâsîn okuma zamanı.',schedule:{on:{weekday:6,hour:9,minute:0},allowWhileIdle:true},channelId:'kabir'},
      {id:9002,title:'Cuma gecesi',body:'Yarın Cuma. Sevdiklerinize Fâtiha ve Yâsîn hediye etmeyi unutmayın.',schedule:{on:{weekday:5,hour:20,minute:0},allowWhileIdle:true},channelId:'kabir'}]});
  }catch(e){}
}
const row=document.createElement('label');row.className='trow';
row.innerHTML='<span>Cuma günü kabir hatırlatması</span><input type="checkbox" id="stCuma">';
const sb=document.querySelector('#setSheet .box');sb.insertBefore(row,sb.firstChild);
$('#stCuma').checked=CS.on;
$('#stCuma').onchange=e=>{CS.on=e.target.checked;ls.set('kabirS',CS);planKabirNotif(true)};

cizKabir();
setTimeout(()=>planKabirNotif(false),5000);
window.KABIR={cumaAnahtar,kbParse};
})();
