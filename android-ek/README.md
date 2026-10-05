Android derlemesinde (`.github/workflows/build-apk.yml`) `android/` her seferinde yeniden üretildiği için
uygulamaya özel yerli kodlar burada tutulur ve derleme sırasında kopyalanır:

- `PusulaPlugin.java`: kıble pusulası için yerli yön sensörü eklentisi (JS'te `Capacitor.Plugins.Pusula`).
- `MainActivity.java`: eklentiyi kaydeden ana etkinlik.
