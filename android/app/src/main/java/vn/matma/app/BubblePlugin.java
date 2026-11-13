package vn.matma.app;

import android.content.Intent;
import android.net.Uri;
import android.provider.Settings;

import androidx.activity.result.ActivityResult;
import androidx.core.content.ContextCompat;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.ActivityCallback;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Cho giao diện web bật/tắt bong bóng nổi. Gọi từ web: Capacitor.nativePromise('Bubble', 'start', {}).
 * Chưa có quyền "Hiển thị trên ứng dụng khác" thì mở trang cài đặt, quay lại app sẽ tự bật nếu đã cấp.
 */
@CapacitorPlugin(name = "Bubble")
public class BubblePlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
        if (Settings.canDrawOverlays(getContext())) {
            startBubble(call);
            return;
        }
        Intent settings = new Intent(Settings.ACTION_MANAGE_OVERLAY_PERMISSION, Uri.parse("package:" + getContext().getPackageName()));
        startActivityForResult(call, settings, "onOverlaySettingsClosed");
    }

    @PluginMethod
    public void stop(PluginCall call) {
        getContext().stopService(new Intent(getContext(), BubbleService.class));
        call.resolve();
    }

    @ActivityCallback
    private void onOverlaySettingsClosed(PluginCall call, ActivityResult result) {
        if (call == null) return;
        if (Settings.canDrawOverlays(getContext())) {
            startBubble(call);
        } else {
            resolveStarted(call, false);
        }
    }

    private void startBubble(PluginCall call) {
        ContextCompat.startForegroundService(getContext(), new Intent(getContext(), BubbleService.class));
        resolveStarted(call, true);
    }

    private static void resolveStarted(PluginCall call, boolean started) {
        JSObject result = new JSObject();
        result.put("started", started);
        call.resolve(result);
    }
}
