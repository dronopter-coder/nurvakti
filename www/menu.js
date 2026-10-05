/* Ana ekran menüsü (Kur'an-ı Kerim, Camiler, İbadet, Çocuklar) ve tam ekran sayfa yardımcısı */
(function(){
const sv=d=>`<svg viewBox="0 0 24 24" aria-hidden="true">${d}</svg>`;
const M=[
 ['kuran',"Kur'an-ı Kerim",sv('<path d="M12 6c-2-1.5-5-2-8-2v13c3 0 6 .5 8 2 2-1.5 5-2 8-2V4c-3 0-6 .5-8 2z"/><path d="M12 6v13"/>')],
 ['cami','Camiler',sv('<path d="M6 20v-6a6 6 0 0 1 12 0v6"/><path d="M12 5V3M3 20h18M3 20V9M21 20V9"/>')],
 ['ibadet','İbadet',sv('<rect x="6" y="3" width="12" height="18" rx="1.5"/><path d="M9 21v-7a3 3 0 0 1 6 0v7"/>')],
 ['cocuk','Çocuklar',sv('<circle cx="12" cy="12" r="9"/><path d="M8.5 14a4 4 0 0 0 7 0"/><circle cx="9" cy="10" r=".7" fill="currentColor"/><circle cx="15" cy="10" r=".7" fill="currentColor"/>')]];
const m=document.createElement('div');m.id='anaMenu';
m.innerHTML=M.map(x=>`<button data-m="${x[0]}">${x[2]}<span>${x[1]}</span></button>`).join('');
document.querySelector('#strip').after(m);
m.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  const f={kuran:()=>window.Kuran&&Kuran.liste(),cami:()=>window.Cami&&Cami.ac(),ibadet:()=>window.Ibadet&&Ibadet.ac(),cocuk:()=>window.Cocuk&&Cocuk.ac()}[b.dataset.m];
  f?f():toast('Bu bölüm yüklenemedi');
});

/* Paylaşım: yerli paylaşım penceresi (WhatsApp, SMS…); yoksa tarayıcı paylaşımı, o da yoksa WhatsApp bağlantısı */
window.paylas=async(text,baslik)=>{
  if(P.Share){try{await P.Share.share({title:baslik||'Nur Vakti',text,dialogTitle:baslik||'Paylaş'});return}catch(e){if(/cancel|iptal/i.test(String(e&&e.message||e)))return}}
  if(navigator.share){try{await navigator.share({text});return}catch(e){if(e&&e.name==='AbortError')return}}
  window.open('https://wa.me/?text='+encodeURIComponent(text),'_blank');
};
const PLAY='https://play.google.com/store/apps/details?id=com.nurvakti.namazvekuran';
window.uygulamayiPaylas=()=>paylas(`Namaz vakitleri ve ezan bildirimi, kıble pusulası, sesli Kur'an-ı Kerim, yakındaki camiler, ibadet bilgileri, çocuklar için eğitici bölüm ve Cuma günü vefat eden yakınlarımız için Fâtiha–Yâsîn hatırlatması… Hepsi tek uygulamada: Nur Vakti 🌙\n\nÜcretsiz indir:\n${PLAY}`,'Nur Vakti uygulamasını paylaş');
document.querySelector('#paylasBtn').onclick=uygulamayiPaylas;
{const b=document.createElement('button');b.className='btn';b.textContent='Uygulamayı paylaş';b.onclick=()=>{document.querySelector('#setSheet').classList.remove('open');uygulamayiPaylas()};document.querySelector('#setSheet .box').appendChild(b)}

/* Tam ekran sayfa: Sayfa.ac('Başlık') -> {el, govde, kapat}; üst üste açılabilir */
window.Sayfa={
  ac(baslik,opt={}){
    const el=document.createElement('div');el.className='sf';
    el.innerHTML=`<div class="sf-bar"><button class="sf-geri">‹ Geri</button><b></b></div><div class="sf-govde"></div>`;
    el.querySelector('b').textContent=baslik;
    document.body.appendChild(el);
    const s={el,govde:el.querySelector('.sf-govde'),kapat(){el.remove();opt.kapaninca&&opt.kapaninca()},baslik(t){el.querySelector('b').textContent=t}};
    el.querySelector('.sf-geri').onclick=()=>s.kapat();
    return s;
  },
  esc:x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])),
  yukle:src=>new Promise((res,rej)=>{const a=document.querySelector(`script[data-src="${src}"]`);if(a&&a.dataset.ok)return res();const s=a||document.createElement('script');s.dataset.src=src;s.onload=()=>{s.dataset.ok=1;res()};s.onerror=()=>{s.remove();rej(new Error(src))};if(!a){s.src=src;document.head.appendChild(s)}})
};
})();
