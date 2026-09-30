/* İbadet: başlıca ibadetlerle ilgili ilmihal bilgileri (Diyanet'in yaygın görüşü, Hanefî mezhebi esas alınarak özetlenmiştir) */
(function(){
const T=(r)=>`<table class="ib-tab">${r.map((x,i)=>'<tr>'+x.map(c=>i?`<td>${c}</td>`:`<th>${c}</th>`).join('')+'</tr>').join('')}</table>`;
const L=a=>'<ul>'+a.map(x=>`<li>${x}</li>`).join('')+'</ul>';
const N=a=>'<ol>'+a.map(x=>`<li>${x}</li>`).join('')+'</ol>';
const K=[
{ad:'Namaz',s:'🕌',ozet:'Vakitler, rekâtlar, şartlar, kılınışı',b:[
 ['Namaz ve vakitleri',`<p>Namaz, Allah'a kulluğun en önemli ifadesidir. Akıllı ve ergenlik çağına gelmiş her Müslümana günde beş vakit farzdır.</p>${L([
  '<b>Sabah:</b> fecr (tan yeri ağarması) ile güneşin doğuşu arası.',
  '<b>Öğle:</b> güneş tepe noktasını geçtikten sonra ikindiye kadar.',
  '<b>İkindi:</b> öğle vaktinin çıkışından güneşin batışına kadar.',
  '<b>Akşam:</b> güneşin batışından kırmızı şafağın kaybolmasına kadar.',
  '<b>Yatsı:</b> şafağın kaybolmasından imsaka kadar.'])}<p>Güneşin doğması, tam tepede olması ve batmaya yakın kızarması vakitlerinde nafile namaz kılınmaz.</p>`],
 ['Kaç rekât kılınır?',`${T([['Vakit','Sünnet','Farz','Sonrası'],['Sabah','2','2','—'],['Öğle','4','4','2 sünnet'],['İkindi','4','4','—'],['Akşam','—','3','2 sünnet'],['Yatsı','4','4','2 sünnet + 3 vitir']])}<p class="note">Sabahın 2, öğlenin ilk 4 ve son 2, akşamın 2 ve yatsının son 2 rekât sünneti müekked (kuvvetli) sünnettir. İkindinin ve yatsının ilk 4 rekât sünneti gayrimüekkeddir. Cuma günü öğle yerine 2 rekât farz Cuma namazı kılınır; öncesinde 4, sonrasında 4 rekât sünnet vardır.</p>`],
 ['Namazın şartları',`<p>Namaza başlamadan önce yerine getirilmesi gereken altı şart vardır:</p>${N(['Hadesten taharet: abdestli olmak (gerekiyorsa boy abdesti almış olmak).','Necasetten taharet: beden, elbise ve namaz kılınan yerin temiz olması.','Setr-i avret: avret yerlerinin örtülmesi.','İstikbâl-i kıble: Kâbe\'ye yönelmek.','Vakit: namazın vakti girmiş olmak.','Niyet: hangi namazı kılacağını kalben bilmek.'])}`],
 ['Namazın farzları',`<p>Namazın içindeki farzlar altıdır; biri eksik olursa namaz geçerli olmaz:</p>${N(['İftitah tekbiri (başlangıç tekbiri)','Kıyam (ayakta durmak)','Kıraat (Kur\'an okumak)','Rükû','Sücûd (secde)','Ka\'de-i ahîre (son oturuş)'])}`],
 ['Namaz nasıl kılınır? (2 rekât örneği)',`${N([
  'Kıbleye dönülür, niyet edilir ve "Allahu Ekber" diyerek eller kulak hizasına kaldırılır (kadınlarda omuz hizası).',
  'Eller bağlanır (erkekte göbek altı, kadında göğüs üstü). Sübhâneke, Euzü-Besmele, Fâtiha ve bir sûre veya birkaç ayet okunur.',
  '"Allahu Ekber" diyerek rükûya eğilinir, üç kez "Sübhâne rabbiyel azîm" denir.',
  '"Semiallahü limen hamideh" diyerek doğrulunur; "Rabbenâ lekel hamd" denir.',
  '"Allahu Ekber" diyerek secdeye gidilir, üç kez "Sübhâne rabbiyel a\'lâ" denir. Kısa bir oturuştan sonra ikinci secde yapılır.',
  'Kalkılarak ikinci rekât aynı şekilde kılınır (Sübhâneke ve Euzü okunmaz; Besmele-Fâtiha-sûre ile başlanır).',
  'Son oturuşta Ettehiyyâtü, Allâhümme salli, Allâhümme bârik ve Rabbenâ âtinâ okunur.',
  'Önce sağa, sonra sola "Esselâmü aleyküm ve rahmetullah" diyerek selam verilir.'])}<p class="note">Namaz dualarının Arapça okunuşunu bir hocadan veya Diyanet'in ilmihalinden öğrenmeniz tavsiye edilir.</p>`],
 ['Namazı bozan şeyler',L(['Abdesti veya gusül abdestini bozan bir durumun olması.','Konuşmak, selam almak-vermek.','Yemek ve içmek.','Kıbleden (göğsüyle) dönmek.','Kahkaha ile gülmek.','Namazın şartlarından birinin kaybolması, avret yerinin açılması.','Kur\'an okurken anlamı bozacak ölçüde yanlış okumak.','Namazla ilgisi olmayan ve dışarıdan bakana namazda değilmiş gibi gösteren çok hareket (amel-i kesîr).'])],
 ['Cemaat, Cuma ve yolculuk',`<p>Peygamberimiz (s.a.v.): <i>"Cemaatle kılınan namaz, tek başına kılınan namazdan yirmi yedi derece üstündür."</i> (Buhârî, Müslim)</p><p>Cuma namazı; akıllı, ergen, hür, yerleşik ve sağlıklı erkeklere farzdır. Yaklaşık 90 km ve üzeri yolculukta (sefer) dört rekâtlı farzlar iki rekât kılınır.</p>`]]},
{ad:'Abdest',s:'💧',ozet:'Farzları, sünnetleri, bozanlar',b:[
 ['Abdestin farzları',`<p>Mâide Sûresi 6. ayete göre abdestin farzları dörttür:</p>${N(['Yüzü yıkamak','Kolları dirseklerle birlikte yıkamak','Başın dörtte birini meshetmek','Ayakları topuklarla birlikte yıkamak'])}`],
 ['Abdest nasıl alınır?',N(['Niyet edilir, "Bismillâhirrahmânirrahîm" denir.','Eller bileklere kadar üç kez yıkanır.','Sağ avuçla üç kez ağza su verilip çalkalanır (mazeret yoksa gargara yapılır).','Üç kez burna su çekilip temizlenir.','Yüz, saç bitiminden çene altına, kulak yumuşaklarına kadar üç kez yıkanır.','Önce sağ, sonra sol kol dirsekle birlikte üç kez yıkanır.','Islak elle başın tamamı meshedilir, kulaklar ve boyun meshedilir.','Önce sağ, sonra sol ayak topuklarla birlikte üç kez yıkanır.'])],
 ['Abdesti bozanlar',L(['Ön ve arka yoldan bir şey çıkması (idrar, büyük abdest, gaz vb.).','Vücudun bir yerinden kan, irin gibi şeylerin akıp yıkanması gereken yere ulaşması.','Ağız dolusu kusmak.','Uyumak (yan yatarak veya yaslanarak), bayılmak, aklın gitmesi.','Namaz kılarken kahkaha ile gülmek.'])]]},
{ad:'Gusül ve Teyemmüm',s:'🚿',ozet:'Boy abdesti ve toprakla temizlik',b:[
 ['Gusül (boy abdesti)',`<p>Gusül abdestinin farzları üçtür:</p>${N(['Ağıza su vermek','Burna su vermek','Bütün vücudu yıkamak (kuru yer bırakmamak)'])}<p>Cünüplük, hayız (adet) ve nifas (lohusalık) hallerinde gusül gerekir. Cuma ve bayram günleri gusül yapmak sünnettir.</p>`],
 ['Teyemmüm',`<p>Su bulunamadığında veya hastalık gibi bir sebeple suyu kullanmak zarar vereceğinde abdest ve guslün yerine temiz toprakla teyemmüm yapılır.</p>${N(['Niyet edilir, besmele çekilir.','Eller temiz toprağa (veya toprak cinsinden bir şeye) vurulur, yüz meshedilir.','Eller tekrar toprağa vurulur, kollar dirseklerle birlikte meshedilir.'])}<p class="note">Su bulununca teyemmüm bozulur.</p>`]]},
{ad:'Oruç',s:'🌙',ozet:'Ramazan orucu, bozanlar, kaza ve fidye',b:[
 ['Oruç nedir?',`<p>Oruç, tan yerinin ağarmasından (imsak) güneşin batışına (akşam ezanı) kadar, niyetle yemekten, içmekten ve cinsel ilişkiden uzak durmaktır. Ramazan ayında oruç tutmak, aklı başında, ergen, yerleşik ve sağlıklı her Müslümana farzdır (Bakara, 183-185). Kadınlar hayız ve nifas hallerinde tutmaz, sonradan kaza eder.</p>`],
 ['Orucu bozanlar ve bozmayanlar',`<p><b>Bozar:</b></p>${L(['Kasten yemek, içmek, sigara içmek.','Cinsel ilişki.','İlaç veya besin olarak mideye bir şey ulaştırmak.','Ağız dolusu kusmayı kasten yapmak.'])}<p><b>Bozmaz:</b></p>${L(['Unutarak yiyip içmek.','Kendiliğinden kusmak.','Uykuda ihtilam olmak.','Dişleri fırçalamak (yutmamak şartıyla), misvak kullanmak.','Kendiliğinden boğaza giren toz, duman, sinek gibi şeyler.'])}`],
 ['Kaza, kefaret ve fidye',L(['<b>Kaza:</b> Mazeretle tutulamayan veya bozulan orucun, Ramazan'+"'"+'dan sonra gün sayısınca tutulmasıdır.','<b>Kefaret:</b> Ramazan orucunu mazeretsiz ve kasten yiyip-içme veya ilişkiyle bozan kişi, o günün kazasına ek olarak ardı ardına 60 gün oruç tutar (gücü yoksa 60 fakiri doyurur).','<b>Fidye:</b> Yaşlılık veya iyileşmesi beklenmeyen bir hastalık sebebiyle oruç tutamayanlar, tutamadıkları her gün için bir fakiri doyuracak kadar fidye verir. Güncel miktarı Diyanet her yıl duyurur.'])],
 ['Sahur, iftar ve nafile oruçlar',`<p>Peygamberimiz (s.a.v.): <i>"Sahur yapın; çünkü sahurda bereket vardır."</i> (Buhârî, Müslim) İftar, vakit girer girmez acele edilerek yapılır.</p>${L(['Pazartesi ve perşembe günleri','Aşure günü (Muharrem ayının 10. günü; 9. veya 11. ile birlikte)','Şevval ayında 6 gün','Her ayın 13, 14 ve 15. günleri (eyyâm-ı bîd)'])}<p class="note">Ramazan ve Kurban bayramlarının ilk günleri oruç tutmak haramdır.</p>`]]},
{ad:'Zekât',s:'🤲',ozet:'Nisap, oran, verilecek yerler, fıtır sadakası',b:[
 ['Zekât kimlere farzdır?',`<p>Zekât, malî bir ibadettir. Şu şartları taşıyan kişiye farzdır:</p>${N(['Müslüman, akıllı ve ergen olmak.','Temel ihtiyaçları ve borçları dışında nisap miktarı mala sahip olmak.','Bu mal üzerinden bir kamerî yıl geçmiş olmak.'])}`],
 ['Nisap ve oran',`<p>Nisap miktarı 80,18 gram altın veya 561 gram gümüş değerindedir. Zekât oranı kırkta bir, yani <b>%2,5</b>'tir. Altın, gümüş, para, ticaret malları ve belirli miktardaki hayvanlar zekâta tabidir. Zirai ürünlerde ise hasat zamanı öşür (yağmurla sulananda onda bir, emekle sulananda yirmide bir) verilir.</p><p class="note">Gram altın ve gümüş değerleri günlük değiştiği için nisap karşılığını güncel kurla hesaplayın.</p>`],
 ['Zekât kimlere verilir?',`<p>Tevbe Sûresi 60. ayete göre zekât sekiz sınıfa verilir:</p>${N(['Fakirler','Miskinler (yoksullar)','Zekât toplayan görevliler','Kalpleri İslam\'a ısındırılacak olanlar','Köleler (özgürlüğüne kavuşturulacaklar)','Borçlular','Allah yolunda olanlar (ilim, hizmet vb.)','Yolda kalmışlar'])}<p><b>Verilemeyecekler:</b> kişinin anne-babası ve dede-ninesi, çocukları ve torunları, eşi; nisap sahibi zenginler; Müslüman olmayanlar.</p>`],
 ['Fıtır sadakası',`<p>Temel ihtiyaçlarından fazla nisap miktarı mala sahip olan kişi, kendisi ve bakmakla yükümlü olduğu kişiler adına fıtır sadakası verir. Tercihen Ramazan Bayramı namazından önce verilir. Miktarı her yıl Diyanet İşleri Başkanlığı tarafından duyurulur.</p>`]]},
{ad:'Hac ve Umre',s:'🕋',ozet:'Şartlar, farzlar, vacipler, umre',b:[
 ['Hac kimlere farzdır?',`<p>Hac, gücü yetenlere ömürde bir defa farzdır (Âl-i İmrân, 97). Şartları:</p>${N(['Müslüman, akıllı ve ergen olmak.','Sağlık ve beden gücüne sahip olmak.','Gidiş-dönüş masrafını ve geride bakmakla yükümlü olduklarının nafakasını karşılayacak malî güce sahip olmak.','Yolun güvenli olması.','Kadınlar için yanında eşi veya mahremi ya da güvenilir bir hac grubu bulunması.'])}`],
 ['Haccın farzları ve vacipleri',`<p><b>Farzlar:</b> İhrama girmek, Arafat\'ta vakfe (Zilhicce\'nin 9. günü), ziyaret tavafı.</p><p><b>Vacipler:</b> Müzdelife\'de vakfe, Safa ile Merve arasında sa\'y (7 tur), Cemrelere (şeytan taşlama) taş atmak, tıraş olmak veya saçı kısaltmak, veda tavafı, temettü ve kıran hacılarda şükür kurbanı kesmek.</p><p>Hac günleri Zilhicce ayının 8-13. günleridir.</p>`],
 ['İhramın yasakları',L(['Cinsel ilişki ve buna götüren davranışlar.','Koku sürmek.','Saç, sakal ve tırnak kesmek.','Kara avı yapmak, bitki koparmak.','Erkeklerin dikişli elbise giymesi ve başını örtmesi; kadınların yüzünü örtmesi.','Kavga etmek, kötü söz söylemek.'])],
 ['Umre',`<p>Umre, yılın her günü yapılabilen, hac gibi Kâbe ve Mekke ile ilgili bir ibadettir ve sünnettir. Yapılışı: mikat yerinde ihrama girilir, Kâbe'yi yedi tur tavaf edilir, Safa ile Merve arasında sa'y yapılır ve tıraş olunur veya saç kısaltılır.</p>`]]},
{ad:'Kurban',s:'🐑',ozet:'Kime vacip, hangi hayvan, nasıl kesilir',b:[
 ['Kurban kimlere vaciptir?',`<p>Bayram günlerinde yerleşik (mukim) ve nisap miktarı mala sahip olan Müslümana kurban kesmek vaciptir. Kurban, Allah'a yakınlaşma niyetiyle ve O'nun adı anılarak kesilen hayvandır.</p>`],
 ['Zamanı ve hayvanlar',`<p>Kurban Bayramı'nın 1, 2 ve 3. günlerinde (Zilhicce 10-12) kesilir. Bayram namazından önce kesilmez.</p>${T([['Hayvan','En az yaş','Ortaklık'],['Koyun, keçi','1 yaş (koyun 6 ay ise 1 yaşlık görünümde)','1 kişi'],['Sığır, manda','2 yaş','7 kişiye kadar'],['Deve','5 yaş','7 kişiye kadar']])}<p class="note">Gözü, bacağı, kulağı gibi yerleri belirgin kusurlu, zayıf ve hasta hayvan kurban edilmez.</p>`],
 ['Nasıl kesilir ve paylaştırılır?',`<p>Hayvana eziyet edilmeden, bıçak hayvanın yanında bilenmeden, "Bismillâhi Allahu Ekber" denilerek kesilir. Etin üçe bölünmesi (bir kısmı aile, bir kısmı akraba-komşu, bir kısmı yoksullar) müstehaptır. Kesim yapanın ücreti kurbanın etinden verilmez.</p>`]]}
];
const UYARI='<p class="note" style="margin-top:14px">Bilgiler Diyanet İşleri Başkanlığı\'nın yaygın görüşüne göre (Hanefî mezhebi) özetlenmiştir. Özel durumlar için müftülüğe veya Diyanet Alo 190 Dinî Bilgi Hattı\'na danışınız.</p>';
function ac(){
  const s=Sayfa.ac('İbadet');
  s.govde.innerHTML=K.map((k,i)=>`<button class="sf-satir" data-i="${i}"><div class="sf-no" style="font-size:19px">${k.s}</div><div class="sf-ad"><b>${k.ad}</b><small>${k.ozet}</small></div></button>`).join('')+UYARI;
  s.govde.querySelectorAll('.sf-satir').forEach(b=>b.onclick=()=>konu(+b.dataset.i));
}
function konu(i){
  const k=K[i],s=Sayfa.ac(k.ad);
  s.govde.innerHTML=k.b.map((x,j)=>`<details class="ib-d"${j===0?' open':''}><summary>${x[0]}</summary><div class="ib-i">${x[1]}</div></details>`).join('')+UYARI;
}
window.Ibadet={ac};
})();
