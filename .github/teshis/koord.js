// index.html'deki koord() ile gerçek sunuculardan koordinat alıp kıble açısını yazdırır (teşhis)
const fs=require('fs');const h=fs.readFileSync('www/index.html','utf8');
const kod=h.slice(h.indexOf('const sahteKoord='),h.indexOf('const at=(base,hm)=>'));
const ls={d:{},get(k,v){return this.d[k]??v},set(k,v){this.d[k]=v}};let loc;
const locKey=()=>loc.il+'|'+loc.ilce;
eval(kod+';global.koord=koord');
const rad=x=>x*Math.PI/180;
const q=(lat,lon)=>{const a=rad(lat),b=rad(21.4225),dl=rad(39.8262-lon);return (Math.atan2(Math.sin(dl)*Math.cos(b),Math.cos(a)*Math.sin(b)-Math.sin(a)*Math.cos(b)*Math.cos(dl))*180/Math.PI+360)%360};
const L=[{il:'Ankara',ilce:'Mamak'},{il:'Kocaeli',ilce:'İzmit'},{il:'İstanbul',ilce:'Kadıköy'},{il:'Hakkari',ilce:'Yüksekova'},{il:'Edirne',ilce:'Merkez'},{il:'Van',ilce:'Van'},{il:'Rize',ilce:'Çayeli'},
 {il:'Berlin',ilce:'Berlin',ulke:{en:'Germany'}},{il:'Köln',ilce:'Köln',ulke:{en:'Germany'}},{il:'Wien',ilce:'Wien',ulke:{en:'Austria'}},{il:'Amsterdam',ilce:'Amsterdam',ulke:{en:'Netherlands'}},{il:'London',ilce:'London',ulke:{en:'United Kingdom'}}];
(async()=>{for(const x of L){loc={type:'city',...x};try{const k=await koord();console.log(x.ilce+', '+x.il,k.lat.toFixed(3),k.lon.toFixed(3),'kıble',q(k.lat,k.lon).toFixed(1))}catch(e){console.log(x.ilce+', '+x.il,'HATA',e.message)}await new Promise(r=>setTimeout(r,1100))}})();
