package com.nurvakti.namazvekuran;

import android.content.Context;
import android.content.Intent;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import androidx.core.app.NotificationManagerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** Uygulamaya özel yerli işler: bildirim ayarları ekranı ve ana ekran widget'ının verisi. */
@CapacitorPlugin(name = "NurYerli")
public class NurYerliPlugin extends Plugin {

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
