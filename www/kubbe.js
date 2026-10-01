/* Ana ekran: vakit halkasının çevresine kubbenin devamı gibi ince süs çizgileri */
(function(){
const w=document.querySelector('.ringwrap');if(!w)return;
const G='#C9A45C',NS='http://www.w3.org/2000/svg';
const rad=d=>d*Math.PI/180,P=(r,a)=>[(r*Math.cos(rad(a))).toFixed(2),(r*Math.sin(rad(a))).toFixed(2)];
let s='';
// ışınlar (her 15°) – halkadan dışa doğru solarak uzanır
for(let a=0;a<360;a+=15){const [x1,y1]=P(104,a),[x2,y2]=P(330,a);s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke-width="${a%45?0.6:0.9}"/>`}
// eşmerkezli halkalar
[[120,0],[138,3],[160,0],[188,4],[224,0],[270,3]].forEach(([r,d],i)=>{s+=`<circle r="${r}" fill="none" stroke-width="${i%2?0.6:0.8}"${d?` stroke-dasharray="${d} ${d*1.6}"`:''}/>`});
// halkanın hemen çevresinde kubbe kenar işlemesi: 24 küçük kemer
let k='';for(let a=0;a<360;a+=15){const [x1,y1]=P(108,a),[x2,y2]=P(108,a+15);k+=`${k?'':`M${x1} ${y1}`}A9 9 0 0 1 ${x2} ${y2}`}
s+=`<path d="${k}" fill="none" stroke-width="0.9"/>`;
// iki yanda küçük sekiz köşeli yıldız süsleri
[-1,1].forEach(sg=>{[0,45].forEach(r=>{s+=`<rect x="${sg*168-13}" y="-13" width="26" height="26" fill="none" stroke-width="0.9" transform="rotate(${r} ${sg*168} 0)"/>`});s+=`<circle cx="${sg*168}" cy="0" r="2.2" fill="${G}" stroke="none"/>`});
const svg=document.createElementNS(NS,'svg');
svg.setAttribute('viewBox','-206 -114 412 228');svg.setAttribute('class','kubbe');svg.setAttribute('aria-hidden','true');
svg.innerHTML=`<defs><radialGradient id="kbSolma" cx="0" cy="0" r="215" gradientUnits="userSpaceOnUse"><stop offset=".42" stop-color="#fff" stop-opacity=".95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient><mask id="kbMask" maskUnits="userSpaceOnUse" x="-206" y="-114" width="412" height="228"><rect x="-206" y="-114" width="412" height="228" fill="url(#kbSolma)"/></mask></defs><g mask="url(#kbMask)" stroke="${G}" stroke-opacity=".5" fill="none">${s}</g>`;
w.insertBefore(svg,w.firstChild);
})();
