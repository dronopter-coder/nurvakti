/* Yakındaki camiler: liste ve harita görünümü. Veri: OpenStreetMap (Overpass). */
(function(){
const esc=Sayfa.esc;
const OVP=['https://overpass-api.de/api/interpreter','https://overpass.private.coffee/api/interpreter','https://overpass.kumi.systems/api/interpreter','https://maps.mail.ru/osm/tools/overpass/api/interpreter'];
const mesafe=(a,b,c,d)=>{const R=6371e3,r=x=>x*Math.PI/180,h=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 2*R*Math.asin(Math.sqrt(h))};
const mYaz=m=>m<1000?Math.round(m/10)*10+' m':(m/1000).toFixed(1).replace('.',',')+' km';
const tarif=c=>`https://www.google.com/maps/dir/?api=1&destination=${c.lat},${c.lon}&travelmode=walking`;

/* Konum: önce hızlı (son bilinen / düşük hassasiyet), olmazsa hassas; o da olmazsa uygulamada seçili konum */
async function konumAl(){
  const al=o=>P.Geolocation?P.Geolocation.getCurrentPosition(o):new Promise((r,j)=>navigator.geolocation.getCurrentPosition(r,j,o));
  if(P.Geolocation)await P.Geolocation.requestPermissions().catch(()=>{});
  let pos,hata;
  try{pos=await al({timeout:7000,maximumAge:600000,enableHighAccuracy:false})}catch(e){hata=e}
  if(!pos)try{pos=await al({timeout:12000,enableHighAccuracy:true})}catch(e){hata=e}
  if(pos)return{lat:pos.coords.latitude,lon:pos.coords.longitude};
  try{const k=await window.koord();if(k&&k.lat)return{lat:+k.lat,lon:+k.lon,yaklasik:true}}catch(e){}
  throw hata||new Error('konum');
}
/* Overpass: dört sunucuya aynı anda sorulur, ilk gelen yanıt kullanılır (yoğun sunucuyu beklemez) */
async function overpass(q){
  const ac=new AbortController(),t=setTimeout(()=>ac.abort(),16000);
  try{
    return await Promise.any(OVP.map(u=>fetch(u,{method:'POST',body:'data='+encodeURIComponent(q),headers:{'Content-Type':'application/x-www-form-urlencoded'},signal:ac.signal})
      .then(r=>{if(!r.ok)throw new Error(r.status);return r.json()}).then(j=>{if(!j||!Array.isArray(j.elements))throw new Error('yanıt');return j})));
  }catch(e){throw (e&&e.errors&&e.errors[0])||e}finally{clearTimeout(t);ac.abort()}
}
function ayikla(j,k){
  const liste=[];
  (j.elements||[]).forEach(e=>{
    const lat=e.lat??(e.center&&e.center.lat),lon=e.lon??(e.center&&e.center.lon);
    if(lat==null||lon==null)return;
    const t=e.tags||{},ad=t['name:tr']||t.name||t['name:en']||'',tur=/mescit|mescid/i.test(ad)?'Mescit':'Cami';
    liste.push({ad:ad||'İsimsiz cami',tur,lat,lon,m:mesafe(k.lat,k.lon,lat,lon)});
  });
  liste.sort((a,b)=>a.m-b.m);
  return liste.filter((c,i)=>!liste.slice(0,i).some(o=>o.ad===c.ad&&mesafe(o.lat,o.lon,c.lat,c.lon)<60)).slice(0,40); // aynı yapının düğüm + alan kayıtlarını tekle
}
async function getir(zorla){
  const k=await konumAl(),on=ls.get('camiOn',null);
  if(!zorla&&on&&Date.now()-on.t<25*60e3&&mesafe(on.k.lat,on.k.lon,k.lat,k.lon)<300)return{k,liste:on.liste.map(c=>({...c,m:mesafe(k.lat,k.lon,c.lat,c.lon)})).sort((a,b)=>a.m-b.m)};
  let liste=[];
  for(const r of [3000,10000]){
    const j=await overpass(`[out:json][timeout:14];nwr["amenity"="place_of_worship"]["religion"="muslim"](around:${r},${k.lat},${k.lon});out center tags 150;`);
    liste=ayikla(j,k);if(liste.length>=3)break;
  }
  ls.set('camiOn',{k,t:Date.now(),liste});
  return{k,liste};
}
const hataYaz=e=>/denied|izin|permission|PERMISSION/i.test(String(e&&e.message||e))?'Konum izni verilmedi. Telefon ayarlarından konum iznini açın.':(e&&e.code===1)?'Konum izni verilmedi. Telefon ayarlarından konum iznini açın.':'Camiler alınamadı. Konum ve internet bağlantısını kontrol edin.';
const kaynak='<p class="note" style="margin-top:14px">Cami bilgileri OpenStreetMap katkıcılarından alınır; Diyanet verisi değildir, eksik veya güncel olmayabilir.</p>';

function ac(){
  const ov=document.createElement('div');ov.className='kb-ov open';
  ov.innerHTML=`<div class="kb-box"><h3>Camiler</h3>
  <button class="cm-kart cm-mavi" data-g="liste"><svg viewBox="0 0 24 24"><path d="M12 21s-7-6-7-11a7 7 0 0 1 14 0c0 5-7 11-7 11z"/><path d="M9 12v-2a3 3 0 0 1 6 0v2"/></svg><div><b>Liste Görünümü</b><span>Camileri yakından uzağa listele</span></div><i>Görüntüle →</i></button>
  <button class="cm-kart cm-yesil" data-g="harita"><svg viewBox="0 0 24 24"><path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/></svg><div><b>Harita Görünümü</b><span>Yakınımdaki camileri harita üzerinde göster</span></div><i>Görüntüle →</i></button>
  <button class="btn" id="cmKapat">✕ Kapat</button></div>`;
  document.body.appendChild(ov);
  ov.onclick=e=>{if(e.target===ov)ov.remove()};
  ov.querySelector('#cmKapat').onclick=()=>ov.remove();
  ov.querySelectorAll('.cm-kart').forEach(b=>b.onclick=()=>{ov.remove();b.dataset.g==='liste'?liste():harita()});
}

async function liste(){
  const s=Sayfa.ac('Yakın Camiler');
  const yukle=async z=>{
    s.govde.innerHTML='<p class="note" style="text-align:center;padding:30px 0">Konumunuz alınıyor ve camiler aranıyor…</p>';
    try{
      const {k,liste}=await getir(z);
      if(!liste.length){s.govde.innerHTML='<p class="note" style="text-align:center;padding:30px 0">Çevrenizde kayıtlı cami bulunamadı (10 km).</p>'+kaynak;return}
      const c0=liste[0];
      s.govde.innerHTML=`<div class="sf-satir sf-oku" style="flex-direction:column;align-items:stretch;gap:8px"><small style="color:var(--altin)">${ceviri('EN YAKIN CAMİ')} · <span dir="ltr">${mYaz(c0.m)}</span></small><b style="font-family:Georgia,serif;font-weight:400;font-size:19px">${esc(c0.ad)}</b><a class="btn gold" style="text-align:center;text-decoration:none;display:block" target="_blank" rel="noopener" href="${tarif(c0)}">📍 ${ceviri('Yol tarifi al')}</a></div>
      ${liste.slice(1).map(c=>`<div class="sf-satir"><div class="sf-no">🕌</div><div class="sf-ad"><b>${esc(c.ad)}</b><small>${ceviri(c.tur)} · <span dir="ltr">${mYaz(c.m)}</span></small></div><a class="cm-git" target="_blank" rel="noopener" href="${tarif(c)}">${ceviri('Yol tarifi')}</a></div>`).join('')}
      <button class="btn" id="cmYenile" style="margin-top:12px">↻ ${ceviri('Yenile')}</button>${kaynak}`;
      $('#cmYenile').onclick=()=>yukle(true);
    }catch(e){
      s.govde.innerHTML=`<p class="note" style="text-align:center;padding:30px 10px">${hataYaz(e)}</p><button class="btn" id="cmTekrar">Tekrar dene</button>`;
      $('#cmTekrar').onclick=()=>yukle(true);
    }
  };
  yukle(false);
}

async function harita(){
  const s=Sayfa.ac('Harita');
  s.govde.style.padding='0';s.govde.style.display='flex';s.govde.style.flexDirection='column';
  s.govde.innerHTML='<p class="note" style="text-align:center;padding:30px 0">Harita hazırlanıyor…</p>';
  try{
    if(!document.querySelector('link[data-lf]')){const l=document.createElement('link');l.rel='stylesheet';l.href='lib/leaflet.css';l.dataset.lf=1;document.head.appendChild(l)}
    await Sayfa.yukle('lib/leaflet.js');
    const {k,liste}=await getir(false);
    s.govde.innerHTML='<div id="cmHarita" style="flex:1;min-height:0"></div><div id="cmAlt"></div>';
    const map=L.map('cmHarita',{zoomControl:true}).setView([k.lat,k.lon],15);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(map);
    L.circleMarker([k.lat,k.lon],{radius:8,color:'#fff',weight:2,fillColor:'#2f7cf6',fillOpacity:1}).addTo(map).bindPopup('Buradasınız');
    const gosterilen=liste.slice(0,25),pts=[[k.lat,k.lon]];
    gosterilen.forEach((c,i)=>{
      pts.push([c.lat,c.lon]);
      L.circleMarker([c.lat,c.lon],{radius:i?8:11,color:'#fff',weight:2,fillColor:i?'#3E8577':'#C9A45C',fillOpacity:1}).addTo(map)
        .on('click',()=>alt(c));
    });
    const alt=c=>{$('#cmAlt').innerHTML=`<div class="cm-alt"><div><b>${esc(c.ad)}</b><small>${ceviri(c.tur)} · <span dir="ltr">${mYaz(c.m)}</span></small></div><a class="btn gold" target="_blank" rel="noopener" href="${tarif(c)}">${ceviri('Yol tarifi')}</a></div>`};
    if(gosterilen.length){alt(gosterilen[0]);map.fitBounds(pts.slice(0,7),{padding:[30,30],maxZoom:17})}
    else $('#cmAlt').innerHTML='<p class="note" style="padding:12px;text-align:center">Çevrenizde kayıtlı cami bulunamadı.</p>';
    setTimeout(()=>map.invalidateSize(),200);
  }catch(e){
    s.govde.style.padding='12px 14px';
    s.govde.innerHTML=`<p class="note" style="text-align:center;padding:30px 10px">${hataYaz(e)}</p>`;
  }
}
window.Cami={ac};
})();
