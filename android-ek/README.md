Android derlemesinde (`.github/workflows/build-apk.yml`) `android/` her seferinde yeniden üretildiği için
uygulamaya özel yerli kodlar burada tutulur ve derleme sırasında kopyalanır:

- `PusulaPlugin.java`: kıble pusulası için yön sensörü eklentisi (JS'te `Capacitor.Plugins.Pusula`).
- `NurYerliPlugin.java`: bildirim ayarları ekranını açma ve widget verisini kaydetme (`Capacitor.Plugins.NurYerli`).
- `VakitWidget.java` ve `res/`: sıradaki vakte kalan süreyi gösteren ana ekran widget'ı.
- `MainActivity.java`: eklentileri kaydeden ana etkinlik.
