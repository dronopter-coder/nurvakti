package com.nurvakti.namazvekuran;

import android.content.Context;
import android.hardware.GeomagneticField;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.view.Surface;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Kıble pusulası: dönme vektörü sensöründen telefonun baktığı yön (azimut) hesaplanır,
 * ekran dönüşü ve manyetik sapma düzeltilerek gerçek kuzeye göre derece olarak "yon" olayıyla gönderilir.
 */
@CapacitorPlugin(name = "Pusula")
public class PusulaPlugin extends Plugin implements SensorEventListener {
    private SensorManager sm;
    private final float[] r = new float[9];
    private final float[] rr = new float[9];
    private final float[] o = new float[3];
    private float sapma = 0f;
    private int dogruluk = 3;
    private long son = 0;
    private Sensor sensor;
    private boolean aktif = false;

    @PluginMethod
    public void baslat(PluginCall call) {
        sm = (SensorManager) getContext().getSystemService(Context.SENSOR_SERVICE);
        Sensor s = sm == null ? null : sm.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR);
        if (s == null && sm != null) s = sm.getDefaultSensor(Sensor.TYPE_GEOMAGNETIC_ROTATION_VECTOR);
        if (s == null) {
            call.reject("Pusula sensörü yok");
            return;
        }
        Double lat = call.getDouble("lat");
        Double lon = call.getDouble("lon");
        if (lat != null && lon != null) {
            sapma = new GeomagneticField(lat.floatValue(), lon.floatValue(), 0f, System.currentTimeMillis()).getDeclination();
        }
        sensor = s;
        aktif = true;
        sm.unregisterListener(this);
        sm.registerListener(this, s, SensorManager.SENSOR_DELAY_UI);
        JSObject ret = new JSObject();
        ret.put("sapma", sapma);
        call.resolve(ret);
    }

    @PluginMethod
    public void durdur(PluginCall call) {
        aktif = false;
        if (sm != null) sm.unregisterListener(this);
        call.resolve();
    }

    @Override
    public void onSensorChanged(SensorEvent e) {
        long t = System.currentTimeMillis();
        if (t - son < 50) return;
        son = t;
        SensorManager.getRotationMatrixFromVector(r, e.values);
        int ax = SensorManager.AXIS_X, ay = SensorManager.AXIS_Y;
        int rot = Surface.ROTATION_0;
        try {
            rot = getActivity().getWindowManager().getDefaultDisplay().getRotation();
        } catch (Exception ignored) {}
        if (rot == Surface.ROTATION_90) { ax = SensorManager.AXIS_Y; ay = SensorManager.AXIS_MINUS_X; }
        else if (rot == Surface.ROTATION_180) { ax = SensorManager.AXIS_MINUS_X; ay = SensorManager.AXIS_MINUS_Y; }
        else if (rot == Surface.ROTATION_270) { ax = SensorManager.AXIS_MINUS_Y; ay = SensorManager.AXIS_X; }
        SensorManager.remapCoordinateSystem(r, ax, ay, rr);
        SensorManager.getOrientation(rr, o);
        double yon = (Math.toDegrees(o[0]) + sapma + 720) % 360;
        JSObject d = new JSObject();
        d.put("yon", yon);
        d.put("dogruluk", dogruluk);
        notifyListeners("yon", d);
    }

    @Override
    public void onAccuracyChanged(Sensor s, int a) {
        dogruluk = a;
    }

    @Override
    protected void handleOnPause() {
        if (sm != null) sm.unregisterListener(this);
    }

    @Override
    protected void handleOnResume() {
        if (aktif && sm != null && sensor != null) sm.registerListener(this, sensor, SensorManager.SENSOR_DELAY_UI);
    }

    @Override
    protected void handleOnDestroy() {
        if (sm != null) sm.unregisterListener(this);
    }
}
