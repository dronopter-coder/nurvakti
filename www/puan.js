/* Teşekkür ve puanlama ricası: uygulama birkaç gün kullanıldıktan sonra gösterilir.
   "Puan ver"e basan bir daha görmez; basmayana en fazla ayda bir kez hatırlatılır. */
(function(){
const K=Object.assign({ilk:Date.now(),acilis:0,son:0,puanlandi:false},ls.get('puanRica',{}));
K.acilis++;ls.set('puanRica',K);
const GUN=864e5;
const uygun=()=>!K.puanlandi&&K.acilis>=5&&Date.now()-K.ilk>=3*GUN&&Date.now()-K.son>=30*GUN;
const METIN={
 tr:['Allah razı olsun! 🌙','Secdem\'i kullandığınız için çok teşekkür ederiz. Daha fazla kişinin bu hayırdan istifade edebilmesi için Play Store\'da uygulamayı puanlayıp kısa bir yorum yazar mısınız?','⭐ Puan ver','Daha sonra'],
 en:['May Allah reward you! 🌙','Thank you for using Secdem. To help more people benefit from it, would you rate the app and write a short review on the Play Store?','⭐ Rate the app','Later'],
 ar:['جزاك الله خيرًا! 🌙','شكرًا لاستخدامك Secdem. لكي يستفيد المزيد من الناس من هذا الخير، هل تقيّم التطبيق وتكتب تعليقًا قصيرًا في متجر Play؟','⭐ قيّم التطبيق','لاحقًا'],
 de:['Möge Allah dich belohnen! 🌙','Danke, dass du Secdem nutzt. Damit mehr Menschen davon profitieren, würdest du die App im Play Store bewerten und einen kurzen Kommentar schreiben?','⭐ App bewerten','Später']};
function goster(){
  const m=METIN[window.DIL]||METIN.tr;
  const ov=document.createElement('div');ov.className='kb-ov open';ov.id='puanOv';
  ov.innerHTML=`<div class="kb-box" style="text-align:center"><div style="font-size:40px;line-height:1">🤲</div><h3>${m[0]}</h3><p style="line-height:1.6;font-size:15px">${m[1]}</p><div style="font-size:28px;letter-spacing:4px;color:var(--altin)">★★★★★</div><button class="btn gold" id="puanVer">${m[2]}</button><button class="btn" id="puanSonra">${m[3]}</button></div>`;
  document.body.appendChild(ov);
  const kapat=()=>ov.remove();
  ov.querySelector('#puanVer').onclick=async()=>{
    K.puanlandi=true;ls.set('puanRica',K);kapat();
    try{if(P.NurYerli&&P.NurYerli.magazayiAc){await P.NurYerli.magazayiAc();return}}catch(e){}
    window.open('https://play.google.com/store/apps/details?id=com.nurvakti.namazvekuran','_blank');
  };
  ov.querySelector('#puanSonra').onclick=()=>{K.son=Date.now();ls.set('puanRica',K);kapat()};
  ov.onclick=e=>{if(e.target===ov){K.son=Date.now();ls.set('puanRica',K);kapat()}};
}
setTimeout(()=>{if(uygun()&&!document.querySelector('.sf,.kb-ov.open'))goster()},25000);
window.PuanRica={goster};
})();
