/* Çocuklar: namazı ve dini sevdirmeye yönelik çizimli içerikler */
(function(){
const esc=Sayfa.esc;
/* ---- Namaz figürleri: ışık-gölgeli (3B görünümlü) sevimli çocuk, yandan görünüş, kıbleye (sağa) bakıyor ---- */
const G={ten:'url(#nTen)',elb:'url(#nElb)',pan:'url(#nPan)'};
const ln=(a,b,c,d,w,k)=>`<path d="M${a} ${b}L${c} ${d}" stroke="${k}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`+
  `<path d="M${a-w*.18} ${b-w*.12}L${c-w*.18} ${d-w*.12}" stroke="#fff" stroke-opacity=".22" stroke-width="${w*.3}" stroke-linecap="round" fill="none"/>`;
const pl=(pts,w,k)=>`<path d="M${pts.map(p=>p.join(' ')).join('L')}" stroke="${k}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const el=(x,y)=>`<circle cx="${x}" cy="${y}" r="7" fill="${G.ten}"/><circle cx="${x-2}" cy="${y-2.4}" r="2.2" fill="#fff" opacity=".35"/>`;
const bas=(x,y)=>`<g>
 <circle cx="${x-7}" cy="${y+4}" r="5.5" fill="${G.ten}"/>
 <circle cx="${x}" cy="${y}" r="21" fill="${G.ten}"/>
 <path d="M${x-21.5} ${y-2}a21.5 21.5 0 0 1 43 0z" fill="url(#nTakke)"/><path d="M${x-21.5} ${y-2}h43" stroke="#cfd6e4" stroke-width="2.4" stroke-linecap="round"/>
 <path d="M${x-12} ${y-14}q10 -7 22 -2" stroke="#fff" stroke-width="3" stroke-opacity=".7" fill="none" stroke-linecap="round"/>
 <path d="M${x+4} ${y-1}q4 -3 8 0" stroke="#5a3b26" stroke-width="1.6" fill="none" stroke-linecap="round"/>
 <ellipse cx="${x+8}" cy="${y+5}" rx="3.3" ry="4" fill="#2b1d14"/><circle cx="${x+9.2}" cy="${y+3.4}" r="1.4" fill="#fff"/>
 <ellipse cx="${x+13}" cy="${y+12}" rx="4.2" ry="2.6" fill="#ff7f86" opacity=".45"/>
 <path d="M${x+19.5} ${y+5}q3 2 0 5" stroke="#d98f6c" stroke-width="1.6" fill="none" stroke-linecap="round"/>
 <path d="M${x+5} ${y+13}q5 5 11 0" stroke="#7a3b2a" stroke-width="2" fill="none" stroke-linecap="round"/>
 <ellipse cx="${x-6}" cy="${y+8}" rx="6" ry="4" fill="#fff" opacity=".12"/></g>`;
const POZ={
 tekbir:()=>ln(100,172,100,122,16,G.pan)+ln(100,124,100,76,27,G.elb)+pl([[100,82],[120,70],[115,46]],11,G.elb)+el(115,44)+bas(100,50),
 kiyam:()=>ln(100,172,100,122,16,G.pan)+ln(100,124,100,76,27,G.elb)+pl([[100,88],[112,102],[94,94]],11,G.elb)+el(92,93)+bas(100,50),
 ruku:()=>ln(68,172,68,122,16,G.pan)+ln(68,120,132,112,27,G.elb)+ln(132,114,74,152,11,G.elb)+el(72,153)+bas(156,106),
 kavme:()=>ln(100,172,100,122,16,G.pan)+ln(100,124,100,76,27,G.elb)+ln(100,84,104,128,11,G.elb)+el(104,131)+bas(100,50),
 secde:()=>ln(24,170,68,168,15,G.pan)+ln(68,166,64,124,18,G.pan)+ln(64,122,122,150,26,G.elb)+ln(122,152,140,170,11,G.elb)+el(142,171)+bas(150,153),
 celse:()=>ln(28,170,88,168,17,G.pan)+ln(64,158,68,100,27,G.elb)+ln(70,100,96,138,11,G.elb)+el(98,140)+bas(72,66),
 selam:()=>ln(28,170,88,168,17,G.pan)+ln(64,158,68,100,27,G.elb)+ln(70,100,96,138,11,G.elb)+el(98,140)+bas(72,66)+`<path d="M104 50q22 -16 44 0" stroke="#e07a5f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M144 42l6 8-10 2" stroke="#e07a5f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
};
const DEFS=`<defs>
 <linearGradient id="nDuvar" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff8e6"/><stop offset="1" stop-color="#ffe2a8"/></linearGradient>
 <radialGradient id="nTen" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#ffe9d6"/><stop offset=".6" stop-color="#f7c9a3"/><stop offset="1" stop-color="#df9f74"/></radialGradient>
 <linearGradient id="nElb" gradientUnits="userSpaceOnUse" x1="40" y1="40" x2="160" y2="175"><stop offset="0" stop-color="#5fd1bd"/><stop offset=".55" stop-color="#2ea492"/><stop offset="1" stop-color="#1b6f63"/></linearGradient>
 <linearGradient id="nPan" gradientUnits="userSpaceOnUse" x1="20" y1="110" x2="110" y2="175"><stop offset="0" stop-color="#7d93e6"/><stop offset="1" stop-color="#3a4f9e"/></linearGradient>
 <linearGradient id="nTakke" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset="1" stop-color="#dfe5ef"/></linearGradient>
 <linearGradient id="nHali" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c0504d"/><stop offset="1" stop-color="#8e2f2c"/></linearGradient>
 <filter id="nGol" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1.5" dy="3" stdDeviation="2.2" flood-color="#5a3b10" flood-opacity=".28"/></filter>
 <filter id="nBul"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
const figur=k=>`<svg viewBox="0 0 200 200" class="cc-fig" aria-hidden="true">${DEFS}
 <rect width="200" height="200" rx="18" fill="url(#nDuvar)"/>
 <path d="M150 168V70a22 22 0 0 1 44 0v98z" fill="#f3cf86" opacity=".55"/><path d="M158 168V76a14 14 0 0 1 28 0v92z" fill="#e8b866" opacity=".5"/>
 <rect x="8" y="168" width="184" height="18" rx="6" fill="url(#nHali)"/><rect x="8" y="182" width="184" height="4" rx="2" fill="#6e2220" opacity=".6"/>
 <path d="M16 175h168" stroke="#f2d27a" stroke-width="2" stroke-dasharray="6 5"/>
 <ellipse cx="${k==='secde'?96:k==='ruku'?100:k==='celse'||k==='selam'?62:100}" cy="171" rx="${k==='secde'?62:k==='celse'||k==='selam'?44:30}" ry="5" fill="#000" opacity=".18" filter="url(#nBul)"/>
 <g filter="url(#nGol)">${POZ[k]()}</g>
 <text x="190" y="24" text-anchor="end" font-size="12" font-family="system-ui,sans-serif" fill="#9a7b2e">Kıble ➜</text></svg>`;
/* Adımlarda okunanlar: d = Dualar listesindeki sıra, s = sûre no, z = kısa zikir [Arapça, okunuş, anlam] */
const Z={
 tekbir:['اَللّٰهُ اَكْبَرُ','Allâhu Ekber','Allah en büyüktür.'],
 ruku:['سُبْحَانَ رَبِّيَ الْعَظِيمِ','Sübhâne rabbiye\'l-azîm (3 kez)','Yüce Rabbimi her türlü eksiklikten uzak tutarım.'],
 semi:['سَمِعَ اللّٰهُ لِمَنْ حَمِدَهُ','Semiallâhü limen hamideh','Allah, kendisine hamd edeni işitir.'],
 hamd:['رَبَّنَا لَكَ الْحَمْدُ','Rabbenâ leke\'l-hamd','Rabbimiz, hamd yalnız sanadır.'],
 secde:['سُبْحَانَ رَبِّيَ الْاَعْلٰى','Sübhâne rabbiye\'l-a\'lâ (3 kez)','En yüce Rabbimi her türlü eksiklikten uzak tutarım.'],
 selam:['اَلسَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللّٰهِ','Esselâmü aleyküm ve rahmetullâh','Allah\'ın selamı ve rahmeti üzerinize olsun.']};
const ADIM=[
 ['tekbir','1. Niyet ve iftitah tekbiri','Kıbleye döneriz, hangi namazı kılacağımızı içimizden düşünürüz. Ellerimizi kulaklarımıza kaldırıp "Allahu Ekber" deriz.',[{z:'tekbir'}]],
 ['kiyam','2. Kıyam (ayakta duruş)','Ellerimizi bağlarız. Önce Sübhâneke, sonra Eûzü-Besmele, Fâtiha ve kısa bir sûre okuruz.',[{d:0,ad:'Sübhâneke'},{d:1,ad:'Eûzü – Besmele'},{s:1,ad:'Fâtiha'},{s:112,ad:'Bir sûre: İhlâs'}]],
 ['ruku','3. Rükû','"Allahu Ekber" diyerek eğiliriz. Ellerimiz dizlerimizde, sırtımız dümdüz.',[{z:'ruku'}]],
 ['kavme','4. Doğrulma (kavme)','Doğrulurken "Semiallâhü limen hamideh", dik durunca "Rabbenâ leke\'l-hamd" deriz.',[{z:'semi'},{z:'hamd'}]],
 ['secde','5. Secde','"Allahu Ekber" diyerek secdeye gideriz. Alnımız ve burnumuz yere değer. Allah\'a en yakın olduğumuz an secdedir!',[{z:'secde'}]],
 ['celse','6. İki secde arası oturuş','"Allahu Ekber" diyerek kısa bir süre otururuz, sonra yine "Allahu Ekber" diyerek ikinci secdeye gideriz.',[{z:'tekbir'},{z:'secde'}]],
 ['kiyam','7. İkinci rekât','"Allahu Ekber" diyerek ayağa kalkarız. Sübhâneke okumadan Besmele, Fâtiha ve bir sûre okuruz; sonra rükû ve secdeleri aynı şekilde yaparız.',[{s:1,ad:'Fâtiha'},{s:108,ad:'Bir sûre: Kevser'}]],
 ['celse','8. Oturuş (tahiyyat)','İkinci rekâtın secdelerinden sonra otururuz. İlk oturuşta yalnız Ettehiyyâtü okunur. Son oturuşta Ettehiyyâtü\'den sonra Salli, Bârik ve Rabbenâ duaları da okunur.',[{d:2,ad:'Ettehiyyâtü'},{d:3,ad:'Allâhümme Salli'},{d:4,ad:'Allâhümme Bârik'},{d:5,ad:'Rabbenâ Âtinâ'},{d:6,ad:'Rabbenağfirlî'}]],
 ['selam','9. Selam','Önce sağımıza, sonra solumuza başımızı çevirerek selam veririz. Namaz bitti, Allah kabul etsin!',[{z:'selam'}]]
];
function namaz(){
  const s=Sayfa.ac('Namaz nasıl kılınır?',{kapaninca:()=>DuaSes.dur()});let i=0;
  const ciz=()=>{const a=ADIM[i];DuaSes.dur();
    s.govde.innerHTML=`<div class="cc-kart">${figur(a[0])}<h3>${a[1]}</h3><p>${esc(a[2])}</p>
    <div class="cc-okunan"><small>Bu adımda okunanlar</small><div>${a[3].map((o,j)=>`<button data-j="${j}">${o.s?'📖 ':o.d!=null?'🤲 ':'🔊 '}${esc(o.ad||(Z[o.z]&&Z[o.z][1])||'')}</button>`).join('')}</div><div id="ccOkPanel"></div></div></div>
    <div class="cc-nokta">${ADIM.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>
    <div class="kb-btns"><button class="btn" id="ccOn" ${i?'':'disabled'}>‹ Geri</button><button class="btn gold" id="ccSn">${i===ADIM.length-1?'Baştan başla':'İleri ›'}</button></div>`;
    s.govde.querySelectorAll('.cc-okunan button').forEach(b=>b.onclick=()=>{
      const o=a[3][+b.dataset.j];
      if(o.s){Kuran.ac(o.s,{hiz:.8,cal:true});return}
      const d=o.d!=null?(window.DUALAR||[])[o.d]:[o.ad,'',...Z[o.z]];if(!d)return;
      s.govde.querySelectorAll('.cc-okunan button').forEach(x=>x.classList.toggle('on',x===b));
      $('#ccOkPanel').innerHTML=`<p class="cc-dua-ar" lang="ar" dir="rtl">${d[2]}</p><p class="cc-dua-ok">${esc(d[3])}</p><button class="btn cc-dua-dinle" id="ccDinle">▶ Dinle</button><p class="cc-dua-an">${esc(d[4])}</p>`;
      $('#ccDinle').onclick=e=>DuaSes.cal(o.d!=null?o.d:d,e.currentTarget);
    });
    $('#ccOn').onclick=()=>{i--;ciz()};$('#ccSn').onclick=()=>{i=(i+1)%ADIM.length;ciz()}};
  ciz();
}
/* ---- Abdest ---- */
const ABD=[['🤲','Bismillah de','Abdeste "Bismillâhirrahmânirrahîm" diyerek başlarız.'],['🖐️','Elleri yıka','Ellerimizi bileklerimize kadar üç kez yıkarız.'],['👄','Ağzı çalkala','Ağzımıza su alıp üç kez çalkalarız.'],['👃','Burna su ver','Burnumuza su çekip üç kez temizleriz.'],['😊','Yüzü yıka','Yüzümüzü üç kez yıkarız.'],['💪','Kolları yıka','Önce sağ, sonra sol kolumuzu dirseğimizle birlikte yıkarız.'],['👦','Başı mesh et','Islak elimizle başımızı sileriz.'],['👂','Kulakları sil','Kulaklarımızı ve ensemizi sileriz.'],['🦶','Ayakları yıka','Önce sağ, sonra sol ayağımızı topuklarımızla birlikte yıkarız.']];
const abdest=()=>{const s=Sayfa.ac('Abdest alalım');s.govde.innerHTML=ABD.map((a,i)=>`<div class="cc-abd"><div class="cc-em">${a[0]}</div><div><b>${i+1}. ${a[1]}</b><p>${esc(a[2])}</p></div></div>`).join('')+'<p class="note">Abdestli olmak, namaza hazırlanmanın ilk adımıdır. Temiz olmayı Allah sever!</p>'};
/* ---- Beş vakit ---- */
const sky=(a,b,dis)=>`<svg viewBox="0 0 120 80" class="cc-sky"><defs><linearGradient id="s${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b[0]}"/><stop offset="1" stop-color="${b[1]}"/></linearGradient></defs><rect width="120" height="80" rx="12" fill="url(#s${a})"/>${dis}<path d="M0 66q20-12 40-4t40-2 40 6v14H0z" fill="#23325f" opacity=".85"/></svg>`;
const VAKIT=[
 ['Sabah',[['2','sünnet'],['2','farz']],'Güneş doğmadan önce kılınır. Kuşlar cıvıldarken uyanmak çok güzeldir!',sky('a',['#f5b7c8','#ffe0a3'],'<circle cx="30" cy="62" r="12" fill="#ffd166"/>')],
 ['Öğle',[['4','ilk sünnet'],['4','farz'],['2','son sünnet']],'Gün ortasında, güneş tepedeyken kılınır.',sky('b',['#6cc3ff','#c8ecff'],'<circle cx="60" cy="22" r="13" fill="#ffd166"/>')],
 ['İkindi',[['4','sünnet'],['4','farz']],'Güneş alçalmaya başlayınca kılınır.',sky('c',['#ffd27a','#fff0c2'],'<circle cx="92" cy="40" r="12" fill="#ffb347"/>')],
 ['Akşam',[['3','farz'],['2','sünnet']],'Güneş batınca kılınır; iftar vaktidir.',sky('d',['#e07a5f','#f4b860'],'<circle cx="60" cy="64" r="14" fill="#ff9f43"/>')],
 ['Yatsı',[['4','ilk sünnet'],['4','farz'],['2','son sünnet'],['3','vitir']],'Gökyüzü kararınca, yatmadan önce kılınır.',sky('e',['#0f1b3d','#2a3b78'],'<path d="M78 14a14 14 0 1 0 10 22 11 11 0 0 1-10-22z" fill="#fff3c4"/><circle cx="24" cy="18" r="1.6" fill="#fff"/><circle cx="44" cy="30" r="1.3" fill="#fff"/><circle cx="104" cy="22" r="1.5" fill="#fff"/><circle cx="56" cy="12" r="1.2" fill="#fff"/>')]
];
const rekat=r=>`<div class="cc-rk">${r.map(([n,t])=>`<span class="${t==='farz'?'fz':t==='vitir'?'vt':''}"><b>${n}</b>${t}</span>`).join('<i>+</i>')}</div>`;
const vakitler=()=>{const s=Sayfa.ac('Beş vakit namaz');s.govde.innerHTML='<p class="note" style="margin:0 0 6px">Bir günde beş vakit namaz kılarız. Her vakitte kaç rekât kıldığımızı öğrenelim!</p>'+VAKIT.map((v,i)=>{const top=v[1].reduce((a,r)=>a+ +r[0],0);return `<div class="cc-vakit">${v[3]}<div style="flex:1;min-width:0"><b>${i+1}. ${v[0]} namazı</b><span class="cc-r">${top} rekât</span><p>${esc(v[2])}</p>${rekat(v[1])}</div></div>`}).join('')+
  '<p class="note"><b style="color:var(--altin);font-weight:400">Farz:</b> Allah\'ın kesin emri. <b style="color:var(--altin);font-weight:400">Sünnet:</b> Peygamberimizin kıldığı ve tavsiye ettiği. <b style="color:var(--altin);font-weight:400">Vitir:</b> Yatsıdan sonra kılınan 3 rekâtlık vacip namaz. Bir günde 17 rekât farz kılarız.</p>'};
/* ---- Ezber köşesi ---- */
const EZBER=[[1,'Fâtiha','Namazın her rekâtında okuruz; Kur\'an\'ın ilk sûresi.'],[2,'Bakara (1–5. ayetler)','"Elif Lâm Mîm" ile başlayan ilk sayfa; müttakilerin özellikleri.',1,5],
 [93,'Duhâ','Allah\'ın Peygamberimizi yalnız bırakmadığını müjdeler.'],[94,'İnşirâh','Her zorlukla beraber bir kolaylık vardır.'],[95,'Tîn','İnsanın en güzel biçimde yaratıldığını anlatır.'],[96,'Alak','İlk inen ayetler: "Oku!"'],[97,'Kadir','Bin aydan hayırlı Kadir Gecesi.'],[98,'Beyyine','Apaçık delil ve iyi insanların karşılığı.'],[99,'Zilzâl','Zerre kadar iyilik de kötülük de karşılık bulur.'],[100,'Âdiyât','Koşan atlar ve insanın nankörlüğü.'],[101,'Kâria','Kıyamet gününde amellerin tartılması.'],[102,'Tekâsür','Çoklukla övünmenin insanı oyalaması.'],[103,'Asr','Zamana yemin eder; iman, iyilik, hak ve sabrı tavsiye eder.'],[104,'Hümeze','Arkadan çekiştiren ve alay edenler.'],
 [105,'Fîl','Kâbe\'yi yıkmaya gelen fil ordusunun hikâyesi.'],[106,'Kureyş','Kureyş kabilesine verilen nimetler ve şükür.'],[107,'Mâûn','Yetime ve yoksula iyilik yapmayı öğretir.'],[108,'Kevser','Allah\'ın Peygamberimize verdiği bol nimet.'],[109,'Kâfirûn','Herkesin dini kendine; biz yalnız Allah\'a ibadet ederiz.'],[110,'Nasr','Allah\'ın yardımı ve zafer müjdesi.'],[111,'Tebbet','Peygamberimize düşmanlık edenin sonu.'],[112,'İhlâs','Allah\'ın bir olduğunu anlatır.'],[113,'Felak','Her türlü kötülükten Allah\'a sığınırız.'],[114,'Nâs','Kalbe vesvese verenlerden Allah\'a sığınırız.']];
/* Duaları sesli okuma: varsa dualar/<no>.mp3 kaydı, yoksa telefonun ses motoru (Arapça; Arapça ses yoksa Türkçe okunuş) */
const DuaSes=(()=>{
  let aktif=null,ses=null,dinleyici=null;
  const bitir=()=>{if(aktif){aktif.classList.remove('cal');aktif.textContent='▶ Dinle'}aktif=null};
  const dur=()=>{try{ses&&ses.pause()}catch(e){}ses=null;try{P.NurYerli&&P.NurYerli.sesiDurdur()}catch(e){}try{window.speechSynthesis&&speechSynthesis.cancel()}catch(e){}bitir()};
  const tts=async(d,btn)=>{
    const Y=P.NurYerli;
    if(Y&&Y.seslendir){
      if(!dinleyici)dinleyici=Y.addListener('seslendirmeBitti',()=>bitir());
      try{const r=await Y.seslendir({metin:d[2].replace(/۝/g,' '),yedek:d[3],hiz:.8});if(r&&r.dil==='tr')toast('Telefonda Arapça ses bulunamadı; okunuş Türkçe seslendiriliyor.');return}catch(e){}
    }
    if(window.speechSynthesis&&window.SpeechSynthesisUtterance){const u=new SpeechSynthesisUtterance(d[2]);u.lang='ar-SA';u.rate=.8;u.onend=bitir;speechSynthesis.speak(u);return}
    bitir();toast('Bu cihazda sesli okuma desteklenmiyor.');
  };
  const cal=(i,btn)=>{
    const d=typeof i==='object'?i:(window.DUALAR||[])[i];if(!d)return;
    if(aktif===btn){dur();return}
    dur();aktif=btn;btn.classList.add('cal');btn.textContent='⏸ Durdur';
    if(typeof i==='object'){tts(d,btn);return}
    const a=new Audio('dualar/'+(i+1)+'.mp3');ses=a;
    a.onended=()=>{if(ses===a)bitir()};
    a.play().catch(()=>{if(ses===a){ses=null;tts(d,btn)}});
  };
  return{cal,dur};
})();
window.DuaSes=DuaSes;
/* İki sûre/dua açılışında bir geçiş reklamı (iki reklam arasında en az 1 dakika) */
let ezAcilan=0,ezSonReklam=0;
const ezReklam=()=>{if(++ezAcilan<2||Date.now()-ezSonReklam<60e3)return;ezAcilan=0;ezSonReklam=Date.now();if(typeof showInter==='function')showInter()};
let ezSekme='sure';
const ezber=()=>{const s=Sayfa.ac('Ezber köşesi',{kapaninca:()=>DuaSes.dur()});
  const ciz=()=>{
    const D=window.DUALAR||[];
    s.govde.innerHTML=`<div class="cc-sekme"><button data-s="sure" class="${ezSekme==='sure'?'on':''}">📖 Sûreler</button><button data-s="dua" class="${ezSekme==='dua'?'on':''}">🤲 Dualar</button></div>`+
    (ezSekme==='sure'
     ?'<p class="note" style="margin:0 0 6px">Sırayla dinle, tekrar et, ezberle! Sûre yavaş (0,8×) okunur; hızı değiştirebilirsin. Ses için internet gerekir.</p>'+EZBER.map((e,i)=>`<button class="sf-satir" data-i="${i}"><div class="sf-no">${i+1}</div><div class="sf-ad"><b>${e[1]}${e[3]?'':' Sûresi'}</b><small>${e[2]}</small></div><div class="sf-no" style="font-size:17px">🎧</div></button>`).join('')
     :'<p class="note" style="margin:0 0 6px">Namazda okunan dualar ve her gün bilmemiz gereken dualar. Duaya dokun; Arapçası, okunuşu ve anlamı açılsın, "Dinle" ile sesli okunsun.</p>'+D.map((d,i)=>`<div class="cc-dua" data-i="${i}"><button class="cc-dua-bas"><b>${esc(d[0])}</b><small>${esc(d[1])}</small><i>+</i></button><div class="cc-dua-ic"><div><p class="cc-dua-ar" lang="ar" dir="rtl">${d[2]}</p><p class="cc-dua-ok">${esc(d[3])}</p><button class="btn cc-dua-dinle" data-i="${i}">▶ Dinle</button><p class="cc-dua-an"><b>Anlamı:</b> ${esc(d[4])}</p>${d[5]?`<p class="note" style="margin:4px 0 0">Kaynak: ${esc(d[5])}</p>`:''}</div></div></div>`).join(''));
    s.govde.querySelectorAll('.cc-sekme button').forEach(b=>b.onclick=()=>{DuaSes.dur();ezSekme=b.dataset.s;ciz()});
    s.govde.querySelectorAll('.sf-satir[data-i]').forEach(b=>b.onclick=()=>{const e=EZBER[+b.dataset.i];Kuran.ac(e[0],{hiz:.8,cal:true,bas:e[3],son:e[4]});ezReklam()});
    s.govde.querySelectorAll('.cc-dua-bas').forEach(b=>b.onclick=()=>{const k=b.parentNode;k.classList.toggle('ac');if(k.classList.contains('ac'))ezReklam()});
    s.govde.querySelectorAll('.cc-dua-dinle').forEach(b=>b.onclick=()=>DuaSes.cal(+b.dataset.i,b));
  };
  ciz();
};
/* ---- Allah'ın güzel isimleri ---- */
const TDV='https://islamansiklopedisi.org.tr/',ESMA=window.ESMA||[];
const isimler=()=>{const s=Sayfa.ac('Allah\'ın güzel isimleri'),AR=window.ESMA_AR||[];
  s.govde.innerHTML='<p class="note" style="margin:0 0 6px">Allah\'ın doksan dokuz güzel ismi (Esmâ-i Hüsnâ). Bir isme dokun, anlamı altında açılsın; anlamına dokunursan TDV İslâm Ansiklopedisi\'nde açıklamasını okursun.</p><div class="cc-isim">'+ESMA.map((x,i)=>`<div role="button" tabindex="0" data-i="${i}"><small>${i+1}</small><i class="ar" lang="ar">${AR[i]||''}</i><b>${esc(x[0])}</b><span><a href="${TDV+(x[2]||'esma-i-husna')}" target="_blank" rel="noopener">${esc(x[1])} ↗</a></span></div>`).join('')+'</div><p class="note">Anlamlar kısaca verilmiştir. Kaynak: TDV İslâm Ansiklopedisi, "Esmâ-i Hüsnâ" ve ilgili maddeler.</p>';
  s.govde.querySelectorAll('.cc-isim>div').forEach(b=>b.onclick=e=>{if(e.target.closest('a'))return;b.classList.toggle('ac')})};
/* ---- Mini test ---- */
const Q=window.COCUK_SORU||[],TUR=10;
const karistir=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
function soruSec(){ // daha önce sorulmamış sorulardan seçer; hepsi bitince baştan başlar
  let gor=ls.get('cocukGor',[]);if(!Array.isArray(gor))gor=[];
  let kalan=Q.map((_,i)=>i).filter(i=>!gor.includes(i));
  if(kalan.length<TUR){gor=[];kalan=Q.map((_,i)=>i)}
  const sec=karistir(kalan).slice(0,TUR);ls.set('cocukGor',gor.concat(sec));
  return sec.map(i=>{const q=Q[i],sik=karistir(q.slice(1));return[q[0],sik,sik.indexOf(q[1])]});
}
/* Test sesleri (Web Audio ile üretilir, dosya gerekmez) */
let SAC=null;
function oyunSesi(tur){
  try{
    SAC=SAC||new (window.AudioContext||window.webkitAudioContext)();if(SAC.state==='suspended')SAC.resume();
    const t=SAC.currentTime+.02;
    const nota=(f,bas,sure,tip,vol,f2)=>{const o=SAC.createOscillator(),g=SAC.createGain();o.type=tip||'triangle';o.frequency.setValueAtTime(f,t+bas);if(f2)o.frequency.exponentialRampToValueAtTime(f2,t+bas+sure);
      g.gain.setValueAtTime(0,t+bas);g.gain.linearRampToValueAtTime(vol||.22,t+bas+.02);g.gain.exponentialRampToValueAtTime(.001,t+bas+sure);o.connect(g);g.connect(SAC.destination);o.start(t+bas);o.stop(t+bas+sure+.05)};
    if(tur==='dogru'){nota(784,0,.16);nota(1047,.09,.18);nota(1568,.18,.4,'sine',.18)}                       // ding-ding-ding
    else if(tur==='yanlis'){nota(330,0,.32,'sine',.16,294);nota(262,.26,.55,'sine',.15,220)}                 // yumuşak "bım-bım"
    else{[523,659,784,1047].forEach((f,k)=>nota(f,k*.13,.22));[523,659,784,1047].forEach(f=>nota(f,.6,1.1,'triangle',.12));nota(1568,.6,1.1,'sine',.08)} // tada!
  }catch(e){}
}
const test=()=>{
  const s=Sayfa.ac('Mini test');let i=0,p=0,T=soruSec();
  const soru=()=>{
    if(i>=T.length){const en=Math.max(p,+ls.get('cocukPuan',0));ls.set('cocukPuan',en);const N=T.length;
      s.govde.innerHTML=`<div class="cc-kart"><div class="cc-yildiz">${'⭐'.repeat(p)}${'☆'.repeat(N-p)}</div><h3>${p}/${N} doğru!</h3><p>${p>=9?'Harikasın, maşallah!':p>=6?'Çok güzel, biraz daha çalışalım!':'Güzel başladın, tekrar deneyelim!'}</p><p class="note">En iyi puanın: ${en}/${N}</p></div><button class="btn gold" id="ccTekrar">Yeni sorularla oyna</button>`;
      oyunSesi('bitis');
      $('#ccTekrar').onclick=async()=>{const b=$('#ccTekrar');b.disabled=true;b.textContent='Yükleniyor…';try{if(typeof showInter==='function')await showInter()}catch(e){}i=0;p=0;T=soruSec();soru()};return}
    const q=T[i];
    s.govde.innerHTML=`<div class="cc-kart"><small>Soru ${i+1}/${T.length}</small><h3>${esc(q[0])}</h3>${q[1].map((x,j)=>`<button class="btn cc-sec" data-j="${j}">${esc(x)}</button>`).join('')}</div>`;
    s.govde.querySelectorAll('.cc-sec').forEach(b=>b.onclick=()=>{
      const ok=+b.dataset.j===q[2];if(ok)p++;oyunSesi(ok?'dogru':'yanlis');
      s.govde.querySelectorAll('.cc-sec').forEach(x=>{x.disabled=true;if(+x.dataset.j===q[2])x.classList.add('dogru')});
      if(!ok)b.classList.add('yanlis');
      setTimeout(()=>{i++;soru()},ok?700:1400);
    });
  };
  soru();
};
function ac(){
  const s=Sayfa.ac('Çocuklar');
  const K=[['🕌','Namaz nasıl kılınır?','Resimlerle adım adım','#3E8577',namaz],['💧','Abdest alalım','Dokuz kolay adım','#3a78c2',abdest],['🌅','Beş vakit namaz','Sabahtan yatsıya','#d98a3a',vakitler],['🎧','Ezber köşesi','Sûreler ve dualar','#8a5bb5',ezber],['✨','Allah\'ın güzel isimleri','99 isim ve anlamları','#c25a7a',isimler],['⭐','Mini test',Q.length+' sorudan her seferinde 10 soru','#c9a45c',test]];
  s.govde.innerHTML=`<p class="note" style="margin:0 0 4px">Merhaba küçük dostum! Birlikte öğrenelim.</p><div class="cc-izgara">${K.map((k,i)=>`<button data-i="${i}" style="--c:${k[3]}"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></button>`).join('')}</div>${ls.get('cocukPuan',0)?`<p class="note" style="text-align:center">Testteki en iyi puanın: ${ls.get('cocukPuan',0)}/${TUR} ⭐</p>`:''}`;
  s.govde.querySelectorAll('.cc-izgara button').forEach(b=>b.onclick=()=>K[+b.dataset.i][4]());
}
window.Cocuk={ac};
})();
