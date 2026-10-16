import json,re,time,urllib.request,unicodedata
from concurrent.futures import ThreadPoolExecutor
ad=json.load(open('k/isimler.json'))
def asc(t):
    t=t.replace('İ','i').replace('I','ı').lower()
    for a,b in [('ı','i'),('ş','s'),('ğ','g'),('ü','u'),('ö','o'),('ç','c'),('â','a'),('î','i'),('û','u'),("'",''),('’','')]: t=t.replace(a,b)
    t=unicodedata.normalize('NFD',t); t=''.join(c for c in t if unicodedata.category(c)!='Mn')
    return re.sub(r'[^a-z0-9]+','-',t).strip('-')
def al(u,t=45):
    for k in range(2):
        try:
            r=urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'nurvakti-link-check'}),timeout=t)
            return r.read().decode('utf-8','ignore')
        except Exception as e: time.sleep(2)
    return ''
def isle(n):
    k='allah' if n=='Allah' else asc(re.sub(r'^(el|er|es|ez|en|ed|et|eş)-','',n,flags=re.I))
    taban=k[:-1] if k.endswith(('yy','vv','zz','ll')) else k
    if k=='zul-celali-vel-ikram': taban='zul'
    if k=='malikul-mulk': taban='malik'
    if k=='muntekim': taban='munt'
    h=al('https://web.archive.org/cdx/search/cdx?url=islamansiklopedisi.org.tr/'+taban+'&matchType=prefix&filter=statuscode:200&fl=original&collapse=urlkey&limit=400')
    sluglar=sorted(set(m.lower() for m in re.findall(r'islamansiklopedisi\.org\.tr(?::80)?/([A-Za-z0-9\-]+)/?\s*$',h,re.M)))
    return n,k,sluglar
with ThreadPoolExecutor(8) as ex: R=list(ex.map(isle,ad))
for n,k,s in R: print('ADAY',n,k,s,flush=True)
print('SONUC_JSON',json.dumps({n:s for n,k,s in R},ensure_ascii=False))
