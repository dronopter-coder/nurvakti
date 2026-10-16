/* Nur Vakti ek modüller: gezinme, kıble, tesbih, dini günler, ayarlar, bildirim */
const S=Object.assign({bild:true,vk:[0,2,3,4,5],tsSes:true,tsTit:true,tsHedef:33,tsSay:0,tsTur:0,tsZikir:'Sübhanallah'},ls.get('S',{}));
const saveS=()=>ls.set('S',S);
const hap=(k)=>{try{if(P.Haptics)k==='ok'?P.Haptics.vibrate({duration:250}):P.Haptics.impact({style:'LIGHT'});else navigator.vibrate&&navigator.vibrate(k==='ok'?250:12)}catch(e){}};

/* ---- Gezinme ---- */
let view='vakit';
function go(v){
  view=v;
  document.querySelectorAll('.view').forEach(x=>x.classList.toggle('on',x.id==='v-'+v));
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.v===v));
  v==='kible'?kStart():kStop();
  if(v==='gunler')drawGunler();
}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>go(b.dataset.v));

/* ---- Kıble ----
   Android'de yerli pusula eklentisi (Pusula: dönme vektörü sensörü + manyetik sapma düzeltmesi, gerçek kuzeye göre) kullanılır.
   Eklenti yoksa (web, iOS) tarayıcının mutlak yön olayına düşülür. */
let head=null,qb=null,kOn=false,aligned=false,kKoord=null,pusulaH=null,kDog=3;
const rad=x=>x*Math.PI/180;
function qibla(lat,lon){const a=rad(lat),b=rad(21.4225),dl=rad(39.8262-lon);
  return (Math.atan2(Math.sin(dl)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(dl))*180/Math.PI+360)%360}
const yumusat=h=>{if(head==null)head=h;else{let d=((h-head+540)%360)-180;head=(head+d*0.3+360)%360}};
function onOri(e){
  if(pusulaH)return; // yerli pusula çalışıyorsa tarayıcı olaylarını yok say
  let h=null;
  if(e.webkitCompassHeading!=null)h=e.webkitCompassHeading; // iOS: gerçek pusula yönü
  else if(e.type==='deviceorientationabsolute'&&e.alpha!=null)h=(360-e.alpha)%360; // Android tarayıcı: mutlak (kuzeye göre) alfa
  if(h==null)return;
  // Ekran yatay çevrildiyse düzelt
  const so=(screen.orientation&&screen.orientation.angle)||window.orientation||0;
  yumusat((h+so+360)%360);kDraw();
}
async function kStart(){
  kOn=true;
  try{if(window.DeviceOrientationEvent&&typeof DeviceOrientationEvent.requestPermission==='function'){const r=await DeviceOrientationEvent.requestPermission();if(r!=='granted')$('#kInfo').textContent='Pusula için hareket sensörü izni gerekli (Ayarlar > Nur Vakti).'}}catch(e){}
  try{kKoord=await koord();qb=qibla(+kKoord.lat,+kKoord.lon)}catch(e){$('#kInfo').textContent='Kıble için konum gerekli. Konumu seçip tekrar dene.'}
  if(!kOn)return;
  const Pu=P.Pusula;
  if(Pu&&!pusulaH){
    try{
      pusulaH=await Pu.addListener('yon',d=>{if(d&&d.dogruluk!=null)kDog=d.dogruluk;yumusat(+d.yon);kDraw()});
      await Pu.baslat(kKoord?{lat:+kKoord.lat,lon:+kKoord.lon}:{});
    }catch(e){try{pusulaH&&pusulaH.remove()}catch(_){}pusulaH=null}
  }
  if(!pusulaH){addEventListener('deviceorientationabsolute',onOri,true);addEventListener('deviceorientation',onOri,true)}
  kDraw();
}
function kStop(){
  kOn=false;head=null;
  removeEventListener('deviceorientationabsolute',onOri,true);removeEventListener('deviceorientation',onOri,true);
  if(pusulaH){try{pusulaH.remove();P.Pusula.durdur()}catch(e){}pusulaH=null}
}
function kDraw(){
  if(!kOn)return;
  const dial=$('#kDial'),mark=$('#kMark');
  if(qb!=null)mark.setAttribute('transform',`rotate(${qb} 100 100)`);
  if(head==null){$('#kInfo').textContent=qb!=null?`Kıble açısı ${Math.round(qb)}° (kuzeyden saat yönünde). Pusula sensörü bekleniyor…`:'Konum alınıyor…';return}
  dial.setAttribute('transform',`rotate(${-head} 100 100)`);
  if(qb==null)return;
  const diff=Math.abs(((qb-head+540)%360)-180);
  const ok=diff<4;
  $('#kWrap').classList.toggle('ok',ok);
  if(ok&&!aligned)hap('l');
  aligned=ok;
  $('#kInfo').textContent=(ok?'Kıbleye dönüksün':`Kıble ${Math.round(qb)}° · Yönün ${Math.round(head)}°`)+(kDog<2?' · Pusulayı ayarlamak için telefonu havada 8 çizerek sallayın':'');
}

/* ---- Tesbih ---- */
/* "Hayy" sesi: kayıtlı ses dosyası (hayy.mp3); hızlı art arda dokunuşlarda gecikmesin diye Web Audio ile önceden çözülür */
let AC=null,hayyTampon=null,hayyYukleniyor=null;
function hayyHazirla(){
  if(hayyTampon||hayyYukleniyor)return hayyYukleniyor;
  try{AC=AC||new (window.AudioContext||window.webkitAudioContext)()}catch(e){return null}
  hayyYukleniyor=fetch('hayy.mp3').then(r=>r.arrayBuffer()).then(b=>new Promise((ok,no)=>AC.decodeAudioData(b,ok,no))).then(t=>{hayyTampon=t}).catch(()=>{hayyYukleniyor=null});
  return hayyYukleniyor;
}
function hayy(){
  if(!S.tsSes)return;
  try{
    hayyHazirla();
    if(AC&&AC.state==='suspended')AC.resume();
    if(hayyTampon){const k=AC.createBufferSource();k.buffer=hayyTampon;k.connect(AC.destination);k.start(0)}
    else{const a=new Audio('hayy.mp3');a.play().catch(()=>{})}
  }catch(e){}
}
setTimeout(hayyHazirla,3000);
const ZIKIR=[['Sübhanallah',33],['Elhamdülillah',33],['Allahu ekber',33],['Serbest',0]];
function tsDraw(){
  $('#tsCount').textContent=S.tsSay;
  $('#tsSub').textContent=S.tsZikir+(S.tsHedef?' · hedef '+S.tsHedef:'')+(S.tsTur?' · '+S.tsTur+' tur':'');
  const h=S.tsHedef;$('#tsRing').style.strokeDashoffset=h?377*(1-Math.min(1,S.tsSay/h)):377;
  document.querySelectorAll('#tsChips button').forEach(b=>b.classList.toggle('on',b.dataset.z===S.tsZikir));
  $('#tsSes').checked=S.tsSes!==false&&S.tsSes;$('#tsTit').checked=S.tsTit;
}
$('#tsSes').checked=S.tsSes;
$('#tsChips').innerHTML=ZIKIR.map(([n,h])=>`<button data-z="${n}" data-h="${h}">${n}</button>`).join('');
document.querySelectorAll('#tsChips button').forEach(b=>b.onclick=()=>{S.tsZikir=b.dataset.z;S.tsHedef=+b.dataset.h;S.tsSay=0;S.tsTur=0;saveS();tsDraw()});
$('#tsBtn').onclick=()=>{
  S.tsSay++;
  if(S.tsHedef&&S.tsSay>=S.tsHedef){S.tsSay=0;S.tsTur++;if(S.tsTit)hap('ok');toast('Tamamlandı: '+S.tsZikir);}
  else if(S.tsTit)hap('l');
  hayy();saveS();tsDraw();
};
$('#tsReset').onclick=()=>{S.tsSay=0;S.tsTur=0;saveS();tsDraw()};
$('#tsSes').onchange=e=>{S.tsSes=e.target.checked;saveS();if(S.tsSes)hayy()};
$('#tsTit').onchange=e=>{S.tsTit=e.target.checked;saveS();if(S.tsTit)hap('l')};

/* ---- Dini günler ve geceler (Diyanet takvimi; k=1: kandil/gece, tarih akşamını gösterir) ---- */
const GUN=[
['Miraç Kandili','2026-01-15',0,1],['Berat Kandili','2026-02-02',0,1],['Ramazan başlangıcı','2026-02-19'],['Kadir Gecesi','2026-03-16',0,1],
['Ramazan Bayramı arefesi','2026-03-19'],['Ramazan Bayramı','2026-03-20','2026-03-22'],['Kurban Bayramı arefesi','2026-05-26'],['Kurban Bayramı','2026-05-27','2026-05-30'],
['Hicri yılbaşı','2026-06-16'],['Aşure günü','2026-06-25'],['Mevlid Kandili','2026-08-24',0,1],['Üç ayların başlangıcı','2026-12-10'],['Regaib Kandili','2026-12-10',0,1],
['Miraç Kandili','2027-01-04',0,1],['Şaban ayının başlangıcı','2027-01-09'],['Berat Kandili','2027-01-22',0,1],['Ramazan başlangıcı','2027-02-08'],['Kadir Gecesi','2027-03-05',0,1],
['Ramazan Bayramı arefesi','2027-03-08'],['Ramazan Bayramı','2027-03-09','2027-03-11'],['Kurban Bayramı arefesi','2027-05-15'],['Kurban Bayramı','2027-05-16','2027-05-19'],
['Hicri yılbaşı','2027-06-06'],['Aşure günü','2027-06-15'],['Mevlid Kandili','2027-08-13',0,1],['Üç ayların başlangıcı','2027-11-29'],['Regaib Kandili','2027-12-02',0,1],['Miraç Kandili','2027-12-24',0,1],
['Berat Kandili','2028-01-11',0,1],['Ramazan başlangıcı','2028-01-28'],['Kadir Gecesi','2028-02-22',0,1],['Ramazan Bayramı arefesi','2028-02-25'],['Ramazan Bayramı','2028-02-26','2028-02-28'],
['Kurban Bayramı arefesi','2028-05-04'],['Kurban Bayramı','2028-05-05','2028-05-08'],['Hicri yılbaşı','2028-05-25'],['Aşure günü','2028-06-03'],['Mevlid Kandili','2028-08-02',0,1],
['Üç ayların başlangıcı','2028-11-17'],['Regaib Kandili','2028-11-23',0,1],['Miraç Kandili','2028-12-12',0,1],['Şaban ayının başlangıcı','2028-12-17'],['Berat Kandili','2028-12-30',0,1]];
let gy=0;
function drawGunler(){
  const n0=new Date(),today=new Date(n0.getFullYear(),n0.getMonth(),n0.getDate());
  if(!gy)gy=[2026,2027,2028].includes(n0.getFullYear())?n0.getFullYear():2026;
  $('#gYear').innerHTML=[2026,2027,2028].map(y=>`<button data-y="${y}" class="${y===gy?'on':''}">${y}</button>`).join('');
  document.querySelectorAll('#gYear button').forEach(b=>b.onclick=()=>{gy=+b.dataset.y;drawGunler()});
  let nx=false;
  $('#gList').innerHTML=GUN.filter(e=>e[1].startsWith(gy)).map(e=>{
    const s=new Date(e[1]+'T00:00'),en=e[2]?new Date(e[2]+'T00:00'):s,past=en<today,n=Math.round((s-today)/864e5);
    const nxt=!past&&!nx;if(nxt)nx=true;
    const dt=e[2]?`${s.getDate()}–${en.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})} · ${Math.round((en-s)/864e5)+1} gün`:s.toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'})+(e[3]?' akşamı':'');
    const ay=s.toLocaleDateString('tr-TR',{month:'short'}).replace('.','');
    return `<div class="gr${past?' past':''}${nxt?' nx':''}"><div class="gtar"><b>${s.getDate()}</b><small>${ay}</small></div><div class="gbil"><div class="gn">${e[0]}</div><div class="gd">${dt}</div></div><div class="gk">${past?'Geçti':n<=0?'Şimdi':n===1?'Yarın':n+' gün'}</div></div>`}).join('');
}

/* ---- Ayarlar ve bildirimler ---- */
function setDraw(){
  $('#stBild').checked=S.bild;
  $('#stVak').innerHTML=VAK.map(([k,n],i)=>`<button data-i="${i}" class="${S.vk.includes(i)?'on':''}">${n}</button>`).join('');
  document.querySelectorAll('#stVak button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;S.vk=S.vk.includes(i)?S.vk.filter(x=>x!==i):[...S.vk,i];saveS();setDraw();planNotifs()});
}
$('#gear').onclick=()=>{setDraw();sistemDurum();$('#setSheet').classList.add('open')};
/* Konum ayarlardan da değiştirilebilir */
$('#stKonum').onclick=()=>{$('#setSheet').classList.remove('open');$('#locBtn').click()};
/* Uygulama bildirimleri: telefonun bu uygulamaya ait bildirim ayarları ekranını açar */
async function sistemDurum(){
  $('#stKonumAd').textContent='Konum: '+locLabel()+(loc.type==='gps'?' (otomatik)':'');
  $('#stKaynak').textContent=!days?'':days.kaynak==='diyanet'?'Vakit kaynağı: Diyanet İşleri Başkanlığı ilçe vakitleri ✓':'Vakit kaynağı: hesaplama (Diyanet yöntemi). Diyanet verisine şu an ulaşılamadı; 1-2 dakika fark olabilir.';
  let acik=null;
  try{if(P.NurYerli)acik=(await P.NurYerli.bildirimDurumu()).acik;else if(P.LocalNotifications)acik=(await P.LocalNotifications.checkPermissions()).display==='granted'}catch(e){}
  $('#stSistem').checked=!!acik;
  $('#stSisDurum').textContent=acik==null?'':acik?'Açık · kapatmak için telefon ayarlarına gider':'Kapalı · açmak için telefon ayarlarına gider';
}
$('#stSistem').onclick=async e=>{
  e.preventDefault();
  try{if(P.NurYerli){await P.NurYerli.bildirimAyari();return}}catch(_){}
  try{if(P.LocalNotifications){const r=await P.LocalNotifications.requestPermissions();if(r.display==='granted')toast('Bildirimler açık');sistemDurum();return}}catch(_){}
  toast('Telefon Ayarlar > Uygulamalar > Nur Vakti > Bildirimler bölümünden değiştirebilirsiniz');
};
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&$('#setSheet').classList.contains('open'))sistemDurum()});
$('#setSheet').onclick=e=>{if(e.target.id==='setSheet')e.target.classList.remove('open')};
$('#stBild').onchange=async e=>{S.bild=e.target.checked;saveS();S.bild?await planNotifs(true):clearNotifs()};
$('#stTest').onclick=()=>{try{const a=new Audio('vakit.mp3');a.play()}catch(e){}};
async function clearNotifs(){const LN=P.LocalNotifications;if(!LN)return;try{const p=await LN.getPending();const n=p.notifications.filter(x=>x.id<9000);if(n.length)await LN.cancel({notifications:n})}catch(e){}}
async function planNotifs(ask){
  const LN=P.LocalNotifications;if(!LN||!S.bild)return;
  try{
    let pr=await LN.checkPermissions();
    if(pr.display!=='granted'){if(!ask&&ls.get('nasked',false))return;ls.set('nasked',true);pr=await LN.requestPermissions();if(pr.display!=='granted'){toast('Bildirim izni verilmedi');return}}
    try{const ex=await LN.checkExactNotificationSetting();if(ex.exact_alarm!=='granted'&&ask)await LN.changeExactNotificationSetting()}catch(e){}
    if(PLAT==='android'){await LN.createChannel({id:'vakit4',name:'Vakit bildirimleri',description:'Namaz vakitleri',importance:5,sound:'vakit.mp3',vibration:true,visibility:1});LN.deleteChannel&&LN.deleteChannel({id:'vakit3'}).catch(()=>{})} // kanal sesi sonradan değiştirilemediği için yeni kanal
    await clearNotifs();
    const list=[],now=new Date();
    for(let k=0;k<7;k++){
      const d=new Date(now.getTime()+k*864e5),x=await fetchDay(d);
      VAK.forEach(([key,name],i)=>{
        if(!S.vk.includes(i))return;
        const w=at(d,x.t[key]);
        if(w>now)list.push({id:100+k*10+i,title:name+' vakti',body:locLabel()+' için '+name+' vakti girdi',schedule:{at:w,allowWhileIdle:true},channelId:'vakit4',sound:PLAT==='ios'?undefined:'vakit.mp3',extra:{hedef:'vakit'}});
      });
    }
    if(PLAT==='ios')list.splice(40); // iOS en çok 64 bekleyen yerel bildirime izin verir
    if(list.length)await LN.schedule({notifications:list});
  }catch(e){}
}
/* Ana ekran widget'ı: önümüzdeki 7 günün vakitleri yerli tarafa gönderilir (widget kendi kendine geri sayar) */
async function vidjetGuncelle(){
  const Y=P.NurYerli;if(!Y||!Y.vidjetKaydet)return;
  try{
    const now=new Date(),L=[];
    for(let k=0;k<7;k++){
      const d=new Date(now.getFullYear(),now.getMonth(),now.getDate()+k,12);let x;
      try{x=await fetchDay(d)}catch(e){break}
      VAK.forEach(([key,name])=>L.push({a:name,t:at(d,x.t[key]).getTime()}));
    }
    if(L.length)await Y.vidjetKaydet({veri:JSON.stringify({yer:locLabel(),v:L})});
  }catch(e){}
}
const _load=load;
load=async function(){await _load();await planNotifs(false);vidjetGuncelle()};

tsDraw();
setTimeout(()=>planNotifs(false).then(vidjetGuncelle),4000);
