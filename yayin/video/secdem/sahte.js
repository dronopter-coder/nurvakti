// Uygulamanın dış isteklerine sahte (örnek) yanıtlar: Diyanet vakitleri (İstanbul), camiler; geri kalan dış istekler kesilir
const p2=n=>String(n).padStart(2,'0');
const VAKIT={Imsak:'05:52',Gunes:'07:20',Ogle:'12:41',Ikindi:'15:28',Aksam:'17:05',Yatsi:'18:29'};
function gunler(){const L=[];const b=new Date(2026,10,1);for(let i=0;i<40;i++){const d=new Date(b.getTime()+i*864e5);const h=21+i;L.push({MiladiTarihKisa:p2(d.getDate())+'.'+p2(d.getMonth()+1)+'.'+d.getFullYear(),HicriTarihKisa:(h<=29?h+'.5':(h-29)+'.6')+'.1448',...VAKIT})}return L}
const CAMI=[['Yeni Cami',41.0170,28.9708],['Rüstem Paşa Camii',41.0176,28.9682],['Nuruosmaniye Camii',41.0107,28.9707],['Süleymaniye Camii',41.0162,28.9638],['Beyazıt Camii',41.0103,28.9649],['Sultanahmet Camii',41.0054,28.9768],['Firuz Ağa Camii',41.0080,28.9745],['Zeynep Sultan Camii',41.0118,28.9810]];
async function kur(ctx){
  await ctx.route('**/*',r=>{
    const u=r.request().url();
    if(u.startsWith('file:'))return r.continue();
    const j=o=>r.fulfill({status:200,contentType:'application/json',headers:{'access-control-allow-origin':'*'},body:JSON.stringify(o)});
    if(u.includes('ezanvakti')){
      if(u.includes('/ulkeler'))return j([{UlkeAdi:'TÜRKİYE',UlkeAdiEn:'TURKEY',UlkeID:'2'}]);
      if(u.includes('/sehirler/'))return j([{SehirAdi:'İSTANBUL',SehirAdiEn:'ISTANBUL',SehirID:'539'}]);
      if(u.includes('/ilceler/'))return j([{IlceAdi:'İSTANBUL',IlceAdiEn:'ISTANBUL',IlceID:'9541'}]);
      if(u.includes('/vakitler/'))return j(gunler());
    }
    if(u.includes('overpass')||u.includes('interpreter'))return j({elements:CAMI.map(([n,la,lo],i)=>({type:'node',id:i+1,lat:la,lon:lo,tags:{name:n,amenity:'place_of_worship',religion:'muslim'}}))});
    if(u.includes('photon'))return j({features:CAMI.map(([n,la,lo])=>({properties:{name:n},geometry:{coordinates:[lo,la]}}))});
    return r.abort();
  });
  // konum izni verilmez: uygulama seçili şehri (İstanbul) kullanır
}
module.exports={kur,ZAMAN:new Date('2026-11-05T16:41:19+03:00')};
