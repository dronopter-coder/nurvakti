package com.nurvakti.namazvekuran;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(PusulaPlugin.class);
        registerPlugin(NurYerliPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
