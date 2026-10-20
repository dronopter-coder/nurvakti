package com.nurvakti.namazvekuran;

import android.app.AlarmManager;
import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.RectF;
import android.os.Build;
import android.os.Bundle;
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
    public void onAppWidgetOptionsChanged(Context c, AppWidgetManager m, int id, Bundle o) {
        ciz(c, m, id);
    }

    @Override
    public void onDisabled(Context c) {
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am != null) { am.cancel(pi(c, 7)); am.cancel(pi(c, 8)); }
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

    /** Sıradaki vakit: [ad, zaman(ms), sonrakininAdı, sonrakininZamanı, yer, öncekininZamanı] */
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
                    long once = k > 0 ? v.getJSONObject(k - 1).getLong("t") : t - 6L * 3600000L;
                    return new Object[]{x.getString("a"), t, sAd, sT, o.optString("yer", ""), once, x.optString("b", "")};
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

    /** Ana ekrandaki halkanın aynısı: dönen yıldız (iki kare + iki daire) ve vakte yaklaştıkça dolan altın ibre. */
    static Bitmap halka(int px, float oran, float aci) {
        Bitmap b = Bitmap.createBitmap(px, px, Bitmap.Config.ARGB_8888);
        Canvas cv = new Canvas(b);
        float k = px / 200f, mx = px / 2f;
        Paint p = new Paint(Paint.ANTI_ALIAS_FLAG);
        p.setStyle(Paint.Style.STROKE);
        // yıldız
        p.setColor(0x8CC9A45C);
        p.setStrokeWidth(1.1f * k);
        cv.save();
        cv.rotate(aci, mx, mx);
        RectF kare = new RectF(38 * k, 38 * k, 162 * k, 162 * k);
        cv.drawRect(kare, p);
        cv.save(); cv.rotate(45, mx, mx); cv.drawRect(kare, p); cv.restore();
        p.setColor(0x55C9A45C);
        cv.drawCircle(mx, mx, 49 * k, p);
        cv.drawCircle(mx, mx, 12 * k, p);
        cv.restore();
        // halka ve ibre
        p.setColor(0xFF2C386C);
        p.setStrokeWidth(2.4f * k);
        cv.drawCircle(mx, mx, 95 * k, p);
        if (oran > 0) {
            p.setColor(0xFFC9A45C);
            p.setStrokeWidth(3.6f * k);
            p.setStrokeCap(Paint.Cap.ROUND);
            cv.drawArc(new RectF(mx - 95 * k, mx - 95 * k, mx + 95 * k, mx + 95 * k), -90, 360 * Math.min(1f, oran), false, p);
        }
        return b;
    }

    private static void ciz(Context c, AppWidgetManager m, int id) {
        Bundle op = m.getAppWidgetOptions(id);
        int yuk = op == null ? 0 : op.getInt(AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0);
        boolean kucuk = yuk > 0 && yuk < 100;
        RemoteViews r = new RemoteViews(c.getPackageName(), kucuk ? R.layout.vakit_widget_kucuk : R.layout.vakit_widget);
        Object[] s = siradaki(c);
        long simdi = System.currentTimeMillis();
        float aci = (simdi / 10000L) % 360;          // dakikada 6 derece döner
        if (s == null) {
            r.setTextViewText(R.id.vw_baslik, "Vakitler için uygulamayı açın");
            r.setTextViewText(R.id.vw_alt, "");
            r.setTextViewText(R.id.vw_yer, "");
            r.setChronometer(R.id.vw_sayac, SystemClock.elapsedRealtime(), "––:––", false);
            r.setImageViewBitmap(R.id.vw_halka, halka(kucuk ? 120 : 360, 0, aci));
        } else {
            String ad = (String) s[0];
            long t = (Long) s[1], once = (Long) s[5];
            String bas = (String) s[6];
            r.setTextViewText(R.id.vw_baslik, bas.isEmpty() ? ("Güneş".equals(ad) ? "Güneşin doğmasına" : ad + " vaktine") : bas);
            long taban = SystemClock.elapsedRealtime() + (t - simdi);
            r.setChronometer(R.id.vw_sayac, taban, null, true);
            r.setChronometerCountDown(R.id.vw_sayac, true);
            String alt = kucuk ? saat(t) : ad + " " + saat(t) + (s[2] != null ? "  ·  " + s[2] + " " + saat((Long) s[3]) : "");
            r.setTextViewText(R.id.vw_alt, alt);
            r.setTextViewText(R.id.vw_yer, (String) s[4]);
            float oran = t > once ? (float) (simdi - once) / (float) (t - once) : 0f;
            r.setImageViewBitmap(R.id.vw_halka, halka(kucuk ? 120 : 360, Math.max(0f, oran), aci));
        }
        Intent ac = c.getPackageManager().getLaunchIntentForPackage(c.getPackageName());
        if (ac != null) {
            r.setOnClickPendingIntent(R.id.vw_kok, PendingIntent.getActivity(c, 0, ac, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT));
        }
        m.updateAppWidget(id, r);
    }

    private static PendingIntent pi(Context c, int kod) {
        Intent i = new Intent(c, VakitWidget.class).setAction(TAZELE);
        return PendingIntent.getBroadcast(c, kod, i, PendingIntent.FLAG_IMMUTABLE | PendingIntent.FLAG_UPDATE_CURRENT);
    }

    /** Vakit girdiği anda widget'ı bir sonraki vakte geçirmek için alarm kurar. */
    private static void alarmKur(Context c) {
        Object[] s = siradaki(c);
        AlarmManager am = (AlarmManager) c.getSystemService(Context.ALARM_SERVICE);
        if (am == null) return;
        PendingIntent dk = pi(c, 8);
        am.cancel(dk);
        am.setRepeating(AlarmManager.RTC, System.currentTimeMillis() + 60000L, 60000L, dk); // halka dönsün, ibre dolsun
        PendingIntent pi = pi(c, 7);
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
