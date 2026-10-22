// Tüm kareleri çekip ffmpeg'e borulayarak MP4 (H.264) üretir
const {chromium}=require('/opt/node22/lib/node_modules/playwright');const {spawn}=require('child_process');
const [dir,out]=process.argv.slice(2);const FPS=30,SURE=30,FF='/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('HATA',e.message));
await p.goto('file://'+dir+'/video.html');await p.waitForTimeout(1000);
const ff=spawn(FF,['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-f','lavfi','-i','anullsrc=r=44100:cl=stereo',
  '-shortest','-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-profile:v','high','-movflags','+faststart','-c:a','aac','-b:a','128k',out],{stdio:['pipe','ignore','inherit']});
for(let i=0;i<FPS*SURE;i++){await p.evaluate(t=>ciz(t),i/FPS);const buf=await p.screenshot({type:'jpeg',quality:94});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%150===0)console.log('kare',i)}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('bitti')})();
