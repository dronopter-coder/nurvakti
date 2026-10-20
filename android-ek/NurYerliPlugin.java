package com.nurvakti.namazvekuran;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import java.util.Locale;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Uygulamaya özel yerli işler: bildirim ayarları ekranı ve ana ekran widget'ının verisi. */
@CapacitorPlugin(name = "NurYerli")
public class NurYerliPlugin extends Plugin {
    private TextToSpeech tts;
    private boolean ttsHazir = false;

    private void ttsHazirla(Runnable sonra) {
        if (tts != null && ttsHazir) { sonra.run(); return; }
        if (tts != null) { tts.shutdown(); tts = null; }
        tts = new TextToSpeech(getContext(), st -> {
            ttsHazir = st == TextToSpeech.SUCCESS;
            if (ttsHazir) {
                tts.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) {}
                    @Override public void onDone(String id) { notifyListeners("seslendirmeBitti", new JSObject()); }
                    @Override public void onError(String id) { notifyListeners("seslendirmeBitti", new JSObject()); }
                });
            }
            sonra.run();
        });
    }

    /** Duayı telefonun ses motoruyla okur: Arapça ses varsa Arapça metni, yoksa Türkçe okunuşu (yedek). */
    @PluginMethod
    public void seslendir(PluginCall call) {
        final String metin = call.getString("metin", "");
        final String yedek = call.getString("yedek", "");
        final float hiz = call.getFloat("hiz", 0.85f);
        ttsHazirla(() -> {
            if (!ttsHazir) { call.reject("Ses motoru yok"); return; }
            Locale ar = new Locale("ar");
            String dil;
            String okunacak;
            if (tts.isLanguageAvailable(ar) >= TextToSpeech.LANG_AVAILABLE) {
                tts.setLanguage(ar); dil = "ar"; okunacak = metin;
            } else {
                tts.setLanguage(new Locale("tr", "TR")); dil = "tr"; okunacak = yedek;
            }
            tts.setSpeechRate(hiz);
            tts.speak(okunacak, TextToSpeech.QUEUE_FLUSH, null, "nurvakti");
            JSObject r = new JSObject();
            r.put("dil", dil);
            call.resolve(r);
        });
    }

    @PluginMethod
    public void sesiDurdur(PluginCall call) {
        if (tts != null) tts.stop();
        call.resolve();
    }

    @Override
    protected void handleOnDestroy() {
        if (tts != null) { tts.shutdown(); tts = null; }
    }

    /** Telefonun bu uygulamaya ait bildirim ayarları ekranını açar. */
    @PluginMethod
    public void bildirimAyari(PluginCall call) {
        Context c = getContext();
        Intent i;
        if (Build.VERSION.SDK_INT >= 26) {
            i = new Intent(Settings.ACTION_APP_NOTIFICATION_SETTINGS);
            i.putExtra(Settings.EXTRA_APP_PACKAGE, c.getPackageName());
        } else {
            i = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + c.getPackageName()));
        }
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        try {
            c.startActivity(i);
        } catch (Exception e) {
            Intent j = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS, Uri.parse("package:" + c.getPackageName()));
            j.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(j);
        }
        call.resolve();
    }

    /** Play Store'da uygulamanın sayfasını açar (puan ve yorum için). */
    @PluginMethod
    public void magazayiAc(PluginCall call) {
        Context c = getContext();
        String pk = c.getPackageName();
        try {
            Intent i = new Intent(Intent.ACTION_VIEW, Uri.parse("market://details?id=" + pk));
            i.setPackage("com.android.vending");
            i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(i);
        } catch (Exception e) {
            Intent j = new Intent(Intent.ACTION_VIEW, Uri.parse("https://play.google.com/store/apps/details?id=" + pk));
            j.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            c.startActivity(j);
        }
        call.resolve();
    }

    /** Uygulamanın bildirimleri sistemde açık mı? */
    @PluginMethod
    public void bildirimDurumu(PluginCall call) {
        JSObject r = new JSObject();
        r.put("acik", NotificationManagerCompat.from(getContext()).areNotificationsEnabled());
        call.resolve(r);
    }

    /** Widget için önümüzdeki günlerin vakitlerini saklar ve widget'ı yeniler. veri: {"yer":"…","v":[{"a":"İkindi","t":1760000000000},…]} */
    @PluginMethod
    public void vidjetKaydet(PluginCall call) {
        String veri = call.getString("veri");
        if (veri != null) {
            getContext().getSharedPreferences(VakitWidget.TERCIH, Context.MODE_PRIVATE).edit().putString("veri", veri).apply();
            VakitWidget.hepsiniGuncelle(getContext());
        }
        call.resolve();
    }
}
