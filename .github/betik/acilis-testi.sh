#!/bin/bash
# Yayın (R8 ile küçültülmüş) APK'yı emülatöre kurar, açar ve çökme olup olmadığına bakar.
APK=android/app/build/outputs/apk/release/app-release-imzali.apk
PK=com.nurvakti.namazvekuran
adb install -r "$APK" || exit 1
adb shell pm grant $PK android.permission.POST_NOTIFICATIONS || true
adb logcat -c
adb shell monkey -p $PK -c android.intent.category.LAUNCHER 1
sleep 30
adb exec-out screencap -p > acilis-1.png
# ayarları ve birkaç sekmeyi gez (dokunma koordinatları 1080x2400 ekran için kabaca)
adb shell input tap 540 2200; sleep 3
adb shell input tap 330 2200; sleep 3
adb shell input keyevent KEYCODE_HOME; sleep 2
adb shell monkey -p $PK -c android.intent.category.LAUNCHER 1; sleep 8
adb exec-out screencap -p > acilis-2.png
adb logcat -d > logcat.txt
if grep -q "FATAL EXCEPTION" logcat.txt; then echo "ÇÖKME VAR:"; grep -A40 "FATAL EXCEPTION" logcat.txt | head -80; exit 1; fi
if [ -z "$(adb shell pidof $PK)" ]; then echo "Uygulama çalışmıyor"; grep -i "$PK\|AndroidRuntime" logcat.txt | tail -60; exit 1; fi
grep -i "Capacitor" logcat.txt | grep -i "error\|exception" | head -20 || true
echo "Açılış testi geçti: çökme yok, uygulama çalışıyor."
