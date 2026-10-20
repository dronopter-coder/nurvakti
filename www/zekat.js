/* Zekât hesaplayıcı — Diyanet İşleri Başkanlığı'nın açıklamalarına göre (Hanefî mezhebi):
   • Nisap: 24 ayar 80,18 gr altın (20 miskal) veya değeri; oran kırkta bir (%2,5).
   • Altın: ayar farkı nisapta önemsizdir (toplam ağırlık), zekât her ayarın kendi değerinden hesaplanır. Ziynet eşyası dahildir.
   • Para, döviz, ticaret malı (maliyet değeri), ticari amaçlı taşınmaz ve al-sat hisseleri (piyasa değeri), kuvvetli alacaklar dahildir.
   • Düşülecek borçlar: yalnız bu zekât yılına ait birikmiş ve bu yıl içinde ödenmesi gereken borçlar/taksitler.
   • Hayvanlar ayrı nisaba tabidir (koyun-keçi 40, sığır 30). */
(function(){
const esc=Sayfa.esc;
const NISAP_GR=80.18;
const SIKKE={ceyrek:1.75,yarim:3.5,tam:7.0,ata:7.216}; // 22 ayar sikke ağırlıkları (gr)
const A=[
 ['fiyat','Gram altın fiyatı (24 ayar, ₺)','Kuyumcu veya bankadaki güncel alış fiyatını yazın.','alt'],
 ['g24','24 ayar altın (gram)','Külçe, gram altın','alt'],
 ['g22','22 ayar altın (gram)','Bilezik, ziynet eşyası dahil','alt'],
 ['g14','14 ayar altın (gram)','Takı','alt'],
 ['ceyrek','Çeyrek altın (adet)','','alt'],['yarim','Yarım altın (adet)','','alt'],['tam','Tam altın (adet)','','alt'],['ata','Ata / Cumhuriyet altını (adet)','','alt'],
 ['gumus','Gümüş (gram)','','gum'],['gfiyat','Gram gümüş fiyatı (₺)','','gum'],
 ['nakit','Nakit ve banka hesapları (₺)','Vadeli/vadesiz hesaplar, kasadaki para','para'],
 ['doviz','Döviz (₺ karşılığı)','Dolar, avro vb. bugünkü değeri','para'],
 ['ticari','Ticaret malları (₺)','Satmak için elde tutulan mallar, maliyet değeri','para'],
 ['emlak','Ticari amaçlı taşınmaz (₺)','Satmak için alınmış ev, arsa; piyasa değeri','para'],
 ['hisse','Al-sat amaçlı hisse senedi, fon (₺)','Piyasa değeri','para'],
 ['alacak','Tahsili umulan alacaklar (₺)','Borç verilen para, ticari alacaklar','para'],
 ['borc','Bu yıl ödenecek borçlar (₺)','Birikmiş borçlar ve bu yıl vadesi dolan taksitler','borc'],
 ['koyun','Koyun ve keçi (adet)','Yılın çoğunda merada otlayan','hay'],['sigir','Sığır, manda (adet)','Yılın çoğunda merada otlayan','hay']];
const BOL={alt:'Altın',gum:'Gümüş',para:'Para ve ticari varlıklar',borc:'Düşülecek borçlar',hay:'Hayvanlar (isteğe bağlı)'};
const SAYI={tr:'tr-TR',de:'de-DE'}[DIL]||'en-US';
const tlYaz=x=>(Math.round(x*100)/100).toLocaleString(SAYI,{minimumFractionDigits:2,maximumFractionDigits:2})+(DIL==='tr'?' ₺':'');
const sayi=v=>{v=String(v||'').replace(/\s/g,''); // 1.234,5 (Türkçe) veya 1234.5 / 1,234.5 (İngilizce) yazımı
  if(/,\d{1,2}$/.test(v)||(/,/.test(v)&&!/\.\d{1,2}$/.test(v)&&DIL!=='en'))v=v.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(v))v=v.replace(/\./g,'');else v=v.replace(/,/g,'');
  const n=parseFloat(v);return isFinite(n)&&n>0?n:0};
function koyunZekat(n){if(n<40)return 0;if(n<=120)return 1;if(n<=200)return 2;if(n<=399)return 3;return Math.floor(n/100)}
function sigirZekat(n){ // 30'da bir "tebî" (1 yaşında), 40'ta bir "müsinne" (2 yaşında)
  const [TB,MS,TB1,MS1]=tl({tr:['tebî','müsinne','1 tebî (1 yaşında dana)','1 müsinne (2 yaşında)'],en:['tabi\'','musinnah','1 tabi\' (1-year-old calf)','1 musinnah (2-year-old)'],ar:['تبيع','مسنّة','تبيع واحد (عجل ابن سنة)','مسنّة واحدة (بنت سنتين)'],de:['Tabi\'','Musinna','1 Tabi\' (einjähriges Kalb)','1 Musinna (zweijährig)']});
  if(n<30)return '';if(n<40)return TB1;if(n<60)return MS1;
  let best=null;for(let m=0;m*40<=n;m++){const t=Math.floor((n-m*40)/30),kalan=n-m*40-t*30;if(!best||kalan<=best[2])best=[t,m,kalan]}
  return [best[0]?best[0]+' '+TB:'',best[1]?best[1]+' '+MS:''].filter(Boolean).join(' + ');
}
function hesapla(v){
  const f=v.fiyat,grSaf=v.g24+v.g22*22/24+v.g14*14/24+(v.ceyrek*SIKKE.ceyrek+v.yarim*SIKKE.yarim+v.tam*SIKKE.tam+v.ata*SIKKE.ata)*22/24;
  const grToplam=v.g24+v.g22+v.g14+v.ceyrek*SIKKE.ceyrek+v.yarim*SIKKE.yarim+v.tam*SIKKE.tam+v.ata*SIKKE.ata; // nisapta ayar farkı gözetilmez
  const altin=grSaf*f,gumus=v.gumus*v.gfiyat;
  const para=v.nakit+v.doviz+v.ticari+v.emlak+v.hisse+v.alacak;
  const brut=altin+gumus+para,net=brut-v.borc,nisap=NISAP_GR*f;
  const tabi=f>0&&net>0&&(net>=nisap||grToplam>=NISAP_GR); // altın tek başına 80,18 gr ise de nisap tamamdır
  return{altin,gumus,para,brut,net,nisap,grToplam,tabi,zekat:tabi?net/40:0,koyun:koyunZekat(v.koyun),sigir:sigirZekat(v.sigir)};
}
function ac(){
  const s=Sayfa.ac('Zekât hesapla'),kayit=ls.get('zekatGirdi',{});
  let html='<p class="note" style="margin:0 0 8px">Bilgilerinizi girin; zekâtınız Diyanet İşleri Başkanlığı\'nın açıklamalarına göre (Hanefî mezhebi) hesaplansın. Girdiler yalnızca bu cihazda saklanır.</p>';
  let bol='';
  A.forEach(([k,ad,ip,b])=>{
    if(b!==bol){if(bol)html+='</div>';html+=`<div class="zk-bolum"><h4>${BOL[b]}</h4>`;bol=b}
    html+=`<label class="zk-satir"><span>${esc(ad)}${ip?`<small>${esc(ip)}</small>`:''}</span><input inputmode="decimal" data-k="${k}" value="${esc(kayit[k]||'')}" placeholder="0"></label>`;
  });
  html+='</div><div id="zkSonuc" class="zk-sonuc"></div>'+
   `<details class="ib-d"><summary>Hesaplamada nelere dikkat edildi?</summary><div class="ib-i">${'<ul>'+[
    'Nisap, 24 ayar 80,18 gram altın (20 miskal) değeridir. Temel ihtiyaçlar ve bu yılın borçları çıktıktan sonra bu değere ulaşan ve üzerinden bir kamerî (hicri) yıl geçen mal zekâta tabidir.',
    'Oturulan ev, binilen araba, ev eşyası, meslekte kullanılan alet ve makineler zekâta tabi değildir.',
    'Farklı ayardaki altınlar nisap için birlikte tartılır; zekâtı ise her birinin kendi değerinden hesaplanır. Ziynet eşyası Hanefî mezhebine göre zekâta tabidir.',
    'Ticaret mallarında satış kârı değil, zekât günündeki maliyet değeri esas alınır.',
    'Uzun vadeli kredi, konut ve kooperatif borçlarının tamamı değil, yalnız bu yıl ödenecek kısmı düşülür.',
    'Kira gelirleri ve maaş birikimleri diğer mallarla birlikte nisaba ulaşırsa zekâta tabidir; kirada olan evin kendisi tabi değildir.',
    'Hayvanlar ayrı nisaba tabidir: koyun-keçide 40, sığırda 30 adet. Zekâtları hayvanın kendisiyle veya değeriyle ödenebilir.',
    'Zekât; anne-baba, dede-nine, çocuk ve torunlara, eşe ve zengine verilmez. Fakir kardeş ve akrabalara vermek daha sevaptır.'
   ].map(x=>`<li>${x}</li>`).join('')+'</ul>'}<p class="note">Kaynak: Diyanet İşleri Başkanlığı, Din İşleri Yüksek Kurulu açıklamaları. Özel durumlar için müftülüğe veya Alo 190\'a danışınız.</p></div></details>`;
  s.govde.innerHTML=html;
  const oku=()=>{const v={};s.govde.querySelectorAll('input[data-k]').forEach(i=>{v[i.dataset.k]=sayi(i.value);kayit[i.dataset.k]=i.value});ls.set('zekatGirdi',kayit);return v};
  const yaz=()=>{
    const v=oku(),r=hesapla(v),o=$('#zkSonuc');
    if(!v.fiyat){o.innerHTML='<p class="zk-uyari">'+ceviri('Hesaplama için önce gram altın fiyatını girin.')+'</p>';return}
    o.innerHTML=`<div class="zk-tablo">
      <div><span>${ceviri('Altın değeri')} (${r.grToplam.toLocaleString(SAYI,{maximumFractionDigits:2})} g)</span><b>${tlYaz(r.altin)}</b></div>
      ${r.gumus?`<div><span>Gümüş değeri</span><b>${tlYaz(r.gumus)}</b></div>`:''}
      <div><span>Para ve ticari varlıklar</span><b>${tlYaz(r.para)}</b></div>
      <div><span>Düşülen borçlar</span><b>− ${tlYaz(v.borc)}</b></div>
      <div class="zk-ana"><span>Zekâta tabi net varlık</span><b>${tlYaz(Math.max(0,r.net))}</b></div>
      <div><span>Nisap (80,18 gr altın)</span><b>${tlYaz(r.nisap)}</b></div></div>`+
     (r.tabi?`<div class="zk-kutu"><small>Vermeniz gereken zekât</small><strong>${tlYaz(r.zekat)}</strong><small>Net varlığın kırkta biri (%2,5)</small></div><p class="note">Bu miktar, malınız nisaba ulaştığı günden itibaren üzerinden bir kamerî yıl geçmişse farzdır. Yıl dolmadan önce de verilebilir.</p>`
            :`<div class="zk-kutu zk-yok"><small>Sonuç</small><strong>Zekât gerekmiyor</strong><small>Net varlığınız nisap miktarının altında</small></div>`)+
     (r.koyun||r.sigir?`<div class="zk-tablo" style="margin-top:8px">${r.koyun?`<div><span>Koyun-keçi zekâtı</span><b>${r.koyun} ${ceviri('koyun/keçi')}</b></div>`:''}${r.sigir?`<div><span>Sığır zekâtı</span><b>${esc(r.sigir)}</b></div>`:''}</div>`:'');
  };
  s.govde.querySelectorAll('input[data-k]').forEach(i=>i.addEventListener('input',yaz));
  yaz();
}
window.ZekatHesap={ac,hesapla};
})();
