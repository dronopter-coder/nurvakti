/* Kur'an-ı Kerim: sûre listesi, okuma ve kâri sesi */
(function(){
const AD=["Fâtiha","Bakara","Âl-i İmrân","Nisâ","Mâide","En'âm","A'râf","Enfâl","Tevbe","Yûnus","Hûd","Yûsuf","Ra'd","İbrâhîm","Hicr","Nahl","İsrâ","Kehf","Meryem","Tâhâ","Enbiyâ","Hac","Mü'minûn","Nûr","Furkân","Şuarâ","Neml","Kasas","Ankebût","Rûm","Lokmân","Secde","Ahzâb","Sebe'","Fâtır","Yâsîn","Sâffât","Sâd","Zümer","Mü'min","Fussilet","Şûrâ","Zuhruf","Duhân","Câsiye","Ahkâf","Muhammed","Fetih","Hucurât","Kâf","Zâriyât","Tûr","Necm","Kamer","Rahmân","Vâkıa","Hadîd","Mücâdele","Haşr","Mümtehine","Saff","Cuma","Münâfikûn","Teğâbün","Talâk","Tahrîm","Mülk","Kalem","Hâkka","Meâric","Nûh","Cin","Müzzemmil","Müddessir","Kıyâme","İnsan","Mürselât","Nebe'","Nâziât","Abese","Tekvîr","İnfitâr","Mutaffifîn","İnşikâk","Bürûc","Târık","A'lâ","Gâşiye","Fecr","Beled","Şems","Leyl","Duhâ","İnşirâh","Tîn","Alak","Kadir","Beyyine","Zilzâl","Âdiyât","Kâria","Tekâsür","Asr","Hümeze","Fîl","Kureyş","Mâûn","Kevser","Kâfirûn","Nasr","Tebbet","İhlâs","Felak","Nâs"];
const SES_A='https://everyayah.com/data/Alafasy_128kbps/',SES_B=n=>`https://cdn.islamic.network/quran/audio/128/ar.alafasy/${n}.mp3`;
const p3=n=>String(n).padStart(3,'0');
const AR=n=>String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]);
const esc=Sayfa.esc;
let cum=null; // sûrelerin ilk ayetinin genel sırası (yedek ses kaynağı için)
const genel=(n,a)=>{if(!cum){cum=[0];for(let i=0;i<114;i++)cum.push(cum[i]+KURAN[i][2].length)}return cum[n-1]+a};
const yukle=()=>window.KURAN?Promise.resolve():Sayfa.yukle('quran.js');
let hiz=+ls.get('okHiz',1),arpx=+ls.get('arpx',27);

function liste(){
  const s=Sayfa.ac("Kur'an-ı Kerim");
  yukle().then(()=>ciz(s)).catch(()=>{s.govde.innerHTML='<p class="note">Kur\'an metni yüklenemedi.</p>'});
}
function ciz(s){
  const son=ls.get('kuranSon',null);
  s.govde.innerHTML=`${son?`<button class="sf-satir sf-oku" id="krDevam"><div class="sf-no">▶</div><div class="sf-ad"><b>Kaldığın yerden devam et</b><small>${esc(AD[son.n-1])} sûresi, ${son.a}. ayet</small></div></button>`:''}
  <input class="sf-ara" id="krAra" type="search" placeholder="Sûre ara (ad veya numara)" autocomplete="off"><div id="krListe"></div>`;
  const yaz=q=>{
    q=(q||'').toLocaleLowerCase('tr').trim();
    $('#krListe').innerHTML=AD.map((a,i)=>({a,i})).filter(x=>!q||String(x.i+1)===q||x.a.toLocaleLowerCase('tr').includes(q)||x.a.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ]/g,'').includes(q.normalize('NFD').replace(/[̀-ͯ]/g,'')))
      .map(x=>`<button class="sf-satir" data-n="${x.i+1}"><div class="sf-no">${x.i+1}</div><div class="sf-ad"><b>${esc(x.a)}</b><small>${KURAN[x.i][1]==='m'?'Mekkî':'Medenî'} · ${KURAN[x.i][2].length} ayet</small></div><div class="sf-ar">${KURAN[x.i][0]}</div></button>`).join('')||'<p class="note">Sonuç bulunamadı.</p>';
    $('#krListe').querySelectorAll('.sf-satir').forEach(b=>b.onclick=()=>ac(+b.dataset.n));
  };
  yaz('');$('#krAra').oninput=e=>yaz(e.target.value);
  if(son)$('#krDevam').onclick=()=>ac(son.n,{ayet:son.a});
}

/* Okuyucu */
function ac(n,opt={}){
  return yukle().then(()=>okuyucu(n,opt));
}
function okuyucu(n,opt){
  const S=KURAN[n-1],ay=S[2],besmele=n!==1&&n!==9;
  if(opt.hiz)hiz=opt.hiz;
  const el=document.createElement('div');el.className='sf';el.style.zIndex=8;
  el.innerHTML=`<div class="ok-bar"><button class="kr-kapat">✕ Kapat</button><div class="kr-tem"><button class="kr-hiz" title="Okuma hızı"></button><button class="kr-k1">A−</button><button class="kr-k2">A+</button></div></div>
  <div class="kr-body" style="--arpx:${arpx}px">
    <div class="ok-baslik">${esc(AD[n-1])} Sûresi</div>
    ${besmele?'<div class="ok-ar"><span class="ay" data-k="b">بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ</span></div>':''}
    <div class="ok-ar">${ay.map((t,i)=>`<span class="ay" data-k="a${i+1}">${t}<span class="no">﴿${AR(i+1)}﴾</span></span>`).join(' ')}</div>
    <p class="note" style="text-align:center;margin-top:18px">Bir ayete dokunursanız dinleme oradan başlar. Ses, Mişari Raşid el-Afasi kaydıdır ve internet gerektirir.</p>
  </div>
  <div class="kr-alt"><button class="btn kr-k kr-on" ${n===1?'disabled':''} aria-label="Önceki sûre">‹</button><button class="btn gold kr-cal">▶ Dinle</button><button class="btn kr-k kr-sn" ${n===114?'disabled':''} aria-label="Sonraki sûre">›</button></div>`;
  document.body.appendChild(el);
  const body=el.querySelector('.kr-body'),btn=el.querySelector('.kr-cal'),hb=el.querySelector('.kr-hiz');
  const kuyruk=[];
  if(besmele)kuyruk.push({k:'b',u:[SES_A+'001001.mp3',SES_B(1)]});
  ay.forEach((_,i)=>kuyruk.push({k:'a'+(i+1),u:[SES_A+p3(n)+p3(i+1)+'.mp3',SES_B(genel(n,i+1))]}));
  const kaydet=a=>ls.set('kuranSon',{n,a:Math.max(1,a)});
  const ilkGorunen=()=>{const t=body.getBoundingClientRect().top;const e=[...body.querySelectorAll('.ay[data-k^=a]')].find(x=>x.getBoundingClientRect().bottom>t+10);return e?+e.dataset.k.slice(1):1};
  const ses=AyetSes({kuyruk,hiz,
    vurgu:k=>{body.querySelectorAll('.ay.cal').forEach(x=>x.classList.remove('cal'));const e=body.querySelector(`.ay[data-k="${k}"]`);if(e){e.classList.add('cal');e.scrollIntoView({block:'center',behavior:'smooth'});if(k[0]==='a')kaydet(+k.slice(1))}},
    durum:(c,i)=>{const it=kuyruk[i];btn.textContent=c?'⏸ '+(it&&it.k[0]==='a'?it.k.slice(1)+'/'+ay.length:'Besmele'):'▶ '+(i?'Devam':'Dinle')},
    bitti:()=>{body.querySelectorAll('.ay.cal').forEach(x=>x.classList.remove('cal'));toast(AD[n-1]+' sûresi bitti. Allah kabul etsin.')},
    hata:()=>toast('Ses yüklenemedi. İnternet bağlantısını kontrol edin.')});
  const hizYaz=()=>{hb.textContent=String(hiz).replace('.',',')+'×';ses.hiz(hiz)};hizYaz();
  hb.onclick=()=>{const L=[.8,1,1.25,1.5];hiz=L[(L.indexOf(hiz)+1)%L.length];ls.set('okHiz',hiz);hizYaz()};
  const boyut=d=>{arpx=Math.max(20,Math.min(48,arpx+d));ls.set('arpx',arpx);body.style.setProperty('--arpx',arpx+'px')};
  el.querySelector('.kr-k1').onclick=()=>boyut(-3);el.querySelector('.kr-k2').onclick=()=>boyut(3);
  const kapat=()=>{if(!ses.caliyor)kaydet(ilkGorunen());ses.dur(true);el.remove()};
  el.querySelector('.kr-kapat').onclick=kapat;
  const git=d=>{ses.dur(true);el.remove();ac(n+d)};
  el.querySelector('.kr-on').onclick=()=>git(-1);el.querySelector('.kr-sn').onclick=()=>git(1);
  btn.onclick=()=>{if(ses.caliyor)ses.dur(false);else ses.baslat()};
  body.addEventListener('click',e=>{const a=e.target.closest('.ay');if(!a)return;const i=kuyruk.findIndex(x=>x.k===a.dataset.k);if(i>=0){ses.dur(false);ses.baslat(i)}});
  if(opt.ayet){const e=body.querySelector(`.ay[data-k="a${opt.ayet}"]`);if(e)setTimeout(()=>e.scrollIntoView({block:'center'}),50)}
  if(opt.cal)ses.baslat(0);
}
window.Kuran={liste,ac};
})();
