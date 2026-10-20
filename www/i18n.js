/* Dil desteği: Türkçe (asıl), English, العربية, Deutsch.
   Arayüz yazıları ekranda bulunduğu anda sözlükten çevrilir (yeni açılan sayfalar dahil, MutationObserver ile).
   Uzun içerik (ayet, hadis, ilmihal, cuma, ibadet, dualar, esma, çocuk bölümü) ve ek arayüz sözlüğü dil/<dil>.js
   dosyasındadır (ceviri/olustur.js üretir); yalnızca seçili dil yüklenir ve modüller window.DV'den okur. */
(function(){
const DILLER={tr:'Türkçe',en:'English',ar:'العربية',de:'Deutsch'};
let dil;try{dil=JSON.parse(localStorage.getItem('dil'))}catch(e){}
if(!DILLER[dil]){const n=(navigator.language||'tr').slice(0,2).toLowerCase();dil=DILLER[n]?n:'tr'} // ilk açılışta telefonun dili (desteklenmiyorsa Türkçe)
window.DIL=dil;window.DILLER=DILLER;
const LOC={tr:'tr-TR',en:'en-GB',ar:'ar',de:'de-DE'}[dil];
document.documentElement.lang=dil;
if(dil!=='tr')document.write('<script src="dil/'+dil+'.js"><\/script>');
// Tarihler seçilen dilde yazılsın (kodda 'tr-TR' verilen yerler dahil)
if(dil!=='tr'){const o=Date.prototype.toLocaleDateString;Date.prototype.toLocaleDateString=function(l,p){return o.call(this,l==='tr-TR'?LOC:l,p)};
  const t=Date.prototype.toLocaleTimeString;Date.prototype.toLocaleTimeString=function(l,p){return t.call(this,l==='tr-TR'?LOC:l,p)}}
// [Türkçe, English, العربية, Deutsch]
const S=`Vakit|Times|المواقيت|Zeiten
Kıble|Qibla|القبلة|Qibla
Tesbih|Tasbih|التسبيح|Tasbih
Dini Günler|Holy Days|المناسبات|Feiertage
Kabir|Graves|القبور|Gräber
Ayet|Verse|آية|Vers
Hadis|Hadith|حديث|Hadith
İlmihal|Fiqh Q&A|فقه|Fiqh
Cuma|Friday|الجمعة|Freitag
Kur'an-ı Kerim|Holy Quran|القرآن الكريم|Heiliger Koran
Camiler|Mosques|المساجد|Moscheen
İbadet|Worship|العبادات|Gottesdienst
Çocuklar|Children|الأطفال|Kinder
İmsak|Fajr|الفجر|Fadschr
Güneş|Sunrise|الشروق|Sonnenaufgang
Öğle|Dhuhr|الظهر|Dhuhr
İkindi|Asr|العصر|Asr
Akşam|Maghrib|المغرب|Maghrib
Yatsı|Isha|العشاء|Ischa
vaktine kalan süre|time remaining|الوقت المتبقي|verbleibende Zeit
güneş doğmasına kalan süre|time until sunrise|الوقت المتبقي حتى الشروق|Zeit bis Sonnenaufgang
↻ Bir tane daha|↻ Another one|↻ واحدة أخرى|↻ Noch eine
↩ Günün ayeti|↩ Verse of the day|↩ آية اليوم|↩ Vers des Tages
↩ Günün hadisi|↩ Hadith of the day|↩ حديث اليوم|↩ Hadith des Tages
Günün sorusu|Question of the day|سؤال اليوم|Frage des Tages
Hayırlı Cumalar|Blessed Friday|جمعة مباركة|Gesegneter Freitag
Bu haftanın mesajı|This week's message|رسالة هذا الأسبوع|Nachricht der Woche
Bugün Cuma|Today is Friday|اليوم الجمعة|Heute ist Freitag
➦ Paylaş|➦ Share|➦ مشاركة|➦ Teilen
Paylaş|Share|مشاركة|Teilen
✓ Kıldım|✓ Prayed|✓ صلّيت|✓ Gebetet
Konum|Location|الموقع|Standort
Konum seç|Choose location|اختر الموقع|Ort wählen
Konumum|My location|موقعي|Mein Standort
Konum alınıyor…|Getting location…|جارٍ تحديد الموقع…|Standort wird ermittelt…
Ayarlar|Settings|الإعدادات|Einstellungen
Değiştir ›|Change ›|تغيير ›|Ändern ›
Uygulama bildirimleri|App notifications|إشعارات التطبيق|App-Benachrichtigungen
Vakit bildirimi (vakit sesi)|Prayer time alert (sound)|تنبيه وقت الصلاة (صوت)|Gebetszeit-Hinweis (Ton)
Bildirim sesini dinle|Play notification sound|استمع إلى صوت التنبيه|Benachrichtigungston anhören
Uygulamayı paylaş|Share the app|شارك التطبيق|App teilen
Hakkında ve kaynaklar|About & sources|حول التطبيق والمصادر|Über & Quellen
Cuma günü kabir hatırlatması|Friday grave reminder|تذكير يوم الجمعة|Freitags-Erinnerung
Vefat yıldönümü ve önemli geceler|Death anniversaries & holy nights|ذكرى الوفاة والليالي المباركة|Todestage & heilige Nächte
Dil / Language|Language|اللغة|Sprache
Vakitleri göster|Show times|عرض المواقيت|Zeiten anzeigen
Konumumu kullan|Use my location|استخدم موقعي|Meinen Standort verwenden
İl|Province|المحافظة|Provinz
İlçe|District|المنطقة|Bezirk
Merkez|Centre|المركز|Zentrum
Vakitler alınamadı. İnternet bağlantısını kontrol et.|Could not get prayer times. Check your internet connection.|تعذّر جلب المواقيت. تحقق من الاتصال بالإنترنت.|Gebetszeiten konnten nicht geladen werden. Internetverbindung prüfen.
Konum alınamadı. İzin ver veya il/ilçe seç.|Location unavailable. Allow access or choose a place.|تعذّر تحديد الموقع. اسمح بالوصول أو اختر مكانًا.|Standort nicht verfügbar. Zugriff erlauben oder Ort wählen.
Çıkmak için geri tuşuna tekrar basın|Press back again to exit|اضغط رجوع مرة أخرى للخروج|Zum Beenden erneut Zurück drücken
Reklam alanı (banner)|Ad space (banner)|مساحة إعلان|Werbefläche
Sübhanallah|Subhanallah|سبحان الله|Subhanallah
Elhamdülillah|Alhamdulillah|الحمد لله|Alhamdulillah
Allahu ekber|Allahu akbar|الله أكبر|Allahu akbar
Serbest|Free|حر|Frei
Sıfırla|Reset|إعادة|Zurücksetzen
Ses (hayy)|Sound (hayy)|الصوت (حيّ)|Ton (hayy)
Titreşim|Vibration|اهتزاز|Vibration
Say|Count|عدّ|Zählen
Dini gün ve geceler|Holy days & nights|الأيام والليالي المباركة|Heilige Tage & Nächte
Geçti|Passed|مضى|Vorbei
Şimdi|Now|الآن|Jetzt
Yarın|Tomorrow|غدًا|Morgen
Miraç Kandili|Isra & Mi'raj Night|ليلة الإسراء والمعراج|Nacht der Himmelfahrt
Berat Kandili|Night of Bara'ah|ليلة البراءة|Nacht der Vergebung
Regaib Kandili|Raghaib Night|ليلة الرغائب|Raghaib-Nacht
Mevlid Kandili|Mawlid Night|ليلة المولد النبوي|Mawlid-Nacht
Kadir Gecesi|Laylat al-Qadr|ليلة القدر|Nacht der Bestimmung
Ramazan başlangıcı|Start of Ramadan|بداية رمضان|Ramadanbeginn
Ramazan Bayramı arefesi|Eve of Eid al-Fitr|وقفة عيد الفطر|Vorabend Ramadanfest
Ramazan Bayramı|Eid al-Fitr|عيد الفطر|Ramadanfest
Kurban Bayramı arefesi|Day of Arafah|يوم عرفة|Tag von Arafat
Kurban Bayramı|Eid al-Adha|عيد الأضحى|Opferfest
Hicri yılbaşı|Islamic New Year|رأس السنة الهجرية|Islamisches Neujahr
Aşure günü|Day of Ashura|يوم عاشوراء|Aschura-Tag
Üç ayların başlangıcı|Start of the three holy months|بداية الأشهر الثلاثة|Beginn der drei heiligen Monate
Şaban ayının başlangıcı|Start of Sha'ban|بداية شعبان|Beginn des Scha'ban
Kabirlerim|My graves|قبوري|Meine Gräber
＋ Kabir ekle (fotoğraf)|＋ Add grave (photo)|＋ إضافة قبر (صورة)|＋ Grab hinzufügen (Foto)
Henüz kabir eklenmedi.|No graves added yet.|لم تتم إضافة قبور بعد.|Noch keine Gräber hinzugefügt.
Fâtiha ve Yâsîn oku|Read Fatiha & Yasin|اقرأ الفاتحة ويس|Fatiha & Yasin lesen
✕ Kapat|✕ Close|✕ إغلاق|✕ Schließen
Kapat|Close|إغلاق|Schließen
▶ Dinle|▶ Listen|▶ استمع|▶ Anhören
⏸ Durdur|⏸ Stop|⏸ إيقاف|⏸ Stopp
▶ Devam|▶ Continue|▶ متابعة|▶ Weiter
Okudum, Allah kabul etsin|I've read it, may Allah accept|قرأت، تقبّل الله|Gelesen, möge Allah annehmen
Niyet|Intention|النية|Absicht
Dua|Prayer|الدعاء|Bittgebet
‹ Geri|‹ Back|‹ رجوع|‹ Zurück
Sûre ara (ad veya numara)|Search surah (name or number)|ابحث عن سورة (اسم أو رقم)|Sure suchen (Name oder Nummer)
Kaldığın yerden devam et|Continue where you left off|تابع من حيث توقفت|Dort weitermachen, wo du warst
Liste Görünümü|List view|عرض القائمة|Listenansicht
Harita Görünümü|Map view|عرض الخريطة|Kartenansicht
Camileri yakından uzağa listele|List mosques from nearest|اعرض المساجد من الأقرب|Moscheen nach Entfernung
Yakınımdaki camileri harita üzerinde göster|Show nearby mosques on a map|اعرض المساجد القريبة على الخريطة|Moscheen in der Nähe auf Karte
Görüntüle →|View →|عرض →|Ansehen →
Yakın Camiler|Nearby mosques|المساجد القريبة|Moscheen in der Nähe
Harita|Map|الخريطة|Karte
Namaz takibi ve kaza|Prayer tracker|متابعة الصلوات|Gebetsprotokoll
Bugün|Today|اليوم|Heute
Kaza borcum|Missed prayers to make up|صلوات القضاء|Nachzuholende Gebete
Sabah namazı|Fajr prayer|صلاة الفجر|Fadschr-Gebet
Öğle namazı|Dhuhr prayer|صلاة الظهر|Dhuhr-Gebet
İkindi namazı|Asr prayer|صلاة العصر|Asr-Gebet
Akşam namazı|Maghrib prayer|صلاة المغرب|Maghrib-Gebet
Yatsı namazı|Isha prayer|صلاة العشاء|Ischa-Gebet
Sabah|Fajr|الفجر|Fadschr
Vitir|Witr|الوتر|Witr
Namaz|Prayer|الصلاة|Gebet
Abdest|Ablution|الوضوء|Waschung
Gusül ve Teyemmüm|Ghusl & Tayammum|الغسل والتيمم|Ghusl & Tayammum
Oruç|Fasting|الصيام|Fasten
Zekât|Zakat|الزكاة|Zakat
Hac ve Umre|Hajj & Umrah|الحج والعمرة|Hadsch & Umra
Kurban|Sacrifice|الأضحية|Opfer
Zekât hesapla|Calculate zakat|احسب الزكاة|Zakat berechnen
Namaz nasıl kılınır?|How to pray|كيف نصلي؟|Wie betet man?
Resimlerle adım adım|Step by step with pictures|خطوة بخطوة بالصور|Schritt für Schritt
Abdest alalım|Let's do wudu|لنتوضأ|Lass uns Wudu machen
Dokuz kolay adım|Nine easy steps|تسع خطوات سهلة|Neun einfache Schritte
Beş vakit namaz|Five daily prayers|الصلوات الخمس|Fünf tägliche Gebete
Sabahtan yatsıya|From Fajr to Isha|من الفجر إلى العشاء|Von Fadschr bis Ischa
Ezber köşesi|Memorization corner|ركن الحفظ|Auswendiglernen
Sûreler ve dualar|Surahs & prayers|السور والأدعية|Suren & Gebete
📖 Sûreler|📖 Surahs|📖 السور|📖 Suren
🤲 Dualar|🤲 Prayers|🤲 الأدعية|🤲 Gebete
Allah'ın güzel isimleri|Beautiful names of Allah|أسماء الله الحسنى|Die schönen Namen Allahs
99 isim ve anlamları|99 names and meanings|٩٩ اسمًا ومعانيها|99 Namen und Bedeutungen
Mini test|Mini quiz|اختبار صغير|Mini-Quiz
Merhaba küçük dostum! Birlikte öğrenelim.|Hello little friend! Let's learn together.|مرحبًا يا صديقي الصغير! لنتعلم معًا.|Hallo kleiner Freund! Lass uns zusammen lernen.
Yeni sorularla oyna|Play with new questions|العب بأسئلة جديدة|Mit neuen Fragen spielen
İleri ›|Next ›|التالي ›|Weiter ›
‹ Geri|‹ Back|‹ رجوع|‹ Zurück
Baştan başla|Start over|ابدأ من جديد|Von vorn
Bu adımda okunanlar|Recited in this step|ما يُقرأ في هذه الخطوة|In diesem Schritt rezitiert
Gizlilik politikası|Privacy policy|سياسة الخصوصية|Datenschutz
Reklam gizlilik seçenekleri|Ad privacy options|خيارات خصوصية الإعلانات|Werbe-Datenschutz
Kur'an-ı Kerim metni|Quran text|نص القرآن الكريم|Korantext
Kur'an sesi|Quran audio|تلاوة القرآن|Koran-Audio
Namaz vakitleri|Prayer times|مواقيت الصلاة|Gebetszeiten
Cami ve harita verisi|Mosque & map data|بيانات المساجد والخرائط|Moschee- & Kartendaten
Yazı tanıma|Text recognition|التعرف على النص|Texterkennung
Yazı tipleri|Fonts|الخطوط|Schriftarten
Altyapı|Platform|البنية|Plattform
Hesaplamada nelere dikkat edildi?|How is it calculated?|كيف يتم الحساب؟|Wie wird gerechnet?
Vermeniz gereken zekât|Zakat you should pay|الزكاة الواجبة عليك|Zu zahlende Zakat
Zekât gerekmiyor|No zakat due|لا تجب الزكاة|Keine Zakat fällig
Daha sonra|Later|لاحقًا|Später
⭐ Puan ver|⭐ Rate the app|⭐ قيّم التطبيق|⭐ App bewerten`.split('\n').map(x=>x.split('|'));
const IX={en:1,ar:2,de:3}[dil];
const SOZ=new Map();if(IX)S.forEach(r=>{if(r[IX])SOZ.set(r[0],r[IX])});
let ekli=false;const ekle=()=>{if(ekli||!window.DV)return;ekli=true;(DV.S||[]).forEach(([t,x])=>SOZ.set(t,x))};
const [R_REKAT,R_SORU,R_ISIM,R_BASLIK]={en:['rak\'ahs','questions','names','topics'],ar:['ركعات','أسئلة','اسمًا','موضوعات'],de:['Rakat','Fragen','Namen','Themen']}[dil]||[];
const ADLAR={İmsak:1,Güneş:1,Öğle:1,İkindi:1,Akşam:1,Yatsı:1,Sabah:1};
const ad=x=>SOZ.get(x)||x;
const AY={en:['Muharram','Safar','Rabi I','Rabi II','Jumada I','Jumada II','Rajab','Sha\'ban','Ramadan','Shawwal','Dhu al-Qadah','Dhu al-Hijjah'],ar:['محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'],de:['Muharram','Safar','Rabi I','Rabi II','Dschumada I','Dschumada II','Radschab','Scha\'ban','Ramadan','Schawwal','Dhu l-Qa\'da','Dhu l-Hiddscha']}[dil];
const TRAY=['Muharrem','Safer','Rebiülevvel','Rebiülahir','Cemaziyelevvel','Cemaziyelahir','Recep','Şaban','Ramazan','Şevval','Zilkade','Zilhicce'];
const K={ // kalıplar
 en:[[/^(.+) vaktine kalan süre$/,m=>`time until ${ad(m[1])}`],[/^(.+) vaktine$/,m=>`until ${ad(m[1])}`],[/^Güneşin doğmasına$/,()=>'until sunrise'],[/^(\d+) gün$/,m=>`${m[1]} days`],[/^Konum: (.+)$/,m=>`Location: ${m[1]}`],
   [/^Bugün (\d)\/5 namaz( · Allah kabul etsin)?$/,m=>`Today ${m[1]}/5 prayers${m[2]?' · may Allah accept':''}`],[/^(.+) vakti – kıldın mı\? \((\d)\/5\)$/,m=>`${ad(m[1])} time – prayed? (${m[2]}/5)`],[/^(.+) vakti$/,m=>`${ad(m[1])} time`],[/^(.+) için (.+) vakti girdi$/,m=>`It is now ${ad(m[2])} time in ${m[1]}`],[/^Kıble (\d+)° · Yönün (\d+)°(.*)$/,m=>`Qibla ${m[1]}° · Heading ${m[2]}°`],[/^Kıbleye dönüksün(.*)$/,()=>'You are facing the Qibla']],
 ar:[[/^(.+) vaktine kalan süre$/,m=>`الوقت المتبقي حتى ${ad(m[1])}`],[/^(.+) vaktine$/,m=>`حتى ${ad(m[1])}`],[/^Güneşin doğmasına$/,()=>'حتى الشروق'],[/^(\d+) gün$/,m=>`${m[1]} يوم`],[/^Konum: (.+)$/,m=>`الموقع: ${m[1]}`],
   [/^Bugün (\d)\/5 namaz( · Allah kabul etsin)?$/,m=>`اليوم ${m[1]}/5 صلوات${m[2]?' · تقبّل الله':''}`],[/^(.+) vakti – kıldın mı\? \((\d)\/5\)$/,m=>`وقت ${ad(m[1])} – هل صلّيت؟ (${m[2]}/5)`],[/^(.+) vakti$/,m=>`وقت ${ad(m[1])}`],[/^(.+) için (.+) vakti girdi$/,m=>`حان وقت ${ad(m[2])} في ${m[1]}`],[/^Kıble (\d+)° · Yönün (\d+)°(.*)$/,m=>`القبلة ${m[1]}° · اتجاهك ${m[2]}°`],[/^Kıbleye dönüksün(.*)$/,()=>'أنت متجه إلى القبلة']],
 de:[[/^(.+) vaktine kalan süre$/,m=>`Zeit bis ${ad(m[1])}`],[/^(.+) vaktine$/,m=>`bis ${ad(m[1])}`],[/^Güneşin doğmasına$/,()=>'bis Sonnenaufgang'],[/^(\d+) gün$/,m=>`${m[1]} Tage`],[/^Konum: (.+)$/,m=>`Standort: ${m[1]}`],
   [/^Bugün (\d)\/5 namaz( · Allah kabul etsin)?$/,m=>`Heute ${m[1]}/5 Gebete${m[2]?' · möge Allah annehmen':''}`],[/^(.+) vakti – kıldın mı\? \((\d)\/5\)$/,m=>`${ad(m[1])}-Zeit – gebetet? (${m[2]}/5)`],[/^(.+) vakti$/,m=>`${ad(m[1])}-Zeit`],[/^(.+) için (.+) vakti girdi$/,m=>`Es ist ${ad(m[2])}-Zeit in ${m[1]}`],[/^Kıble (\d+)° · Yönün (\d+)°(.*)$/,m=>`Qibla ${m[1]}° · Richtung ${m[2]}°`],[/^Kıbleye dönüksün(.*)$/,()=>'Du schaust zur Qibla']]
}[dil]||[];
// Birleşik metinler için ek kalıplar: [düzenli ifade, {en,ar,de} şablon işlevleri]
const K2=[
 [/^(\d+)\/(\d+) doğru!$/,{en:m=>`${m[1]}/${m[2]} correct!`,ar:m=>`${m[1]}/${m[2]} إجابة صحيحة!`,de:m=>`${m[1]}/${m[2]} richtig!`}],
 [/^(?:Testteki )?[Ee]n iyi puanın: (.+)$/,{en:m=>`Your best score: ${m[1]}`,ar:m=>`أفضل نتيجة لك: ${m[1]}`,de:m=>`Deine Bestleistung: ${m[1]}`}],
 [/^Soru (\d+)\/(\d+)$/,{en:m=>`Question ${m[1]}/${m[2]}`,ar:m=>`السؤال ${m[1]}/${m[2]}`,de:m=>`Frage ${m[1]}/${m[2]}`}],
 [/^(\d+) sorudan her seferinde (\d+) soru$/,{en:m=>`${m[2]} questions each time from ${m[1]}`,ar:m=>`${m[2]} أسئلة في كل مرة من ${m[1]} سؤالًا`,de:m=>`Jedes Mal ${m[2]} Fragen aus ${m[1]}`}],
 [/^(.+) akşamı$/,{en:m=>`${m[1]}, evening`,ar:m=>`مساء ${m[1]}`,de:m=>`${m[1]}, abends`}],
 [/^(.+) · (\d+) gün$/,{en:m=>`${m[1]} · ${m[2]} days`,ar:m=>`${m[1]} · ${m[2]} أيام`,de:m=>`${m[1]} · ${m[2]} Tage`}],
 [/^(.+) · hedef (\d+)$/,{en:m=>`${ad(m[1])} · goal ${m[2]}`,ar:m=>`${ad(m[1])} · الهدف ${m[2]}`,de:m=>`${ad(m[1])} · Ziel ${m[2]}`}],
 [/^Tamamlandı: (.+)$/,{en:m=>`Completed: ${ad(m[1])}`,ar:m=>`اكتمل: ${ad(m[1])}`,de:m=>`Abgeschlossen: ${ad(m[1])}`}],
 [/^Konum güncellendi: (.*)$/,{en:m=>`Location updated: ${m[1]}`,ar:m=>`تم تحديث الموقع: ${m[1]}`,de:m=>`Standort aktualisiert: ${m[1]}`}],
 [/^Yakınınızda kayıtlı kabir var: (.+)\. Kabir sekmesinden Fâtiha okuyabilirsiniz\.$/,{en:m=>`A saved grave is nearby: ${m[1]}. You can recite Fatiha from the Graves tab.`,ar:m=>`يوجد قبر محفوظ بالقرب منك: ${m[1]}. يمكنك قراءة الفاتحة من تبويب القبور.`,de:m=>`Ein gespeichertes Grab ist in der Nähe: ${m[1]}. Du kannst im Tab „Gräber“ die Fatiha rezitieren.`}],
 [/^Kaynak: (.+)$/,{en:m=>`Source: ${m[1]}`,ar:m=>`المصدر: ${m[1]}`,de:m=>`Quelle: ${m[1]}`}],
 [/^(\d+) Cuma$/,{en:m=>`${m[1]} Fridays`,ar:m=>`${m[1]} جمعة`,de:m=>`${m[1]} Freitage`}],
].map(([re,o])=>[re,o[dil]]).filter(x=>x[1]);
function ceviri(t){
  if(!IX||t==null)return t;
  ekle();
  const s=String(t),k=s.trim();if(!k)return s;
  let r=SOZ.get(k);
  if(r==null){const m=k.match(/^(\d+)\. (.+)$/);if(m&&SOZ.has(m[2]))r=m[1]+'. '+SOZ.get(m[2])}
  if(r==null){const m=k.match(/^(\d+) (rekât|soru|isim|başlık)$/);if(m)r=m[1]+' '+({rekât:R_REKAT,soru:R_SORU,isim:R_ISIM,başlık:R_BASLIK}[m[2]])}
  if(r==null){for(const [re,f] of K){const m=k.match(re);if(m&&(!/vakti|vaktine/.test(re.source)||ADLAR[m[1]]||/için/.test(re.source))){r=f(m);break}}}
  if(r==null)for(const [re,f] of K2){const m=k.match(re);if(m){r=f(m);break}}
  if(r==null&&AY){const m=k.match(/^(\d+) (\S+) (\d{4})$/);if(m&&TRAY.includes(m[2]))r=`${m[1]} ${AY[TRAY.indexOf(m[2])]} ${m[3]}`}
  return r==null?s:s.replace(k,r);
}
window.ceviri=ceviri;
window.tl=o=>o[dil]!=null?o[dil]:o.tr; // dile göre şablon seçimi: tl({tr:..,en:..,ar:..,de:..})
if(!IX)return;
const ATTR=['placeholder','aria-label','title'];
function isle(kok){
  if(kok.nodeType===3){const v=ceviri(kok.nodeValue);if(v!==kok.nodeValue)kok.nodeValue=v;return}
  if(kok.nodeType!==1||kok.closest&&kok.closest('[data-cevirme]'))return;
  ATTR.forEach(a=>{const v=kok.getAttribute&&kok.getAttribute(a);if(v){const c=ceviri(v);if(c!==v)kok.setAttribute(a,c)}});
  const w=document.createTreeWalker(kok,NodeFilter.SHOW_TEXT|NodeFilter.SHOW_ELEMENT);let n;
  while(n=w.nextNode()){
    if(n.nodeType===3){const v=ceviri(n.nodeValue);if(v!==n.nodeValue)n.nodeValue=v}
    else ATTR.forEach(a=>{const v=n.getAttribute(a);if(v){const c=ceviri(v);if(c!==v)n.setAttribute(a,c)}});
  }
}
const basla=()=>{
  isle(document.body);
  new MutationObserver(ms=>ms.forEach(m=>{
    if(m.type==='characterData')isle(m.target);
    else m.addedNodes.forEach(isle);
  })).observe(document.body,{childList:true,subtree:true,characterData:true});
};
document.readyState==='loading'?document.addEventListener('DOMContentLoaded',basla):basla();
if(dil==='ar')document.documentElement.classList.add('dil-ar');
})();
