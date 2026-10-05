/* Telefonun geri tuşu: önce en üstteki pencereyi kapatır, sonra ana ekrana döner; ana ekranda iki kez basınca çıkar */
(function(){
const A=P.App;if(!A||!A.addListener)return;
const acik=s=>{const e=document.querySelector(s);return e&&getComputedStyle(e).display!=='none'?e:null};
const tikla=(kok,s)=>{const b=kok&&kok.querySelector(s);if(b){b.click();return true}return false};
let son=0;
function geri(){
  // 1) En üstteki tam ekran sayfa (Kur'an okuyucu, İbadet, Çocuklar, Camiler…)
  const sf=[...document.querySelectorAll('body > .sf')].pop();
  if(sf){if(tikla(sf,'.sf-geri')||tikla(sf,'.kr-kapat'))return;sf.remove();return}
  // 2) Kabir okuma ekranı
  if(acik('#kbOku.open')){$('#okKapat').click();return}
  // 3) Alttan açılan pencereler
  const ov=[...document.querySelectorAll('.kb-ov.open')].pop();
  if(ov){
    if(ov.id==='kbOv'){if(!ov.dataset.kilit){ov.classList.remove('open');$('#kbBox').innerHTML=''}return}
    if(ov.id)ov.classList.remove('open');else ov.remove();
    return;
  }
  for(const id of ['#sheet','#setSheet']){const e=document.querySelector(id+'.open');if(e){e.classList.remove('open');return}}
  // 4) Alt sekmelerden ana ekrana
  if(typeof view!=='undefined'&&view!=='vakit'){go('vakit');return}
  // 5) Ana ekranda: iki kez basınca çık
  const t=Date.now();
  if(t-son<2200){A.exitApp();return}
  son=t;toast('Çıkmak için geri tuşuna tekrar basın');
}
A.addListener('backButton',geri);
window.geriTusu=geri;
})();
