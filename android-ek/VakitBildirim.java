package com.nurvakti.namazvekuran;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.widget.RemoteViews;
import androidx.core.app.NotificationCompat;
import androidx.core.app.NotificationManagerCompat;
import java.util.Calendar;
import java.util.Locale;
import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Bildirim çubuğundaki kalıcı vakit bildirimi: widget'taki halka, sıradaki vakte geri sayım ve o günün vakitleri tablosu.
 * Veriyi widget ile aynı yerden (VakitWidget.TERCIH / "veri") okur; vakit girdikçe VakitWidget'ın alarmıyla yenilenir.
 */
public class VakitBildirim {
    static final int NO = 4242;
    static final String KANAL = "vakit_kalici";
    private static final int[] HUCRE = {R.id.nb_h0, R.id.nb_h1, R.id.nb_h2, R.id.nb_h3, R.id.nb_h4, R.id.nb_h5};
    private static final int[] AD = {R.id.nb_a0, R.id.nb_a1, R.id.nb_a2, R.id.nb_a3, R.id.nb_a4, R.id.nb_a5};
    private static final int[] SAAT = {R.id.nb_s0, R.id.nb_s1, R.id.nb_s2, R.id.nb_s3, R.id.nb_s4, R.id.nb_s5};

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
            // sıradaki vaktin gününe ait altı vakit (tabloda sıradaki altın çerçeveli, geçenler soluk)
            int g = gun(t);
            java.util.List<JSONObject> gunluk = new java.util.ArrayList<>();
            int sira = -1;
            for (int j = 0; j < v.length(); j++) {
                JSONObject y = v.getJSONObject(j);
                if (gun(y.getLong("t")) != g) continue;
                if (j == k) sira = gunluk.size();
                gunluk.add(y);
            }
            long once = k > 0 ? v.getJSONObject(k - 1).getLong("t") : t - 6L * 3600000L;
            float oran = t > once ? Math.max(0f, Math.min(1f, (float) (simdi - once) / (float) (t - once))) : 0f;
            String yer = o.optString("yer", "");
            if (Build.VERSION.SDK_INT >= 26) {
                NotificationChannel ch = new NotificationChannel(KANAL, tercih(c).getString("kanal", "Günlük vakitler"), NotificationManager.IMPORTANCE_LOW);
                ch.setShowBadge(false);
                ch.setSound(null, null);
                ch.enableVibration(false);
                c.getSystemService(NotificationManager.class).createNotificationChannel(ch);
            }
            String baslik = x.optString("b", x.getString("a")), vakit = x.getString("a") + " " + saat(t);
            long taban = android.os.SystemClock.elapsedRealtime() + (t - simdi);
            RemoteViews kucuk = new RemoteViews(c.getPackageName(), R.layout.nb_kucuk);
            RemoteViews buyuk = new RemoteViews(c.getPackageName(), R.layout.nb_buyuk);
            android.graphics.Bitmap halka = VakitWidget.halka(138, oran, (simdi / 10000L) % 360);
            for (RemoteViews r : new RemoteViews[]{kucuk, buyuk}) {
                r.setImageViewBitmap(R.id.nb_halka, halka);
                r.setTextViewText(R.id.nb_baslik, baslik);
                r.setChronometer(R.id.nb_sayac, taban, null, true);
                if (Build.VERSION.SDK_INT >= 24) r.setChronometerCountDown(R.id.nb_sayac, true);
                r.setTextViewText(R.id.nb_vakit, vakit);
                r.setTextViewText(R.id.nb_yer, yer);
            }
            buyuk.setProgressBar(R.id.nb_ilerleme, 1000, Math.round(oran * 1000), false);
            for (int i = 0; i < HUCRE.length; i++) {
                if (i >= gunluk.size()) { buyuk.setViewVisibility(HUCRE[i], android.view.View.GONE); continue; }
                JSONObject y = gunluk.get(i);
                boolean on = i == sira, gecti = sira >= 0 && i < sira;
                buyuk.setViewVisibility(HUCRE[i], android.view.View.VISIBLE);
                buyuk.setInt(HUCRE[i], "setBackgroundResource", on ? R.drawable.nb_hucre_on : R.drawable.nb_hucre);
                buyuk.setTextViewText(AD[i], y.getString("a"));
                buyuk.setTextViewText(SAAT[i], saat(y.getLong("t")));
                buyuk.setTextColor(AD[i], on ? 0xFFE6C77E : gecti ? 0xFF5E6688 : 0xFF9AA1BD);
                buyuk.setTextColor(SAAT[i], on ? 0xFFF3D999 : gecti ? 0xFF6F779A : 0xFFF4EEDD);
            }
            Intent ac = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
            NotificationCompat.Builder b = new NotificationCompat.Builder(c, KANAL)
                    .setSmallIcon(R.drawable.ic_stat_secdem)
                    .setColor(0xFFE8862A)
                    .setContentTitle(baslik)
                    .setContentText(vakit + (yer.isEmpty() ? "" : "  ·  " + yer)) // kilit ekranı gizli sürümü ve saat için düz metin
                    .setCustomContentView(kucuk)
                    .setCustomBigContentView(buyuk)
                    .setStyle(new NotificationCompat.DecoratedCustomViewStyle())
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
