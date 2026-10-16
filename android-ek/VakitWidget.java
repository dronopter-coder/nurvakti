package com.nurvakti.namazvekuran;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.SystemClock;
import android.widget.RemoteViews;
import org.json.JSONArray;
import org.json.JSONObject;

/** Ana ekran widget'ı: sıradaki namaz vaktine kalan süreyi canlı geri sayımla gösterir. */
public class VakitWidget extends AppWidgetProvider {
    static final String TERCIH = "nur_vidjet";
    static final String TAZELE = "com.nurvakti.namazvekuran.VIDJET_TAZELE";

    @Override
    public void onUpdate(Context c, AppWidgetManager m, int[] ids) {
        for (int id : ids) ciz(c, m, id);
        alarmKur(c);
    }

    @Override
    public void onReceive(Context c, Intent i) {
        super.onReceive(c, i);
        String a = i.getAction();
        if (TAZELE.equals(a) || Intent.ACTION_TIME_CHANGED.equals(a) || Intent.ACTION_TIMEZONE_CHANGED.equals(a)
                || Intent.ACTION_BOOT_COMPLETED.equals(a) || Intent.ACTION_MY_PACKAGE_REPLACED.equals(a)) {
            hepsiniGuncelle(c);
        }
    }

    static void hepsiniGuncelle(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        int[] ids = m.getAppWidgetIds(new ComponentName(c, VakitWidget.class));
        for (int id : ids) ciz(c, m, id);
        if (ids.length > 0) alarmKur(c);
    }

    /** Sıradaki vakit: [ad, zaman(ms), sonrakininAdı, sonrakininZamanı, yer] */
    private static Object[] siradaki(Context c) {
        try {
            String s = c.getSharedPreferences(TERCIH, Context.MODE_PRIVATE).getString("veri", null);
            if (s == null) return null;
            JSONObject o = new JSONObject(s);
            JSONArray v = o.getJSONArray("v");
            long simdi = System.currentTimeMillis();
            for (int k = 0; k < v.length(); k++) {
                JSONObject x = v.getJSONObject(k);
                long t = x.getLong("t");
                if (t > simdi) {
                    String sAd = null; long sT = 0;
                    if (k + 1 < v.length()) { sAd = v.getJSONObject(k + 1).getString("a"); sT = v.getJSONObject(k + 1).getLong("t"); }
                    return new Object[]{x.getString("a"), t, sAd, sT, o.optString("yer", "")};
                }
            }
        } catch (Exception ignored) {}
        return null;
    }

    private static String saat(long t) {
        java.util.Calendar k = java.util.Calendar.getInstance();
        k.setTimeInMillis(t);
        return String.format(java.util.Locale.ROOT, "%02d:%02d", k.get(java.util.Calendar.HOUR_OF_DAY), k.get(java.util.Calendar.MINUTE));
    }

    private static void ciz(Context c, AppWidgetManager m, int id) {
        RemoteViews r = new RemoteViews(c.getPackageName(), R.layout.vakit_widget);
        Object[] s = siradaki(c);
        if (s == null) {
            r.setTextViewText(R.id.vw_baslik, "Vakitleri almak için");
            r.setTextViewText(R.id.vw_alt, "uygulamayı bir kez açın");
            r.setTextViewText(R.id.vw_yer, "");
            r.setChronometer(R.id.vw_sayac, SystemClock.elapsedRealtime(), "––:––", false);
        } else {
            String ad = (String) s[0];
            long t = (Long) s[1];
            r.setTextViewText(R.id.vw_baslik, "Güneş".equals(ad) ? "Güneşin doğmasına" : ad + " vaktine");
            long taban = SystemClock.elapsedRealtime() + (t - System.currentTimeMillis());
            r.setChronometer(R.id.vw_sayac, taban, null, true);
            r.setChronometerCountDown(R.id.vw_sayac, true);
            String alt = ad + " " + saat(t);
            if (s[2] != null) alt += "   ·   " + s[2] + " " + saat((Long) s[3]);
            r.setTextViewText(R.id.vw_alt, alt);
            r.setTextViewText(R.id.vw_yer, (String) s[4]);
        }
        Intent ac = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
        if (ac != null) {
            r.setOnClickPendingIntent(R.id.vw_kok, PendingIntent.getActivity(c, 0, ac, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT));
        }
        m.updateAppWidget(id, r);
    }

    /** Vakit girdiği anda widget'ı bir sonraki vakte geçirmek için alarm kurar. */
    private static void alarmKur(Context c) {
        Object[] s = siradaki(c);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        Intent i = new Intent(c, VakitWidget.class).setAction(TAZELE);
        PendingIntent pi = PendingIntent.getBroadcast(c, 7, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
        am.cancel(pi);
        if (s == null) return;
        long t = (Long) s[1] + 1000;
        try {
            if (Build.VERSION.SDK_INT < 31 || am.canScheduleExactAlarms()) am.setExactAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
            else am.setAndAllowWhileIdle(AlarmManager.RTC_WAKEUP, t, pi);
        } catch (SecurityException e) {
            am.set(AlarmManager.RTC_WAKEUP, t, pi);
        }
    }
}
