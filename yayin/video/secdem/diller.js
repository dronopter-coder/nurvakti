const {baglam}=require('./ortak.js');
(async()=>{for(const dil of ['tr','en','ar','de']){
  const {b,ctx}=await baglam({viewport:{width:360,height:720},dpr:3,dil});const p=await ctx.newPage();p.on('pageerror',e=>console.log('HATA',dil,e.message));
  await p.goto('file:///home/user/nurvakti/www/index.html');await p.waitForTimeout(600);await ctx.clock.runFor(3000);await p.waitForTimeout(900);await ctx.clock.runFor(1500);await p.waitForTimeout(400);
  await p.addStyleTag({content:'#toast{display:none!important}'});
  await p.screenshot({path:__dirname+'/kareler/ana-'+dil+'.png'});await b.close()}})();
