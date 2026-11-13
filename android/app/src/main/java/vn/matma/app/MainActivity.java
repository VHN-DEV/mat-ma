package vn.matma.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(BubblePlugin.class); // phải đăng ký trước super.onCreate
        super.onCreate(savedInstanceState);
    }
}
