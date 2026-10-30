// Videoyu kare kare çeker. Kullanım: node cek.js [çıktı.mp4]  |  node cek.js --dene 3,9.5,...
const {baglam}=require('./ortak.js');const {spawn}=require('child_process');
const arg=process.argv.slice(2),dene=arg[0]==='--dene'?arg[1].split(',').map(Number):null;
const FPS=dene?10:30,SURE=dene?Math.max(...dene)+.05:85;
(async()=>{const {b,ctx}=await baglam({viewport:{width:1080,height:1920}});const p=await ctx.newPage();
  p.on('pageerror',e=>console.log('HATA',e.message));
  await p.goto('file://'+__dirname+'/sahne.html');await p.waitForTimeout(800);await ctx.clock.runFor(3000);await p.waitForTimeout(1200);await ctx.clock.runFor(1500);await p.waitForTimeout(500);
  await p.evaluate(()=>{const d=document.getElementById('app').contentDocument;const s=d.createElement('style');s.textContent='#toast{transition:none}';d.head.appendChild(s)});
  let ff=null;if(!dene){ff=spawn('ffmpeg',['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-c:v','libx264','-preset','medium','-crf','18','-pix_fmt','yuv420p',__dirname+'/goruntu.mp4'],{stdio:['pipe','ignore','inherit']})}
  const N=Math.round(SURE*FPS);let sira=0;
  for(let i=0;i<N;i++){const t=i/FPS;await p.evaluate(t=>ciz(t),t);await ctx.clock.runFor(1000/FPS);
    if(dene){if(sira<dene.length&&t+1e-6>=dene[sira]){await p.screenshot({path:__dirname+'/dn/t'+dene[sira]+'.jpg',type:'jpeg',quality:70});sira++}}
    else{await p.waitForTimeout(15);const buf=await p.screenshot({type:'jpeg',quality:92});if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%300===0)console.log('kare',i)}}
  if(ff){ff.stdin.end();await new Promise(r=>ff.on('close',r))}
  await b.close();console.log('bitti')})();
