/* Hakkında, kaynaklar ve lisanslar */
(function(){
const GIZLILIK='https://dronopter-coder.github.io/nurvakti/gizlilik.html';
const K=[
 ['Kur\'an-ı Kerim metni','Tanzil Projesi (tanzil.net) – Osmanlı imlası. Metin değiştirilmeden kullanılmıştır. Creative Commons Attribution 3.0 lisansı.'],
 ['Kur\'an sesi','Mişari Raşid el-Afasi kayıtları; EveryAyah.com ve Islamic Network (cdn.islamic.network) üzerinden internetten çalınır.'],
 ['Namaz vakitleri','Aladhan API (aladhan.com) – Diyanet İşleri Başkanlığı hesaplama yöntemi (yöntem 13).'],
 ['Cami ve harita verisi','© OpenStreetMap katkıcıları (ODbL). Overpass API ve tile.openstreetmap.org. Harita kütüphanesi: Leaflet (BSD-2-Clause).'],
 ['Yer adı ve il/ilçe listesi','OpenStreetMap Nominatim, BigDataCloud, TürkiyeAPI.'],
 ['Yazı tanıma','Tesseract OCR ve Türkçe dil verisi (Apache-2.0); tamamen cihazda çalışır.'],
 ['Yazı tipleri','Amiri Quran, Aref Ruqaa, Cinzel Decorative – SIL Open Font License 1.1.'],
 ['Altyapı','Capacitor (MIT), Google AdMob eklentisi.']
];
const esc=Sayfa.esc;
function ac(){
  const s=Sayfa.ac('Hakkında ve kaynaklar');
  s.govde.innerHTML=`<div class="cc-kart" style="text-align:left"><h3 style="margin-top:0">Nûr Vakti</h3><p>Namaz vakitleri, Kur'an-ı Kerim, kabir kaydı ve Cuma okuması, yakın camiler, ibadet bilgileri ve çocuklar için eğitici içerikler. Allah kabul etsin.</p></div>
  <p class="note" style="margin:10px 2px">Ayetler anlam olarak özetlenmiştir; ayrıntı için meal ve tefsirlere bakınız. Dinî bilgiler genel bilgi amaçlıdır ve Diyanet İşleri Başkanlığı'nın yaygın görüşüne göre özetlenmiştir. Uygulama Diyanet İşleri Başkanlığı ile bağlantılı değildir. Özel durumlar için müftülüğe veya yetkili bir din görevlisine danışınız.</p>
  <div class="ib-i">${K.map(x=>`<details class="ib-d"><summary>${esc(x[0])}</summary><div class="ib-i"><p>${esc(x[1])}</p></div></details>`).join('')}</div>
  <div class="kb-btns" style="flex-direction:column;margin-top:14px"><a class="btn" style="text-align:center;text-decoration:none;display:block" target="_blank" rel="noopener" href="${GIZLILIK}">Gizlilik politikası</a>
  <button class="btn" id="hkReklam">Reklam gizlilik seçenekleri</button></div>`;
  $('#hkReklam').onclick=async()=>{
    const A=P.AdMob;
    try{if(A&&A.showPrivacyOptionsForm){await A.showPrivacyOptionsForm()}else toast('Bu cihazda ek bir seçenek yok.')}catch(e){toast('Şu an gösterilecek bir seçenek yok.')}
  };
}
const b=document.createElement('button');b.className='btn';b.id='stHakkinda';b.textContent='Hakkında ve kaynaklar';
document.querySelector('#setSheet .box').appendChild(b);
b.onclick=()=>{document.querySelector('#setSheet').classList.remove('open');ac()};
window.Hakkinda={ac};
})();
