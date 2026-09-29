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
