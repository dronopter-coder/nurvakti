# Sabah yapılacaklar (sırayla)

## 1. Yayın paketini (AAB) indirin
GitHub → **Actions** → en üstteki yeşil “APK ve AAB derle” çalıştırması (`main` dalı) → en alttaki **Artifacts** → **NurVakti-AAB** (zip; içinden `app-release.aab` çıkar). Telefonda denemek için **NurVakti-APK**.
> AAB görünmüyorsa `KEYSTORE_BASE64` gizli anahtarı tanımlı değildir (Settings → Secrets and variables → Actions). Daha önce görünüyordu.

## 2. Gizlilik politikasını yayınlayın (zorunlu)
1. `docs/gizlilik.html` dosyasındaki üç yeri doldurun (GitHub’da dosyayı açıp kalem simgesiyle düzenleyin):
   - `[GELİŞTİRİCİ ADI / UNVANI]` (1 yer)
   - `[E-POSTA ADRESİ]` (2 yer)
2. GitHub → Settings → **Pages** → Source: *Deploy from a branch* → Branch: `main`, Folder: `/docs` → Save.
3. 1-2 dakika sonra şu adres açılmalı: `https://dronopter-coder.github.io/nurvakti/gizlilik.html`
   (Uygulamadaki “Gizlilik politikası” düğmesi de bu adrese gider. Kullanıcı adınız farklıysa `www/hakkinda.js` içindeki adresi değiştirin.)

## 3. Play Console’da uygulamayı oluşturun
- Yeni uygulama → Ad: `Nur Vakti: Namaz ve Kur'an` · Dil: Türkçe · Uygulama · Ücretsiz.
- Metinler: `yayin/magaza-metinleri.md` ve `yayin/uzun-aciklama.txt`.
- Görseller: `yayin/gorseller/` (simge, tanıtım görseli, ekran görüntüleri).
- Formlar: “Uygulama içeriği” bölümünde gizlilik politikası URL’si, reklamlar (Evet), hedef kitle, veri güvenliği, içerik derecelendirme, hassas izinler — cevaplar `magaza-metinleri.md` içinde.

## 4. AAB’yi yükleyin
Önce **Dahili test** (en hızlısı): Test → Dahili test → Yeni sürüm → `app-release.aab` yükleyin → test kullanıcılarını (e-posta listesi) ekleyin. Play App Signing’i **kabul edin** (yüklediğiniz anahtar “yükleme anahtarı” olur).

## 5. AdMob’da reklam onay mesajını tanımlayın (AB/İngiltere için)
AdMob → **Gizlilik ve mesajlaşma** → GDPR mesajı oluşturup uygulamanıza bağlayın → Yayınlayın. Tanımlanmazsa AB’deki kullanıcılara reklam gösterilmez (uygulama çalışmaya devam eder). Uygulama kimliği: `ca-app-pub-3204109869365538~9938336202`.
Ayrıca reklam birimlerinizin yayında olduğundan emin olun; “kod 3” uyarısı yeni birimlerde reklam henüz dolmadığında görülür.

## 6. Yayın öncesi son kontrol
- `yayin/magaza-metinleri.md` → bölüm 11’deki açık konular (ses kaynağı izni, içerik gözden geçirme, isim kontrolü, kapalı test şartı).
- Telefonda APK’yı deneyin: vakitler, Kur’an sesi, camiler (konum izni), kabir kaydı (kamera), bildirimler.
