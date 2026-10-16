import json,re,time,urllib.request,unicodedata
ad=json.load(open('k/isimler.json'))
def asc(t):
    t=t.replace('İ','i').replace('I','ı').lower()
    for a,b in [('ı','i'),('ş','s'),('ğ','g'),('ü','u'),('ö','o'),('ç','c'),('â','a'),('î','i'),('û','u'),("'",''),('’','')]: t=t.replace(a,b)
    t=unicodedata.normalize('NFD',t); t=''.join(c for c in t if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9]+','-',t).strip('-')
def al(u,t=40):
    for k in range(3):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0 (nurvakti link check)'}),timeout=t)
            return r.status,r.read().decode('utf-8','ignore')
        except Exception as e:
            c=getattr(e,'code',0)
            if c in (404,):return c,''
            time.sleep(3)
    return 0,''
# 1) Arşivlenmiş Esmâ-i Hüsnâ maddesindeki bağlantılar
st,h=al('https://web.archive.org/web/2025id_/https://islamansiklopedisi.org.tr/esma-i-husna',60)
print('esma sayfa',st,len(h))
linkler=sorted(set(re.findall(r'islamansiklopedisi\.org\.tr/([a-z0-9\-]+)',h)))
print('LINKLER',linkler)
def var(slug):
    st,h=al('https://archive.org/wayback/available?url=islamansiklopedisi.org.tr/'+slug)
    time.sleep(.4)
    try:
        c=json.loads(h)['archived_snapshots'].get('closest')
        return c if c and c.get('status')=='200' else None
    except Exception: return None
sonuc={}
for n in ad:
    k='allah' if n=='Allah' else asc(re.sub(r'^(el|er|es|ez|en|ed|et|eş)-','',n,flags=re.I))
    ad_=[k]
    if k.endswith(('yy','vv','zz','ll')): ad_.append(k[:-1])
    if k=='muntekim': ad_.append('muntakim')
    if k=='zul-celali-vel-ikram': ad_+=['zulcelali-vel-ikram','zul-celal-vel-ikram']
    if k=='malikul-mulk': ad_+=['malikulmulk']
    bul=None
    for b in ad_:
        for son in ['--esma-i-husna','-esma-i-husna','--allah','']:
            s=b+son
            if linkler and s in linkler: bul=s;break
            c=var(s)
            if c:
                st,h=al('https://web.archive.org/web/'+c['timestamp']+'id_/https://islamansiklopedisi.org.tr/'+s,60)
                ti=(re.search(r'<title>(.*?)</title>',h,re.S) or [None,''])[1].strip() if h else ''
                esma=bool(re.search(r'esm[âa]-?[iı] h[üu]sn[âa]|Allah[’\']?[ıi]n isim|ilâhî isim|ilahi isim',h,re.I))
                print(n,'->',s,'|',ti,'| esma:',esma,flush=True)
                if esma or not h: bul=s;break
        if bul:break
    sonuc[n]=bul
    print('#',n,bul,flush=True)
print('BULUNAN',sum(1 for v in sonuc.values() if v),'/',len(sonuc))
print('SONUC_JSON',json.dumps(sonuc,ensure_ascii=False))
