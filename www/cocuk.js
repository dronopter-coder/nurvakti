/* Çocuklar: namazı ve dini sevdirmeye yönelik çizimli içerikler */
(function(){
const esc=Sayfa.esc;
/* ---- Namaz figürleri (yandan görünüş, sağa yani kıbleye bakıyor) ---- */
const SK='#f2c7a1',GV='#2e9d8f',PT='#4a5fa8',KP='#f0c24b';
const ln=(a,b,c,d,w,k)=>`<path d="M${a} ${b}L${c} ${d}" stroke="${k}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;
const pl=(pts,w,k)=>`<path d="M${pts.map(p=>p.join(' ')).join('L')}" stroke="${k}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" fill="none"/>`;
const bas=(x,y)=>`<circle cx="${x}" cy="${y}" r="19" fill="${SK}"/><path d="M${x-19} ${y-3}a19 19 0 0 1 38 0z" fill="${KP}"/><circle cx="${x+5}" cy="${y+2}" r="2.2" fill="#3b2a1e"/><circle cx="${x+10}" cy="${y+10}" r="3.2" fill="#ec9a8c" opacity=".7"/><path d="M${x+2} ${y+9}q5 5 10 0" stroke="#3b2a1e" stroke-width="1.8" fill="none" stroke-linecap="round"/>`;
const POZ={
 tekbir:()=>ln(100,172,100,122,15,PT)+ln(100,124,100,76,25,GV)+pl([[100,82],[120,70],[115,46]],10,GV)+`<circle cx="115" cy="44" r="6" fill="${SK}"/>`+bas(100,52),
 kiyam:()=>ln(100,172,100,122,15,PT)+ln(100,124,100,76,25,GV)+pl([[100,88],[112,102],[94,94]],10,GV)+`<circle cx="92" cy="93" r="6" fill="${SK}"/>`+bas(100,52),
 ruku:()=>ln(68,172,68,122,15,PT)+ln(68,120,132,112,25,GV)+ln(132,114,74,152,10,GV)+`<circle cx="72" cy="153" r="6" fill="${SK}"/>`+bas(156,108),
 kavme:()=>ln(100,172,100,122,15,PT)+ln(100,124,100,76,25,GV)+ln(100,84,104,128,10,GV)+`<circle cx="104" cy="131" r="6" fill="${SK}"/>`+bas(100,52),
 secde:()=>ln(24,170,68,168,14,PT)+ln(68,166,64,124,17,PT)+ln(64,122,122,150,24,GV)+ln(122,152,140,170,10,GV)+`<circle cx="142" cy="172" r="6" fill="${SK}"/>`+bas(150,156),
 celse:()=>ln(28,170,88,168,16,PT)+ln(64,158,68,100,25,GV)+ln(70,100,96,138,10,GV)+`<circle cx="98" cy="140" r="6" fill="${SK}"/>`+bas(72,68),
 selam:()=>ln(28,170,88,168,16,PT)+ln(64,158,68,100,25,GV)+ln(70,100,96,138,10,GV)+`<circle cx="98" cy="140" r="6" fill="${SK}"/>`+bas(72,68)+`<path d="M104 52q22 -16 44 0" stroke="#e07a5f" stroke-width="3" fill="none" stroke-linecap="round"/><path d="M144 44l6 8-10 2" stroke="#e07a5f" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
};
const figur=k=>`<svg viewBox="0 0 200 200" class="cc-fig" aria-hidden="true"><rect width="200" height="200" rx="18" fill="url(#cg)"/><defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff6dd"/><stop offset="1" stop-color="#ffe6b0"/></linearGradient></defs><rect x="8" y="172" width="184" height="14" rx="5" fill="#2f8f83"/><path d="M16 179h168" stroke="#e8c468" stroke-width="2" stroke-dasharray="5 5"/>${POZ[k]()}<text x="190" y="26" text-anchor="end" font-size="12" font-family="system-ui,sans-serif" fill="#9a7b2e">Kıble ➜</text></svg>`;
const ADIM=[
 ['tekbir','1. Niyet ve tekbir','Kıbleye dönüp hangi namazı kılacağımızı içimizden düşünürüz. Ellerimizi kulaklarımıza kaldırıp "Allahu Ekber" deriz.'],
 ['kiyam','2. Kıyam','Ellerimizi bağlarız ve ayakta dururuz. Fâtiha Sûresi ile kısa bir sûre okuruz.'],
 ['ruku','3. Rükû','"Allahu Ekber" diyerek eğiliriz. Ellerimiz dizlerimizde, sırtımız dümdüz. Üç kez "Sübhâne rabbiyel azîm" deriz.'],
 ['kavme','4. Doğrulma','"Semiallahü limen hamideh" diyerek doğruluruz. Sonra "Rabbenâ lekel hamd" deriz.'],
 ['secde','5. Secde','"Allahu Ekber" diyerek secdeye gideriz. Alnımız ve burnumuz yere değer. Üç kez "Sübhâne rabbiyel a\'lâ" deriz.'],
 ['celse','6. Oturuş','Kısa bir süre oturur, sonra ikinci secdeye gideriz. Allah\'a en yakın olduğumuz an secdedir!'],
 ['selam','7. Selam','Son oturuşta dualarımızı okuruz. Önce sağımıza, sonra soluma "Esselâmü aleyküm ve rahmetullah" diyerek selam veririz. Namaz bitti, Allah kabul etsin!']
];
function namaz(){
  const s=Sayfa.ac('Namaz nasıl kılınır?');let i=0;
  const ciz=()=>{const a=ADIM[i];s.govde.innerHTML=`<div class="cc-kart">${figur(a[0])}<h3>${a[1]}</h3><p>${esc(a[2])}</p></div>
  <div class="cc-nokta">${ADIM.map((_,j)=>`<i class="${j===i?'on':''}"></i>`).join('')}</div>
  <div class="kb-btns"><button class="btn" id="ccOn" ${i?'':'disabled'}>‹ Geri</button><button class="btn gold" id="ccSn">${i===ADIM.length-1?'Baştan başla':'İleri ›'}</button></div>`;
    $('#ccOn').onclick=()=>{i--;ciz()};$('#ccSn').onclick=()=>{i=(i+1)%ADIM.length;ciz()}};
  ciz();
}
/* ---- Abdest ---- */
const ABD=[['🤲','Bismillah de','Abdeste "Bismillâhirrahmânirrahîm" diyerek başlarız.'],['🖐️','Elleri yıka','Ellerimizi bileklerimize kadar üç kez yıkarız.'],['👄','Ağzı çalkala','Ağzımıza su alıp üç kez çalkalarız.'],['👃','Burna su ver','Burnumuza su çekip üç kez temizleriz.'],['😊','Yüzü yıka','Yüzümüzü üç kez yıkarız.'],['💪','Kolları yıka','Önce sağ, sonra sol kolumuzu dirseğimizle birlikte yıkarız.'],['👦','Başı mesh et','Islak elimizle başımızı sileriz.'],['👂','Kulakları sil','Kulaklarımızı ve ensemizi sileriz.'],['🦶','Ayakları yıka','Önce sağ, sonra sol ayağımızı topuklarımızla birlikte yıkarız.']];
const abdest=()=>{const s=Sayfa.ac('Abdest alalım');s.govde.innerHTML=ABD.map((a,i)=>`<div class="cc-abd"><div class="cc-em">${a[0]}</div><div><b>${i+1}. ${a[1]}</b><p>${esc(a[2])}</p></div></div>`).join('')+'<p class="note">Abdestli olmak, namaza hazırlanmanın ilk adımıdır. Temiz olmayı Allah sever!</p>'};
/* ---- Beş vakit ---- */
const sky=(a,b,dis)=>`<svg viewBox="0 0 120 80" class="cc-sky"><defs><linearGradient id="s${a}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${b[0]}"/><stop offset="1" stop-color="${b[1]}"/></linearGradient></defs><rect width="120" height="80" rx="12" fill="url(#s${a})"/>${dis}<path d="M0 66q20-12 40-4t40-2 40 6v14H0z" fill="#23325f" opacity=".85"/></svg>`;
const VAKIT=[
 ['Sabah','2 rekât farz','Güneş doğmadan önce kılınır. Kuşlar cıvıldarken uyanmak çok güzeldir!',sky('a',['#f5b7c8','#ffe0a3'],'<circle cx="30" cy="62" r="12" fill="#ffd166"/>')],
 ['Öğle','4 rekât farz','Gün ortasında, güneş tepedeyken kılınır.',sky('b',['#6cc3ff','#c8ecff'],'<circle cx="60" cy="22" r="13" fill="#ffd166"/>')],
 ['İkindi','4 rekât farz','Güneş alçalmaya başlayınca kılınır.',sky('c',['#ffd27a','#fff0c2'],'<circle cx="92" cy="40" r="12" fill="#ffb347"/>')],
 ['Akşam','3 rekât farz','Güneş batınca kılınır; iftar vaktidir.',sky('d',['#e07a5f','#f4b860'],'<circle cx="60" cy="64" r="14" fill="#ff9f43"/>')],
 ['Yatsı','4 rekât farz','Gökyüzü kararınca, yatmadan önce kılınır.',sky('e',['#0f1b3d','#2a3b78'],'<path d="M78 14a14 14 0 1 0 10 22 11 11 0 0 1-10-22z" fill="#fff3c4"/><circle cx="24" cy="18" r="1.6" fill="#fff"/><circle cx="44" cy="30" r="1.3" fill="#fff"/><circle cx="104" cy="22" r="1.5" fill="#fff"/><circle cx="56" cy="12" r="1.2" fill="#fff"/>')]
];
const vakitler=()=>{const s=Sayfa.ac('Beş vakit namaz');s.govde.innerHTML='<p class="note" style="margin:0 0 6px">Bir günde beş vakit namaz kılarız. Haydi tanıyalım!</p>'+VAKIT.map((v,i)=>`<div class="cc-vakit">${v[3]}<div><b>${i+1}. ${v[0]} namazı</b><span class="cc-r">${v[1]}</span><p>${esc(v[2])}</p></div></div>`).join('')};
/* ---- Ezber köşesi ---- */
const EZBER=[[1,'Fâtiha','Namazda her rekâtta okuruz.'],[112,'İhlâs','Allah\'ın bir olduğunu anlatır.'],[113,'Felak','Kötülüklerden Allah\'a sığınırız.'],[114,'Nâs','İnsanlara vesvese verenlerden Allah\'a sığınırız.'],[110,'Nasr','Allah\'ın yardımı ve zafer müjdesi.'],[108,'Kevser','Allah\'ın Peygamberimize verdiği nimet.'],[105,'Fîl','Fil sahiplerinin hikâyesi.'],[106,'Kureyş','Allah\'a şükür ve ibadet.'],[103,'Asr','Zamana yemin eder; iman, iyilik ve sabır.']];
const ezber=()=>{const s=Sayfa.ac('Ezber köşesi');s.govde.innerHTML='<p class="note" style="margin:0 0 6px">Dinle, tekrar et, ezberle! Sûre yavaş (0,8×) okunur; hızı değiştirebilirsin. Ses için internet gerekir.</p>'+EZBER.map(e=>`<button class="sf-satir" data-n="${e[0]}"><div class="sf-no" style="font-size:18px">🎧</div><div class="sf-ad"><b>${e[1]} Sûresi</b><small>${e[2]}</small></div></button>`).join('');
  s.govde.querySelectorAll('.sf-satir').forEach(b=>b.onclick=()=>Kuran.ac(+b.dataset.n,{hiz:.8,cal:true}))};
/* ---- Allah'ın güzel isimleri ---- */
const ISIM=[['Er-Rahmân','Çok merhametli'],['Er-Rahîm','Çok şefkatli'],['El-Kerîm','Çok cömert'],['Es-Selâm','Esenlik veren'],['El-Vedûd','Kullarını çok seven'],['Er-Rezzâk','Rızık veren'],['El-Hafîz','Koruyan'],['El-Afüvv','Bağışlayan']];
const isimler=()=>{const s=Sayfa.ac('Allah\'ın güzel isimleri');s.govde.innerHTML='<p class="note" style="margin:0 0 6px">Allah\'ın çok güzel isimleri vardır. Dokun ve anlamını gör!</p><div class="cc-isim">'+ISIM.map((x,i)=>`<button data-i="${i}"><b>${x[0]}</b><span>${x[1]}</span></button>`).join('')+'</div>';
  s.govde.querySelectorAll('.cc-isim button').forEach(b=>b.onclick=()=>b.classList.toggle('ac'))};
/* ---- Mini test ---- */
const Q=[['Günde kaç vakit namaz kılarız?',['3','5','7'],1],['Namaza başlarken ne deriz?',['Allahu Ekber','Günaydın','Hoşça kal'],0],['Namazda hangi yöne dönerek dururuz?',['Kıble (Kâbe)','Gökyüzü','Kapı'],0],['Abdestte ilk önce neyi yıkarız?',['Ayaklarımızı','Ellerimizi','Saçlarımızı'],1],['Secdede alnımız nereye değer?',['Yere','Havaya','Duvara'],0],['Namazı bitirirken ne yaparız?',['Selam veririz','Zıplarız','Uyuruz'],0],['Ramazan ayında hangi ibadeti yaparız?',['Oruç tutarız','Yüzmeye gideriz','Uçak yaparız'],0],['Kur\'an-ı Kerim hangi dille indirildi?',['Arapça','Fransızca','Japonca'],0],['Peygamberimizin adı nedir?',['Hz. Muhammed (s.a.v.)','Ali Kuşçu','Mevlana'],0],['Sabah namazı kaç rekât farzdır?',['2','4','5'],0]];
const test=()=>{
  const s=Sayfa.ac('Mini test');let i=0,p=0;
  const soru=()=>{
    if(i>=Q.length){const en=Math.max(p,+ls.get('cocukPuan',0));ls.set('cocukPuan',en);
      s.govde.innerHTML=`<div class="cc-kart"><div class="cc-yildiz">${'⭐'.repeat(p)}${'☆'.repeat(Q.length-p)}</div><h3>${p}/${Q.length} doğru!</h3><p>${p>=9?'Harikasın, maşallah!':p>=6?'Çok güzel, biraz daha çalışalım!':'Güzel başladın, tekrar deneyelim!'}</p><p class="note">En iyi puanın: ${en}/${Q.length}</p></div><button class="btn gold" id="ccTekrar">Tekrar oyna</button>`;
      $('#ccTekrar').onclick=()=>{i=0;p=0;soru()};return}
    const q=Q[i];
    s.govde.innerHTML=`<div class="cc-kart"><small>Soru ${i+1}/${Q.length}</small><h3>${esc(q[0])}</h3>${q[1].map((x,j)=>`<button class="btn cc-sec" data-j="${j}">${esc(x)}</button>`).join('')}</div>`;
    s.govde.querySelectorAll('.cc-sec').forEach(b=>b.onclick=()=>{
      const ok=+b.dataset.j===q[2];if(ok)p++;
      s.govde.querySelectorAll('.cc-sec').forEach(x=>{x.disabled=true;if(+x.dataset.j===q[2])x.classList.add('dogru')});
      if(!ok)b.classList.add('yanlis');
      setTimeout(()=>{i++;soru()},ok?700:1400);
    });
  };
  soru();
};
function ac(){
  const s=Sayfa.ac('Çocuklar');
  const K=[['🕌','Namaz nasıl kılınır?','Resimlerle adım adım','#3E8577',namaz],['💧','Abdest alalım','Dokuz kolay adım','#3a78c2',abdest],['🌅','Beş vakit namaz','Sabahtan yatsıya','#d98a3a',vakitler],['🎧','Ezber köşesi','Kısa sûreleri dinle','#8a5bb5',ezber],['✨','Allah\'ın güzel isimleri','Anlamlarını öğren','#c25a7a',isimler],['⭐','Mini test','Bil bakalım, kaç yıldız?','#c9a45c',test]];
  s.govde.innerHTML=`<p class="note" style="margin:0 0 4px">Merhaba küçük dostum! Birlikte öğrenelim.</p><div class="cc-izgara">${K.map((k,i)=>`<button data-i="${i}" style="--c:${k[3]}"><span>${k[0]}</span><b>${k[1]}</b><small>${k[2]}</small></button>`).join('')}</div>${ls.get('cocukPuan',0)?`<p class="note" style="text-align:center">Testteki en iyi puanın: ${ls.get('cocukPuan',0)}/${Q.length} ⭐</p>`:''}`;
  s.govde.querySelectorAll('.cc-izgara button').forEach(b=>b.onclick=()=>K[+b.dataset.i][4]());
}
window.Cocuk={ac};
})();
