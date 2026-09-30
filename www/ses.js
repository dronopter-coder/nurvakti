/* Ayet ayet kâri sesi oynatıcı (Mişari Raşid el-Afasi; everyayah.com, yedek: cdn.islamic.network) */
window.AyetSes=function(o){
  // o: {kuyruk:[{k,u:[birincil,yedek]}], vurgu(k,i), durum(caliyor,i), bitti(), hata(), hiz}
  const au=new Audio(),on=new Audio();au.preload='auto';on.preload='auto';
  let i=0,cal=false,kilit=null,hiz=o.hiz||1;
  const kilitAl=async()=>{try{if(navigator.wakeLock)kilit=await navigator.wakeLock.request('screen')}catch(e){}};
  const kilitBirak=()=>{try{kilit&&kilit.release()}catch(e){}kilit=null};
  function dur(tam){
    au.onended=au.onerror=null;au.pause();cal=false;kilitBirak();
    if(tam)i=0;
    o.durum&&o.durum(false,i);
  }
  function hata(){dur(false);o.hata&&o.hata()}
  function oynat(n,denendi){
    const it=o.kuyruk[n];
    if(!it){dur(true);o.bitti&&o.bitti();return}
    i=n;o.vurgu&&o.vurgu(it.k,n);
    au.onended=()=>oynat(n+1);
    au.onerror=()=>{if(!denendi&&it.u[1]){au.src=it.u[1];au.onerror=hata;au.play().catch(hata)}else hata()};
    au.src=it.u[0];au.defaultPlaybackRate=hiz;au.playbackRate=hiz;cal=true;o.durum&&o.durum(true,n);
    au.play().catch(e=>{if(e&&e.name==='NotAllowedError')dur(false);else au.onerror()});
    const nx=o.kuyruk[n+1];if(nx)on.src=nx.u[0];
  }
  return{
    baslat(n){kilitAl();oynat(n==null?i:n)},
    dur,
    get caliyor(){return cal},
    get sira(){return i},
    hiz(x){hiz=x;au.defaultPlaybackRate=x;au.playbackRate=x}
  };
};
