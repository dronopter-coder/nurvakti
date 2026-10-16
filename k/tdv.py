import json,re,time,urllib.request,unicodedata,sys
ad=json.load(open('k/isimler.json'))
def asc(t):
    t=t.replace('İ','i').replace('I','ı').lower()
    for a,b in [('ı','i'),('ş','s'),('ğ','g'),('ü','u'),('ö','o'),('ç','c'),('â','a'),('î','i'),('û','u'),("'",''),('’','')]: t=t.replace(a,b)
    t=unicodedata.normalize('NFD',t); t=''.join(c for c in t if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9]+','-',t).strip('-')
def al(u):
    try:
        r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0'}),timeout=20)
        return r.status,r.geturl(),r.read().decode('utf-8','ignore')
    except Exception as e: return getattr(e,'code',0),u,''
sonuc={}
for n in ad:
    k=asc(re.sub(r'^(el|er|es|ez|en|ed|et|eş|es)-','',n,flags=re.I)) if n!='Allah' else 'allah'
    adaylar=[k]
    if k.endswith(('yy','vv','zz','ll')): adaylar.append(k[:-1])
    if k=='muntekim': adaylar.append('muntakim')
    if k=='malikul-mulk': adaylar+=['malikulmulk']
    if k=='zul-celali-vel-ikram': adaylar+=['zulcelali-vel-ikram','zulcelal-vel-ikram']
    bul=None
    for b in adaylar:
        for son in ['--esma-i-husna','-esma-i-husna','--allah','']:
            u='https://islamansiklopedisi.org.tr/'+b+son
            st,son_u,h=al(u); time.sleep(.25)
            if st!=200 or not h: continue
            ti=re.search(r'<title>(.*?)</title>',h,re.S); ti=ti.group(1).strip() if ti else ''
            esma=bool(re.search(r'esm[âa]-?[iı]\s*h[üu]sn[âa]|Allah[’\']?[ıi]n isim|ilâhî isim|ilahi isim|esmâ-i hüsnâ',h,re.I))
            if 'arama' in son_u or not ti: continue
            print(n,'->',u,'|',ti,'| esma:',esma,flush=True)
            if esma: bul=b+son; break
        if bul: break
    sonuc[n]=bul
json.dump(sonuc,open('tdv-sonuc.json','w'),ensure_ascii=False,indent=0)
print('BULUNAN',sum(1 for v in sonuc.values() if v),'/',len(sonuc))
print('SONUC_JSON',json.dumps(sonuc,ensure_ascii=False))
