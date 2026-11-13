package vn.matma.app;

import android.content.Intent;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.Gravity;
import android.view.ViewGroup;
import android.webkit.WebView;
import android.widget.FrameLayout;

import androidx.appcompat.app.AppCompatActivity;

/**
 * Mục "Mật Mã" trong menu khi bôi đen chữ ở app khác (Zalo, Messenger...).
 * Mở giao diện web chế độ process; bấm "Thay vào ô chat" thì đoạn chữ đã chọn được thay bằng kết quả.
 */
public class ProcessTextActivity extends AppCompatActivity implements EmbeddedWeb.Host {
    private String text;
    private boolean readonly;
    private WebView web;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        CharSequence selected = getIntent().getCharSequenceExtra(Intent.EXTRA_PROCESS_TEXT);
        text = selected == null ? "" : selected.toString();
        // Chữ chỉ đọc (vd: tin nhắn đã nhận) thì không thay được, chỉ giải mã để xem
        readonly = getIntent().getBooleanExtra(Intent.EXTRA_PROCESS_TEXT_READONLY, false);

        FrameLayout frame = new FrameLayout(this);
        web = EmbeddedWeb.create(this, "process", this);
        EmbeddedWeb.fill(frame, web);
        setContentView(frame);

        DisplayMetrics screen = getResources().getDisplayMetrics();
        getWindow().setLayout(ViewGroup.LayoutParams.MATCH_PARENT, Math.round(screen.heightPixels * 0.8f));
        getWindow().setGravity(Gravity.BOTTOM);
    }

    @Override
    protected void onDestroy() {
        web.destroy();
        super.onDestroy();
    }

    @Override
    public void collapse() {
        finish();
    }

    @Override
    public void close() {
        finish();
    }

    @Override
    public void replace(String result) {
        setResult(RESULT_OK, new Intent().putExtra(Intent.EXTRA_PROCESS_TEXT, result));
        finish();
    }

    @Override
    public String initialText() {
        return text;
    }

    @Override
    public boolean isReadonly() {
        return readonly;
    }
}
