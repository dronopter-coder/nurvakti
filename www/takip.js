/* Nûr Vakti – Namaz takibi ve kaza sayacı (yalnızca cihazda tutulur) */
(function(){
const FARZ=[[0,'Sabah'],[2,'Öğle'],[3,'İkindi'],[4,'Akşam'],[5,'Yatsı']]; // VAK dizinindeki karşılıkları
const KAZA=['Sabah','Öğle','İkindi','Akşam','Yatsı','Vitir'];
const gunAnahtar=d=>d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate());
const gun=n=>{const d=new Date();d.setDate(d.getDate()-n);return gunAnahtar(d)};
let kilinan=ls.get('namazKilinan',{});            // {'2026-09-30':[true,false,...]}
let kaza=ls.get('namazKaza',[0,0,0,0,0,0]);
let aktarilan=ls.get('namazAktarilan',{});        // kazaya eklenmiş günler
const kaydet=()=>{ // yalnızca son 60 gün tutulur
  const ks=Object.keys(kilinan).sort();while(ks.length>60)delete kilinan[ks.shift()];
  ls.set('namazKilinan',kilinan);ls.set('namazKaza',kaza);ls.set('namazAktarilan',aktarilan)};
const bugun=()=>kilinan[gun(0)]||(kilinan[gun(0)]=[false,false,false,false,false]);
const sayi=k=>(kilinan[k]||[]).filter(Boolean).length;

/* Vakit ekranındaki şerit (ayet/hadis kutusunun altında) */
const satir=document.createElement('div');satir.id='npSatir';
satir.innerHTML='<button id="npAc"><span id="npMetin"></span><b>›</b></button><button id="npHizli" hidden>✓ Kıldım</button>';
document.querySelector('#v-vakit .panel').after(satir);

/* Şu anki farz vakit: lastCur (0 imsak … 5 yatsı); güneşle öğle arası son kılınan vakit sabahtır */
function suAnki(){const c=typeof lastCur==='number'?lastCur:-2;if(c<0)return -1;const i=c===1?0:c;return FARZ.findIndex(f=>f[0]===i)}
function satirCiz(){
  const b=bugun(),n=b.filter(Boolean).length,ix=suAnki();
  const m=$('#npMetin'),h=$('#npHizli');
  if(ix>=0&&!b[ix]){m.textContent=FARZ[ix][1]+' vakti – kıldın mı? ('+n+'/5)';h.hidden=false;h.dataset.i=ix}
  else{m.textContent='Bugün '+n+'/5 namaz'+(n===5?' · Allah kabul etsin':'');h.hidden=true}
}
$('#npHizli').onclick=e=>{const i=+e.target.dataset.i;bugun()[i]=true;kaydet();satirCiz();hap&&hap('ok')};
setInterval(satirCiz,15000);setTimeout(satirCiz,1500);

/* Ayrıntı sayfası */
const ov=document.createElement('div');ov.className='kb-ov';ov.id='npOv';ov.innerHTML='<div class="kb-box" id="npBox"></div>';document.body.appendChild(ov);
ov.onclick=e=>{if(e.target===ov)ov.classList.remove('open')};
$('#npAc').onclick=()=>{npCiz();ov.classList.add('open')};
function dunBekleyen(){ // dünden kılınmayanlar kazaya eklenebilir (en az bir vakit işaretlenmişse)
  const k=gun(1),d=kilinan[k];if(!d||aktarilan[k]||!d.some(Boolean))return 0;return d.filter(x=>!x).length}
function npCiz(){
  const b=bugun(),son7=[6,5,4,3,2,1,0].map(n=>{const k=gun(n);return{k,n:sayi(k),g:new Date(k+'T12:00').toLocaleDateString('tr-TR',{weekday:'short'})}});
  const dun=dunBekleyen();
  $('#npBox').innerHTML=`<h3>Namaz takibi</h3>
  <div>${FARZ.map((f,i)=>`<label class="kb-chk np-r"><input type="checkbox" data-i="${i}" ${b[i]?'checked':''}> ${f[1]} namazı</label>`).join('')}</div>
  <div class="np-hafta">${son7.map(x=>`<div><span class="np-n n${x.n}">${x.n}</span><small>${x.g}</small></div>`).join('')}</div>
  ${dun?`<button class="btn" id="npAktar">Dünden kılınmayan ${dun} vakti kazaya ekle</button>`:''}
  <h3 style="margin-top:6px">Kaza borcum</h3>
  <div>${KAZA.map((n,i)=>`<div class="np-kz"><span>${n}</span><button data-i="${i}" data-d="-1" aria-label="Bir kaza kıldım">−</button><b>${kaza[i]}</b><button data-i="${i}" data-d="1" aria-label="Bir kaza ekle">+</button></div>`).join('')}</div>
  <p class="kb-uyari">Eksi düğmesi, bir kaza namazı kıldığınızı düşer. Sayılar yalnızca sizin tuttuğunuz kayıttır; kaza hesabı için bir âlime veya müftülüğe danışabilirsiniz.</p>
  <button class="btn" id="npKapat">Kapat</button>`;
  $('#npBox').querySelectorAll('.np-r input').forEach(c=>c.onchange=()=>{bugun()[+c.dataset.i]=c.checked;kaydet();satirCiz();npCiz()});
  $('#npBox').querySelectorAll('.np-kz button').forEach(x=>x.onclick=()=>{const i=+x.dataset.i;kaza[i]=Math.max(0,kaza[i]+(+x.dataset.d));kaydet();npCiz()});
  const ak=$('#npAktar');if(ak)ak.onclick=()=>{const k=gun(1);kilinan[k].forEach((v,i)=>{if(!v)kaza[i]++});aktarilan[k]=1;kaydet();npCiz()};
  $('#npKapat').onclick=()=>ov.classList.remove('open');
}
window.NAMAZ={satirCiz};
})();
