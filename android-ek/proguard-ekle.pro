# Secdem: R8 kod küçültme/karartma açıkken korunması gerekenler.
# Capacitor, eklenti sınıflarını ve @PluginMethod yöntemlerini yansıma (reflection) ile bulur;
# web görünümü köprüsü @JavascriptInterface yöntemlerini adıyla çağırır.
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod,Exceptions
-keep class com.getcapacitor.** { *; }
-keep @com.getcapacitor.annotation.CapacitorPlugin class * { *; }
-keep class com.capacitorjs.plugins.** { *; }
-keep class com.getcapacitor.community.** { *; }
-keep class com.nurvakti.namazvekuran.** { *; }
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
    @com.getcapacitor.PluginMethod <methods>;
}
