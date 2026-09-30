# Nûr Vakti

1. Bu klasörü yeni bir GitHub deposuna yükle (branch: main).
2. Actions sekmesi > "APK derle" iş akışı otomatik çalışır (yaklaşık 5-8 dk).
3. Bitince çalıştırmanın altındaki **NurVakti-APK** çıktısını indir, zip içindeki app-debug.apk'yı telefona kur.

## AdMob
- Şimdilik Google TEST reklam kodları kullanılıyor.
- Gerçek kodlar için: `www/index.html` içindeki `AD` bloğunda `banner` ve `interstitial` ID'lerini değiştir, `testing:false` yap.
- Uygulama ID'si (ca-app-pub-...~...) için GitHub > Settings > Secrets and variables > Actions > `ADMOB_APP_ID` secret'ı ekle.

## Yerelde derleme
npm install && npx cap add android && npx cap sync android, sonra Android Studio ile aç (manifest yamalarını workflow'daki gibi uygula).

## Kabir modülü (mezarlık hizmeti)
- **Kabir** sekmesinden mezar taşının fotoğrafı çekilir/seçilir. Taştaki ad ve tarihler cihazda (Tesseract OCR, `www/ocr/`, internet gerekmez) okunur, form önceden doldurulur; kullanıcı doğrular ve kaydeder. Fotoğraf hiçbir yere gönderilmez.
- Kayıtlar (bilgi: localStorage, fotoğraf: IndexedDB) yalnızca telefonda tutulur. Mezar konumu (GPS) kaydedilebilir.
- **Cuma okuması:** Fâtiha ve Yâsîn (Arapça, `www/okuma.js`, Amiri Quran yazı tipi `www/fonts/`) niyet ve dua ile birlikte okunur; okunan kabirler o Cuma için işaretlenir. Cuma 09:00 ve Perşembe 20:00 haftalık hatırlatma bildirimi vardır (Ayarlar'dan kapatılır).
- OCR taş durumuna göre hatalı olabilir; bu yüzden sonuç her zaman düzenlenebilir.
- **Sesli okuma:** Okuma ekranındaki "Dinle" düğmesi Fâtiha ve Yâsîn'i Mişari Raşid el-Afasi kaydıyla ayet ayet çalar (everyayah.com, yedek: cdn.islamic.network; internet gerekir), okunan ayet vurgulanır, bir ayete dokunulunca oradan devam eder. Dua telefonun Türkçe sesiyle okunur.
- Ana ekran başlığı sûfî üslupta: Aref Ruqaa ve Cinzel Decorative (her ikisi OFL, `www/fonts/`).
- **Namaz takibi** (`www/takip.js`): vakit ekranında günün 5 namazını işaretleme, son 7 gün özeti, kaza sayacı (yalnızca cihazda).
- **Kabir:** yakın kabir uyarısı (yalnızca uygulama açıkken, 300 m), Cuma serisi, vefat yıldönümü ve kandil/arefe bildirimleri (Ayarlar'dan kapatılır), "Hayırlı Cumalar" mesajı paylaşımı, okuma hızı (0,8× / 1× / 1,25× / 1,5×).
