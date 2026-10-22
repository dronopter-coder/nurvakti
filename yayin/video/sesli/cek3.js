const {chromium}=require('/opt/node22/lib/node_modules/playwright');const {spawn}=require('child_process');
const [dir,out]=process.argv.slice(2);const FPS=30,SURE=77,FF='/usr/local/lib/python3.11/dist-packages/imageio_ffmpeg/binaries/ffmpeg-linux-x86_64-v7.0.2';
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1080,height:1920}});
p.on('pageerror',e=>console.log('HATA',e.message));
await p.goto('file://'+dir+'/video.html');await p.waitForTimeout(1500);
const ff=spawn(FF,['-y','-f','image2pipe','-framerate',String(FPS),'-c:v','mjpeg','-i','-','-i',dir+'/ses.mp3','-i',dir+'/hayy.mp3',
 '-filter_complex','[2:a]aformat=sample_rates=44100:channel_layouts=stereo,volume=1.1,aecho=0.8:0.8:320|640|960|1280:0.55|0.38|0.25|0.14,apad=pad_dur=4,adelay=73700|73700[h];[1:a]aformat=sample_rates=44100:channel_layouts=stereo,apad[v];[v][h]amix=inputs=2:normalize=0:duration=longest[a]',
 '-map','0:v','-map','[a]','-t',String(SURE),'-c:v','libx264','-preset','slow','-crf','18','-pix_fmt','yuv420p','-profile:v','high','-movflags','+faststart','-c:a','aac','-b:a','192k',out],{stdio:['pipe','ignore','inherit']});
for(let i=0;i<FPS*SURE;i++){await p.evaluate(t=>ciz(t),i/FPS);const buf=await p.screenshot({type:'jpeg',quality:94});
  if(!ff.stdin.write(buf))await new Promise(r=>ff.stdin.once('drain',r));if(i%300===0)console.log('kare',i)}
ff.stdin.end();await new Promise(r=>ff.on('close',r));await b.close();console.log('bitti')})();
