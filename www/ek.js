/* Nûr Vakti ek modüller: gezinme, kıble, tesbih, dini günler, ayarlar, bildirim */
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

/* ---- Kıble ---- */
let head=null,qb=null,kOn=false,aligned=false;
const rad=x=>x*Math.PI/180;
function qibla(lat,lon){const a=rad(lat),b=rad(21.4225),dl=rad(39.8262-lon);
  return (Math.atan2(Math.sin(dl)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(dl))*180/Math.PI+360)%360}
function onOri(e){
  let h=null;
  if(e.webkitCompassHeading!=null)h=e.webkitCompassHeading;
  else if(e.alpha!=null&&(e.absolute||e.type==='deviceorientationabsolute'))h=(360-e.alpha)%360;
  if(h==null)return;
  if(head==null)head=h;else{let d=((h-head+540)%360)-180;head=(head+d*0.25+360)%360}
  kDraw();
}
async function kStart(){
  kOn=true;
  addEventListener('deviceorientationabsolute',onOri,true);addEventListener('deviceorientation',onOri,true);
  try{
    let lat,lon;
    if(loc.type==='gps'){lat=loc.lat;lon=loc.lon}
    else{
      if(!(days&&days.lat)){ls.set('t|'+locKey()+'|'+dstr(new Date()),null);days=await fetchDay(new Date())}
      lat=+days.lat;lon=+days.lon;
    }
    qb=qibla(lat,lon);
  }catch(e){$('#kInfo').textContent='Kıble için konum gerekli. Konumu seçip tekrar dene.'}
  kDraw();
}
function kStop(){kOn=false;removeEventListener('deviceorientationabsolute',onOri,true);removeEventListener('deviceorientation',onOri,true)}
function kDraw(){
  if(!kOn)return;
  const dial=$('#kDial'),mark=$('#kMark');
  if(qb!=null)mark.setAttribute('transform',`rotate(${qb} 100 100)`);
  if(head==null){$('#kInfo').textContent=qb!=null?`Kıble yönü: ${Math.round(qb)}° (kuzeyden saat yönünde). Pusula sensörü bekleniyor…`:'Konum alınıyor…';return}
  dial.setAttribute('transform',`rotate(${-head} 100 100)`);
  if(qb==null)return;
  const diff=Math.abs(((qb-head+540)%360)-180);
  const ok=diff<4;
  $('#kWrap').classList.toggle('ok',ok);
  if(ok&&!aligned)hap('l');
  aligned=ok;
  $('#kInfo').textContent=ok?'Kıbleye dönüksün':`Kıble ${Math.round(qb)}° · Yönün ${Math.round(head)}°`;
}

/* ---- Tesbih ---- */
let AC=null;
function hayyKur(ctx,t,out){ // "hayy": nefesli "h", ağızdan "a"dan "i"ye geçen yumuşak ünlü (formantlı, alçak perdeli)
  const g=ctx.createGain(),lp=ctx.createBiquadFilter(),o=ctx.createOscillator();
  lp.type='lowpass';lp.frequency.value=2200;lp.Q.value=.3;
  o.type='sawtooth';o.frequency.setValueAtTime(150,t);o.frequency.linearRampToValueAtTime(122,t+.55);
  g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.42,t+.1);g.gain.exponentialRampToValueAtTime(.001,t+.62);
  [[720,340,3.5],[1150,2200,5]].forEach(([a,b,q])=>{const f=ctx.createBiquadFilter();f.type='bandpass';f.Q.value=q;f.frequency.setValueAtTime(a,t);f.frequency.linearRampToValueAtTime(b,t+.5);o.connect(f);f.connect(g)});
  g.connect(lp);lp.connect(out);o.start(t);o.stop(t+.66);
  // "h" nefesi
  const n=ctx.createBufferSource(),len=Math.floor(ctx.sampleRate*.14),buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);
  for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*(1-i/len);
  n.buffer=buf;const nf=ctx.createBiquadFilter(),ng=ctx.createGain();nf.type='bandpass';nf.frequency.value=1400;nf.Q.value=.7;ng.gain.value=.14;
  n.connect(nf);nf.connect(ng);ng.connect(out);n.start(t);
}
window.hayyKur=hayyKur;
function hayy(){
  if(!S.tsSes)return;
  try{
    AC=AC||new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state==='suspended')AC.resume();
    hayyKur(AC,AC.currentTime+.02,AC.destination);
  }catch(e){}
}
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
    const dt=e[2]?`${s.getDate()}–${en.toLocaleDateString('tr-TR',{day:'numeric',month:'long'})}`:s.toLocaleDateString('tr-TR',{day:'numeric',month:'long',weekday:'long'})+(e[3]?' akşamı':'');
    return `<div class="gr${past?' past':''}${nxt?' nx':''}"><div><div class="gn">${e[0]}</div><div class="gd">${dt}</div></div><div class="gk">${past?'Geçti':n<=0?'Şimdi':n+' gün'}</div></div>`}).join('');
}

/* ---- Ayarlar ve bildirimler ---- */
function setDraw(){
  $('#stBild').checked=S.bild;
  $('#stVak').innerHTML=VAK.map(([k,n],i)=>`<button data-i="${i}" class="${S.vk.includes(i)?'on':''}">${n}</button>`).join('');
  document.querySelectorAll('#stVak button').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;S.vk=S.vk.includes(i)?S.vk.filter(x=>x!==i):[...S.vk,i];saveS();setDraw();planNotifs()});
}
$('#gear').onclick=()=>{setDraw();$('#setSheet').classList.add('open')};
$('#setSheet').onclick=e=>{if(e.target.id==='setSheet')e.target.classList.remove('open')};
$('#stBild').onchange=async e=>{S.bild=e.target.checked;saveS();S.bild?await planNotifs(true):clearNotifs()};
$('#stTest').onclick=()=>{try{const a=new Audio('ezan.wav');a.play()}catch(e){}};
async function clearNotifs(){const LN=P.LocalNotifications;if(!LN)return;try{const p=await LN.getPending();const n=p.notifications.filter(x=>x.id<9000);if(n.length)await LN.cancel({notifications:n})}catch(e){}}
async function planNotifs(ask){
  const LN=P.LocalNotifications;if(!LN||!S.bild)return;
  try{
    let pr=await LN.checkPermissions();
    if(pr.display!=='granted'){if(!ask&&ls.get('nasked',false))return;ls.set('nasked',true);pr=await LN.requestPermissions();if(pr.display!=='granted'){toast('Bildirim izni verilmedi');return}}
    try{const ex=await LN.checkExactNotificationSetting();if(ex.exact_alarm!=='granted'&&ask)await LN.changeExactNotificationSetting()}catch(e){}
    await LN.createChannel({id:'vakit3',name:'Vakit bildirimleri',description:'Namaz vakitleri',importance:5,sound:'ezan.wav',vibration:true,visibility:1});
    await clearNotifs();
    const list=[],now=new Date();
    for(let k=0;k<7;k++){
      const d=new Date(now.getTime()+k*864e5),x=await fetchDay(d);
      VAK.forEach(([key,name],i)=>{
        if(!S.vk.includes(i))return;
        const w=at(d,x.t[key]);
        if(w>now)list.push({id:100+k*10+i,title:name+' vakti',body:locLabel()+' için '+name+' vakti girdi',schedule:{at:w,allowWhileIdle:true},channelId:'vakit3',sound:'ezan.wav'});
      });
    }
    if(list.length)await LN.schedule({notifications:list});
  }catch(e){}
}
const _load=load;
load=async function(){await _load();planNotifs(false)};

tsDraw();
setTimeout(()=>planNotifs(false),4000);
