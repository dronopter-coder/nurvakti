# Nur Vakti – Google Play yayın hazırlığı

Bu dosya Play Console’u doldururken kopyalayıp yapıştıracağınız metinleri ve form cevaplarını içerir.
`[KÖŞELİ]` yerleri sizin doldurmanız gereken bilgilerdir. Play Console’daki sorular zamanla değişebilir; buradaki cevapları son soru metniyle karşılaştırarak girin.

## 1. Uygulama adı (en çok 30 karakter)
Seçenekler:
1. `Nur Vakti` (9) – en sade, marka adı
2. `Nur Vakti: Namaz ve Kur'an` (26)
3. `Nur Vakti – Vakit, Kur'an` (25)

Öneri: 2. seçenek (arama görünürlüğü için “Namaz” ve “Kur'an” kelimeleri var).

## 2. Kısa açıklama (en çok 80 karakter, 78)
```
Namaz vakitleri, kıble, Kur'an dinle, yakın cami, kabir kaydı ve Cuma okuması.
```

## 3. Uzun açıklama (en çok 4000 karakter, ~2400)
`yayin/uzun-aciklama.txt` dosyasının içeriğini olduğu gibi yapıştırın.

## 4. “Yenilikler” (ilk sürüm, en çok 500 karakter)
```
İlk sürüm: namaz vakitleri ve hatırlatmalar, kıble, tesbih, Kur'an-ı Kerim (sesli), yakındaki camiler, mezar taşı fotoğrafından kabir kaydı ve Cuma Fâtiha/Yâsîn okuması, namaz takibi, ibadet bilgileri ve çocuklar için eğitici bölüm.
```

## 5. Mağaza ayarları
- Uygulama türü: Uygulama · Ücretsiz · Reklam içerir: **Evet**
- Kategori önerisi: **Yaşam Tarzı** (alternatif: Kitaplar ve Başvuru Kaynakları)
- Etiketler: namaz vakitleri, Kur'an, kıble, tesbih, dua
- Gizlilik politikası URL’si: `https://dronopter-coder.github.io/nurvakti/gizlilik.html`
  (GitHub → Settings → Pages → Source: *Deploy from a branch*, Branch: `main`, Folder: `/docs`. Politika, `main`’e birleştirildikten sonra yayınlanır. Sayfadaki `[GELİŞTİRİCİ ADI / UNVANI]` ve `[E-POSTA ADRESİ]` yerlerini doldurmayı unutmayın.)
- İletişim e-postası: `[E-POSTA ADRESİ]`

## 6. Görseller
| Görsel | Ölçü |
|---|---|
| Uygulama simgesi | 512×512 PNG |
| Tanıtım görseli (feature graphic) | 1024×500 PNG/JPG |
| Telefon ekran görüntüleri | en az 2, en fazla 8; kısa kenar 320–3840 px |

Önerilen ekran görüntüleri: 1) Ana ekran (vakit halkası ve menü) · 2) Kur’an sûre listesi · 3) Kur’an okuma ve ses · 4) Kabir kaydı formu (mezar taşı fotoğrafı) · 5) Cuma okuma ekranı · 6) Yakın camiler (harita) · 7) İbadet konuları · 8) Çocuklar bölümü.
Görseller `yayin/gorseller/` klasöründedir (8 ekran görüntüsü 1080×2160, tanıtım görseli 1024×500, simge 512×512). Görsellerde Diyanet İşleri Başkanlığı adı, amblemi veya başka bir kurumun logosu **kullanılmamalı**.

## 7. İçerik derecelendirme anketi (IARC) – beklenen cevaplar
- Kategori: Referans / bilgilendirme veya yardımcı program (dinî içerik)
- Şiddet, korku, cinsellik, küfür, kumar, uyuşturucu: **Hayır**
- Kullanıcıların birbirine içerik gönderdiği veya iletişim kurduğu özellik: **Hayır**
- Konum paylaşımı diğer kullanıcılarla: **Hayır** (konum yalnızca kişinin kendi cihazında/işlevinde kullanılır)
- Satın alma: **Hayır** · Reklam: **Evet**
Beklenen sonuç: tüm yaşlara uygun.

## 8. Hedef kitle ve içerik
- Hedef yaş grubu önerisi: **18 yaş ve üzeri** veya “13+” (genel kullanıcı)
- “Çocuklar” bölümü bir özellik olarak sunulur; uygulama **çocuklara yönelik mağaza girişi olarak işaretlenmemelidir**. Çocuk yaş grupları (5 yaş ve altı, 6-8, 9-12) hedef kitle olarak seçilirse Google’ın Aile Politikaları geçerli olur ve reklam/SDK kuralları ciddi şekilde sıkılaşır. Bu karar sizin; ben genel kitle seçeneğini öneriyorum.
- “Reklamlar” beyanı: Evet (Google AdMob)
- Haber uygulaması / COVID / sağlık uygulaması: **Hayır**

## 9. Veri güvenliği formu – taslak cevaplar
Genel:
- Uygulama kullanıcı verisi **toplar veya paylaşır**: Evet (aşağıdakiler)
- Tüm veriler aktarım sırasında şifrelenir: **Evet** (HTTPS)
- Kullanıcılar veri silme talebinde bulunabilir: Hesap yok; veriler cihazda. “Veri silme yolu” olarak gizlilik politikasındaki Bölüm 7’yi gösterin.

| Veri türü | Toplanıyor mu | Paylaşılıyor mu | Amaç | İsteğe bağlı mı |
|---|---|---|---|---|
| Yaklaşık konum | Evet | Evet (vakit, yer adı, cami ve reklam hizmetleri) | Uygulama işlevleri, Reklam | Evet |
| Hassas konum | Evet | Evet (vakit/cami/yer adı hizmetleri) | Uygulama işlevleri | Evet |
| Cihaz veya diğer kimlikler (reklam kimliği) | Evet (AdMob) | Evet (Google) | Reklam | Hayır |
| Uygulama etkileşimleri / tanılama | Evet (AdMob) | Evet (Google) | Reklam, analiz | Hayır |
| Fotoğraflar | **Hayır** (cihazdan çıkmaz, sunucuya gönderilmez) | Hayır | – | – |
| Ad, e-posta, telefon, ödeme bilgisi | **Hayır** | Hayır | – | – |

Not: Kabir kayıtlarındaki ad/not bilgileri cihazdan çıkmadığı için “toplanan veri” sayılmaz.

## 10. Hassas izin beyanları
- **Konum:** Namaz vakitleri, kıble, yakın cami araması ve kayıtlı mezara yakınlık bildirimi için kullanılır. Yalnızca uygulama açıkken kullanılır (arka planda konum **yoktur**).
- **Kamera:** Mezar taşının fotoğrafını çekmek için.
- **Kesin alarm (SCHEDULE_EXACT_ALARM):** Namaz vakti hatırlatma bildirimlerinin vaktinde gelmesi için. Play bu izin için bir beyan formu isteyebilir; gerekçe: “Uygulamanın temel işlevi dinî vakit hatırlatmalarıdır; bildirim vaktin girdiği dakikada gelmelidir.”
- **Bildirim:** Vakit, Cuma ve önemli gün hatırlatmaları (yerel bildirim).

## 11. Durum ve açık konular
Yapıldı:
- **Reklam onayı (UMP):** Uygulamaya Google’ın onay penceresi eklendi. Penceresinin görünmesi için AdMob’da mesaj tanımlamanız gerekir (bkz. `SABAH-LISTESI.md`, adım 5). Ayrıca Ayarlar → *Hakkında ve kaynaklar* içinde “Reklam gizlilik seçenekleri” düğmesi var.
- **Kaynaklar ekranı:** Ayarlar → *Hakkında ve kaynaklar* (Tanzil, OpenStreetMap, Leaflet, Tesseract, yazı tipleri, ses kaynağı; dinî bilgi uyarısı; gizlilik politikası bağlantısı).
- Görseller `yayin/gorseller/` klasöründe hazır.

Sizin karar vermeniz / kontrol etmeniz gerekenler:
1. **Kur’an ses kaynağı:** Sesler everyayah.com ve islamic.network üzerinden çalınıyor. Reklamlı bir uygulamada kullanımın o sitelerin şartlarına uygun olduğundan emin olun; emin değilseniz kendi lisanslı kaynağınıza geçilmeli.
2. **İbadet içeriği:** Yayından önce bir din görevlisi/ilahiyatçı gözden geçirmeli.
3. **Marka/isim:** “Nur Vakti” adını Play’de ve Türk Patent’te kontrol edin.
4. **Test şartı:** Yeni kişisel geliştirici hesaplarında herkese açık yayın öncesi kapalı test şartı olabilir; Play Console’da güncel kurala bakın.
5. **Yükleme anahtarı:** AAB, `KEYSTORE_BASE64` ile imzalanıyor. Anahtarı ve şifrelerini güvenli yerde yedekleyin.
6. **Çocuklar bölümü:** Hedef kitleyi “genel” seçmeniz önerilir (bkz. bölüm 8).
