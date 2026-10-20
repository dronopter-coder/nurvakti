/* Çeviri dosyalarından www/dil/<dil>.js üretir. Çalıştırma: node ceviri/olustur.js
   Kaynak Türkçe veriler uygulamanın kendi dosyalarından okunur; sıralar birebir aynı olmalıdır. */
const fs=require('fs'),path=require('path');
const K=path.join(__dirname,'..'),W=path.join(K,'www'),C=__dirname;
const oku=f=>fs.readFileSync(path.join(C,f),'utf8').replace(/\r/g,'').replace(/\n$/,'').split('\n');
const tab=f=>oku(f).map(x=>x.split('\t'));

// Türkçe kaynaklar (ayet/hadis listeleri, ESMA, AD) uygulama dosyalarından
global.window={};
const kaynak=JSON.parse(fs.readFileSync(path.join(C,'kaynak.json'),'utf8'));
eval(fs.readFileSync(path.join(W,'esma.js'),'utf8'));
const ESMA_TR=window.ESMA,ESMA_AR=window.ESMA_AR;
const AD=eval(fs.readFileSync(path.join(W,'kuran.js'),'utf8').match(/const AD=\(window\.DV&&DV\.SURE\)\|\|(\[.*?\]);/s)[1]);
const n=t=>t.toLocaleLowerCase('tr').normalize('NFD').replace(/[̀-ͯ']/g,'').replace(/ı/g,'i').replace(/[^a-z]/g,'');
const sureNo=ad=>{const i=AD.findIndex(a=>n(a)===n(ad));if(i<0)throw new Error('Sûre bulunamadı: '+ad);return i};

const KAYNAK={
 en:{'Buhârî':'Bukhari','Müslim':'Muslim','Tirmizî':'Tirmidhi','Taberânî':'Tabarani','Nesâî':"Nasa'i",'İbn Mâce':'Ibn Majah','Ebû Dâvûd':'Abu Dawud','Ahmed b. Hanbel':'Ahmad ibn Hanbal'},
 de:{'Buhârî':'Buchari','Müslim':'Muslim','Tirmizî':'Tirmidhi','Taberânî':'Tabarani','Nesâî':"Nasa'i",'İbn Mâce':'Ibn Madscha','Ebû Dâvûd':'Abu Dawud','Ahmed b. Hanbel':'Ahmad ibn Hanbal'},
 ar:{'Buhârî':'البخاري','Müslim':'مسلم','Tirmizî':'الترمذي','Taberânî':'الطبراني','Nesâî':'النسائي','İbn Mâce':'ابن ماجه','Ebû Dâvûd':'أبو داود','Ahmed b. Hanbel':'أحمد بن حنبل'}};
const kaynakCevir=(s,d)=>s.split(/,\s*/).map(x=>{const r=KAYNAK[d][x.trim()];if(!r)throw new Error('Kaynak yok: '+x);return r}).join(d==='ar'?'، ':', ');

const SURE={en:oku('sure.en.txt'),ar:oku('sure.ar.txt')};SURE.de=SURE.en;
const ayetAr=JSON.parse(fs.readFileSync(path.join(C,'ayet_ar.json'),'utf8'));
const cocuk=require('./cocuk.js');

function ibadet(f){
  const out=[];let t=null,b=null;
  oku(f).forEach(l=>{
    if(l.startsWith('## ')){const [ad,ozet]=l.slice(3).split(' | ');t={ad,ozet,b:[]};out.push(t)}
    else if(l.startsWith('### ')){b=[l.slice(4),''];t.b.push(b)}
    else if(l.trim())b[1]+=l;
  });return out;
}
function esit(ad,a,b){if(a.length!==b.length)throw new Error(`${ad}: ${a.length} ≠ ${b.length}`)}
// Arayüz sözlüğü: tr|en|ar|de satırları
const SOZ=fs.existsSync(path.join(C,'arayuz.txt'))?oku('arayuz.txt').filter(l=>l&&!l.startsWith('#')).map(l=>l.split('|')):[];
SOZ.forEach((r,i)=>{if(r.length!==4)throw new Error('arayuz.txt satır '+(i+1)+': '+r.length+' sütun')});

for(const d of ['en','ar','de']){
  const ix={en:1,ar:2,de:3}[d];
  const AYET=d==='ar'?ayetAr:oku(`ayet.${d}.txt`).map((t,i)=>{
    const ref=kaynak.AYET[i][1],m=ref.match(/^(.+?),\s*(.+)$/);
    return [t,`${SURE[d][sureNo(m[1])]}, ${m[2]}`];
  });
  esit('AYET',AYET,kaynak.AYET);
  const HADIS=oku(`hadis.${d}.txt`).map((t,i)=>[t,kaynakCevir(kaynak.HADIS[i][1],d)]);esit('HADIS',HADIS,kaynak.HADIS);
  const ILM=tab(`ilm.${d}.txt`);esit('ILM',ILM,kaynak.ILM);
  const CUMA=oku(`cuma.${d}.txt`).map(x=>x.replace(/\\n/g,'\n'));esit('CUMA',CUMA,kaynak.CUMA);
  const SORU=tab(`soru.${d}.txt`);esit('SORU',SORU,kaynak.SORU);
  const DUA=tab(`dua.${d}.txt`);esit('DUA',DUA,kaynak.DUALAR);
  const anlam=oku(`esma.${d}.txt`),adlar=d==='ar'?ESMA_AR.map(()=>''):oku('esma-ad.en.txt');
  esit('ESMA',anlam,ESMA_TR);esit('ESMA ad',adlar,ESMA_TR);
  const ESMA=anlam.map((a,i)=>[adlar[i],a]);
  const IBADET=ibadet(`ibadet.${d}.txt`);esit('IBADET',IBADET,kaynak.IBADET);
  IBADET.forEach((t,i)=>esit('IBADET '+i,t.b,kaynak.IBADET[i].b));
  const S=SOZ.filter(r=>r[ix]).map(r=>[r[0],r[ix]]);
  const DV={AYET,HADIS,ILM,CUMA,SORU,DUA,ESMA,IBADET,SURE:SURE[d],COCUK:cocuk[d],S};
  fs.writeFileSync(path.join(W,'dil',d+'.js'),`/* Otomatik üretildi: ceviri/olustur.js — elle düzenlemeyin */\nwindow.DV=${JSON.stringify(DV)};\n`);
  console.log(d,(fs.statSync(path.join(W,'dil',d+'.js')).size/1024).toFixed(0)+' KB',S.length+' arayüz');
}
