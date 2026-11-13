package vn.matma.app;

import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.graphics.Color;
import android.graphics.drawable.GradientDrawable;
import android.os.Handler;
import android.os.Looper;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.core.content.ContextCompat;
import androidx.webkit.WebViewAssetLoader;

/**
 * Chạy giao diện web của app (www/, Capacitor chép vào assets/public) ở chế độ nhúng:
 * bong bóng nổi (mode=bubble) và menu bôi đen chữ (mode=process).
 * Dùng lại đúng giao diện và các bộ mật mã của bản web, không viết lại bằng Java.
 * Phía web: www/js/platform/native.js và embed.js.
 */
final class EmbeddedWeb {
    private static final String URL = "https://appassets.androidplatform.net/assets/public/index.html?mode=";

    /** Nơi chứa giao diện nhúng, nhận lệnh từ các nút trên web */
    interface Host {
        void collapse();

        void close();

        void replace(String text);

        String initialText();

        boolean isReadonly();
    }

    private EmbeddedWeb() {}

    @SuppressLint({"SetJavaScriptEnabled", "AddJavascriptInterface"})
    static WebView create(Context context, String mode, Host host) {
        WebViewAssetLoader assets = new WebViewAssetLoader.Builder()
                .addPathHandler("/assets/", new WebViewAssetLoader.AssetsPathHandler(context))
                .build();
        WebView web = new WebView(context);
        WebSettings settings = web.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        web.setBackgroundColor(Color.TRANSPARENT);
        web.setWebViewClient(new WebViewClient() {
            @Override
            public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                return assets.shouldInterceptRequest(request.getUrl());
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return true; // chỉ chạy giao diện của app, không mở trang nào khác
            }
        });
        // Chỉ trang nội bộ ở trên được nạp nên cầu nối không lộ ra trang lạ
        web.addJavascriptInterface(new Bridge(context, host), "MatMaNative");
        web.loadUrl(URL + mode);
        return web;
    }

    /** Đặt WebView vào khung bo góc, nền theo giao diện sáng/tối */
    static void fill(FrameLayout frame, WebView web) {
        GradientDrawable background = new GradientDrawable();
        background.setColor(ContextCompat.getColor(frame.getContext(), R.color.sheet_background));
        background.setCornerRadius(24 * frame.getResources().getDisplayMetrics().density);
        frame.setBackground(background);
        frame.setClipToOutline(true);
        frame.addView(web, new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
    }

    /** Các hàm web gọi qua window.MatMaNative (chạy trên luồng riêng của WebView) */
    static final class Bridge {
        private final Context context;
        private final Host host;
        private final Handler main = new Handler(Looper.getMainLooper());

        Bridge(Context context, Host host) {
            this.context = context;
            this.host = host;
        }

        private ClipboardManager clipboard() {
            return (ClipboardManager) context.getSystemService(Context.CLIPBOARD_SERVICE);
        }

        /** Android 10+ chỉ cho đọc khi cửa sổ của app đang được chọn; không đọc được thì trả về "" */
        @JavascriptInterface
        public String readClipboard() {
            ClipData clip = clipboard().getPrimaryClip();
            return clip == null || clip.getItemCount() == 0 ? "" : String.valueOf(clip.getItemAt(0).coerceToText(context));
        }

        @JavascriptInterface
        public void copy(String text) {
            main.post(() -> clipboard().setPrimaryClip(ClipData.newPlainText("matma", text)));
        }

        @JavascriptInterface
        public void collapse() {
            main.post(host::collapse);
        }

        @JavascriptInterface
        public void close() {
            main.post(host::close);
        }

        @JavascriptInterface
        public void replace(String text) {
            main.post(() -> host.replace(text));
        }

        @JavascriptInterface
        public String initialText() {
            return host.initialText();
        }

        @JavascriptInterface
        public boolean isReadonly() {
            return host.isReadonly();
        }
    }
}
