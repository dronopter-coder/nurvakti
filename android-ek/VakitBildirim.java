package com.nurvakti.namazvekuran;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import java.util.Calendar;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Bildirim çubuğundaki kalıcı vakit bildirimi: sıradaki vakte geri sayım ve o günün bütün vakitleri.
 * Veriyi widget ile aynı yerden (VakitWidget.TERCIH / "veri") okur; vakit girdikçe VakitWidget'ın alarmıyla yenilenir.
 */
public class VakitBildirim {
    static final int NO = 4242;
    static final String KANAL = "vakit_kalici";

    private static SharedPreferences tercih(Context c) {
        return c.getSharedPreferences(VakitWidget.TERCIH, Context.MODE_PRIVATE);
    }

    static boolean acik(Context c) {
        return tercih(c).getBoolean("kalici", true);
    }

    private static String saat(long t) {
        Calendar k = Calendar.getInstance();
        k.setTimeInMillis(t);
        return String.format(Locale.ROOT, "%02d:%02d", k.get(Calendar.HOUR_OF_DAY), k.get(Calendar.MINUTE));
    }

    private static int gun(long t) {
        Calendar k = Calendar.getInstance();
        k.setTimeInMillis(t);
        return k.get(Calendar.YEAR) * 1000 + k.get(Calendar.DAY_OF_YEAR);
    }

    static void guncelle(Context c) {
        NotificationManagerCompat nm = NotificationManagerCompat.from(c);
        String s = tercih(c).getString("veri", null);
        if (!acik(c) || s == null || !nm.areNotificationsEnabled()) { nm.cancel(NO); return; }
        try {
            JSONObject o = new JSONObject(s);
            JSONArray v = o.getJSONArray("v");
            long simdi = System.currentTimeMillis();
            int k = -1;
            for (int i = 0; i < v.length(); i++) if (v.getJSONObject(i).getLong("t") > simdi) { k = i; break; }
            if (k < 0) { nm.cancel(NO); return; }
            JSONObject x = v.getJSONObject(k);
            long t = x.getLong("t");
            // sıradaki vaktin gününe ait altı vakit; sıradaki işaretli
            StringBuilder liste = new StringBuilder();
            int n = 0, g = gun(t);
            for (int j = 0; j < v.length(); j++) {
                JSONObject y = v.getJSONObject(j);
                long ty = y.getLong("t");
                if (gun(ty) != g) continue;
                if (n > 0) liste.append(n % 3 == 0 ? "\n" : "    ");
                liste.append(j == k ? "▸ " : "").append(y.getString("a")).append(' ').append(saat(ty));
                n++;
            }
            String yer = o.optString("yer", "");
            if (Build.VERSION.SDK_INT >= 26) {
                NotificationChannel ch = new NotificationChannel(KANAL, tercih(c).getString("kanal", "Günlük vakitler"), NotificationManager.IMPORTANCE_LOW);
                ch.setShowBadge(false);
                ch.setSound(null, null);
                ch.enableVibration(false);
                c.getSystemService(NotificationManager.class).createNotificationChannel(ch);
            }
            Intent ac = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
            NotificationCompat.Builder b = new NotificationCompat.Builder(c, KANAL)
                    .setSmallIcon(R.drawable.ic_stat_secdem)
                    .setColor(0xFFE8862A)
                    .setContentTitle(x.optString("b", x.getString("a")))
                    .setContentText(x.getString("a") + " " + saat(t) + (yer.isEmpty() ? "" : "  ·  " + yer))
                    .setStyle(new NotificationCompat.BigTextStyle().bigText(liste.toString()))
                    .setWhen(t)
                    .setShowWhen(true)
                    .setUsesChronometer(true)
                    .setChronometerCountDown(true)
                    .setOngoing(true)
                    .setOnlyAlertOnce(true)
                    .setSilent(true)
                    .setLocalOnly(true) // saate kalıcı bildirim gönderilmez; vakit girdiğindeki bildirim gider
                    .setPriority(NotificationCompat.PRIORITY_LOW)
                    .setVisibility(NotificationCompat.VISIBILITY_PUBLIC);
            if (ac != null) b.setContentIntent(PendingIntent.getActivity(c, 1, ac, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT));
            nm.notify(NO, b.build());
        } catch (SecurityException ignored) {
        } catch (Exception ignored) {}
    }
}
