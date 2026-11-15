# Secdem – iOS (App Store) rehberi

Uygulamanın iOS sürümü, Android ile **aynı kod tabanından** (Capacitor) üretilir. iOS paketini yalnızca Apple’ın macOS araçlarıyla derlemek mümkündür; bu yüzden derleme GitHub’ın macOS makinesinde (`.github/workflows/build-ios.yml`) yapılır. Bu dosya, yayın için sizin yapmanız gerekenleri ve akışın nasıl çalıştığını anlatır.

## 1. Sizin yapmanız gerekenler (Apple hesabı zorunlu)
1. **Apple Developer Program** üyeliği: yıllık 99 USD, kimlik doğrulaması (bireysel için birkaç gün sürebilir). developer.apple.com/programs
2. **Bundle ID** oluşturun: Certificates, Identifiers & Profiles → Identifiers → `com.nurvakti.namazvekuran` (Capabilities: *Push Notifications gerekmez*; yerel bildirim için ek yetki gerekmez).
3. **App Store Connect’te uygulamayı oluşturun**: appstoreconnect.apple.com → Apps → + → Yeni uygulama (Ad: *Secdem: Ezan ve Namaz Vakti*, Dil: Türkçe, Bundle ID: `com.nurvakti.namazvekuran`, SKU: `secdem-ios`). Tüm metinler: `yayin/app-store-metinleri.md`.
4. **Dağıtım sertifikası (Apple Distribution)**: Mac olmadan da üretilebilir (aşağıda “Mac’siz sertifika”).
5. **Provisioning profile**: Profiles → + → *App Store Connect* → Bundle ID’yi seçin → sertifikayı seçin → indirin (`.mobileprovision`).
6. **App Store Connect API anahtarı**: Users and Access → Integrations → App Store Connect API → anahtar oluşturun (rol: *App Manager*). `.p8` dosyasını, *Key ID*’yi ve *Issuer ID*’yi kaydedin.
7. **AdMob’da iOS uygulaması** (aynı AdMob hesabı kullanılır, ama Android kimlikleri iOS’ta çalışmaz):
   - AdMob → Uygulamalar → *Uygulama ekle* → Platform: **iOS** → App Store’da yayında mı: önce *Hayır* (yayınlandıktan sonra mağazaya bağlarsınız).
   - Oluşan **Uygulama kimliği** `ca-app-pub-…~…` biçimindedir.
   - Bu uygulamada iki reklam birimi açın: **Banner** ve **Geçiş (Interstitial)**. Kimlikleri `ca-app-pub-…/…` biçimindedir.
   - Gizlilik ve mesajlaşma → iOS uygulaması için GDPR mesajını ve **IDFA açıklama mesajını** (ATT öncesi) yayınlayın.
   - Üç kimliği GitHub → Settings → Secrets and variables → Actions → **Variables** sekmesine girin (bunlar gizli değildir):
     | Değişken | Örnek biçim |
     |---|---|
     | `IOS_ADMOB_APP_ID` | `ca-app-pub-3204109869365538~XXXXXXXXXX` |
     | `IOS_ADMOB_BANNER` | `ca-app-pub-3204109869365538/XXXXXXXXXX` |
     | `IOS_ADMOB_INTERSTITIAL` | `ca-app-pub-3204109869365538/XXXXXXXXXX` |
   - Üçü de tanımlı değilse iOS derlemesi Google’ın **test reklamlarını** kullanır (derleme günlüğünde uyarı çıkar). Test reklamlı sürümü App Store’a göndermeyin.
   - `app-ads.txt`: dronopter.com.tr kök dizininde Android için koyduğunuz satır iOS’u da kapsar; App Store’daki “Pazarlama URL’si” olarak dronopter.com.tr girilmelidir.

### GitHub gizli anahtarları (Settings → Secrets and variables → Actions)
| Ad | Değer |
|---|---|
| `IOS_CERT_P12_BASE64` | Dağıtım sertifikası `.p12` dosyasının base64’ü |
| `IOS_CERT_PASSWORD` | `.p12` şifresi |
| `IOS_PROVISION_PROFILE_BASE64` | `.mobileprovision` dosyasının base64’ü |
| `APPLE_TEAM_ID` | Apple Developer → Membership → Team ID |
| `ASC_KEY_ID` | API anahtarının Key ID’si |
| `ASC_ISSUER_ID` | API Issuer ID |
| `ASC_KEY_P8_BASE64` | `.p8` dosyasının base64’ü |

Base64 üretmek için (Mac/Linux): `base64 -i dosya.p12 | pbcopy` (Linux: `base64 -w0 dosya.p12`). Dosya içeriklerini sohbete veya depoya yapıştırmayın; yalnızca GitHub’daki gizli anahtar alanına girin.

### Mac’siz sertifika (OpenSSL ile)
```
openssl genrsa -out dagitim.key 2048
openssl req -new -key dagitim.key -out dagitim.csr -subj "/CN=Secdem/emailAddress=EPOSTANIZ"
```
Apple Developer → Certificates → + → *Apple Distribution* → `dagitim.csr` dosyasını yükleyin → inen `distribution.cer` dosyasını alın, sonra:
```
openssl x509 -inform DER -in distribution.cer -out distribution.pem
openssl pkcs12 -export -inkey dagitim.key -in distribution.pem -out dagitim.p12
```
(`dagitim.key` dosyasını güvenle saklayın; kaybederseniz yeni sertifika gerekir.)

## 2. Derleme akışı
GitHub → Actions → **iOS derle** → *Run workflow*.
- **Gizli anahtarlar yokken:** yalnızca imzasız *simülatör* derlemesi yapılır. Bu, kodun iOS’ta derlendiğini doğrular; telefona kurulabilir bir dosya üretmez.
- **Gizli anahtarlar tanımlıyken:** imzalı arşiv ve IPA üretilir (`Secdem-IPA` çıktısı), ardından **TestFlight**’a yüklenir. Yükleme sonrası uygulama, App Store Connect → TestFlight bölümünde (işleme için 10-30 dk sonra) görünür.
- Telefonda denemek için **TestFlight** uygulamasını kurup kendinizi dahili test kullanıcısı olarak ekleyin; Apple incelemesi gerekmez.

## 3. App Store için gerekenler
- **Ekran görüntüleri:** hazır: `yayin/gorseller/app-store/6.9-inch/{tr,en,ar,de}` (1320×2868) ve `6.5-inch/` (1284×2778), her dilde 8 adet.
- **Simge:** 1024×1024, saydamlık yok (derlemede otomatik yerleştirilir).
- **Metinler:** `yayin/app-store-metinleri.md` (4 dilde ad, alt başlık, anahtar kelimeler, açıklama, gizlilik cevapları, inceleme notu).
- **Gizlilik politikası URL’si:** Android’dekiyle aynı.
- **Uygulama gizlilik (Privacy Nutrition Labels):** Konum (uygulama işlevi, kullanıcıya bağlı değil), Reklam kimliği ve kullanım verisi (AdMob – reklam amaçlı). Fotoğraflar cihazda kalır, toplanmaz.
- **Yaş derecelendirmesi:** Android’deki anket cevaplarıyla aynı (tüm yaşlara uygun). “Reklam gösteriyor: Evet”.
- **İnceleme notu:** Apple’a “Uygulama internet gerektiren özellikleri (vakit, ses, cami) dışında çevrimdışı çalışır; mezar taşı OCR’ı cihazda yapılır” yazmanız faydalı olur. Apple, “yalnızca web sitesi sarmalayan” uygulamaları (Kural 4.2) reddedebilir; bu uygulamanın yerel bildirim, konum, kamera, pusula gibi gerçek yetenekleri var, bunları inceleme notunda belirtin.

## 4. iOS’a özgü farklar (kodda yapıldı)
- Bildirim kanalı Android’e özgüdür; iOS’ta kullanılmaz. iOS en çok **64** bekleyen yerel bildirime izin verir; uygulama bunu aşmamak için daha az bildirim planlar.
- Kıble pusulası için iOS’ta **hareket sensörü izni** istenir.
- Reklamlar için **App Tracking Transparency** penceresi ve AdMob onay (UMP) penceresi gösterilir.
- iPhone ve dikey yön ile sınırlıdır (iPad desteği yok; istenirse ayrıca tasarlanır).
- Vakit bildirim sesi derlemede `vakit.mp3` → `vakit.caf` çevrilip pakete eklenir (6 sn; iOS sınırı 30 sn).
- Android’e özgü olanlar iOS’ta yok: ana ekran widget’ı, bildirim çubuğundaki kalıcı vakit kartı, uygulama içi güncelleme penceresi. iOS’ta her vakit için ayrı bildirim gelir.
- Reklam: ana sayfada reklam yok; banner yalnızca iç sayfalarda görünür (Android ile aynı).
- Sürüm: `MARKETING_VERSION` derlemede Android sürümüyle (şu an 2.2) eşitlenir; derleme numarası GitHub çalıştırma numarasıdır.

## 5. Bilinen riskler
- iOS derlemesini bu ortamda (Linux) çalıştıramıyorum; ilk gerçek doğrulama GitHub macOS makinesindeki derlemedir. Hata çıkarsa düzeltilir.
- İmzalı IPA ve TestFlight yükleme adımları, Apple hesabınız olmadan denenemedi; gizli anahtarları girdikten sonra ilk çalıştırmada küçük ayarlar gerekebilir.
- Kur’an sesi için kullanılan harici siteler ve ayet metni lisansı iOS için de aynı şekilde geçerlidir (bkz. `magaza-metinleri.md` bölüm 11).
