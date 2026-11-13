package vn.matma.app;

import android.animation.ValueAnimator;
import android.annotation.SuppressLint;
import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.graphics.PixelFormat;
import android.os.Build;
import android.os.IBinder;
import android.util.DisplayMetrics;
import android.view.ContextThemeWrapper;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewConfiguration;
import android.view.WindowManager;
import android.webkit.WebView;
import android.widget.FrameLayout;
import android.widget.ImageView;

import androidx.core.app.NotificationCompat;
import androidx.core.app.ServiceCompat;

/**
 * Bong bóng nổi trên mọi app (cần quyền "Hiển thị trên ứng dụng khác").
 * Kéo để di chuyển, thả ra thì bám vào mép màn hình; chạm để mở bảng mã hoá/giải mã (giao diện web, chế độ bubble).
 * Chạy dạng foreground service để Android không tắt bong bóng khi người dùng đang ở app khác.
 */
public class BubbleService extends Service implements EmbeddedWeb.Host {
    static final String ACTION_STOP = "vn.matma.app.action.STOP_BUBBLE";
    private static final String CHANNEL_ID = "bubble";
    private static final int NOTIFICATION_ID = 1;
    private static final float PANEL_HEIGHT = 0.58f; // phần còn lại phía dưới dành cho bàn phím

    private WindowManager windowManager;
    private ImageView bubble;
    private WindowManager.LayoutParams bubbleParams;
    private FrameLayout panel;
    private WindowManager.LayoutParams panelParams;
    private WebView web;
    private boolean expanded;

    @Override
    public IBinder onBind(Intent intent) {
        return null;
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        if (intent != null && ACTION_STOP.equals(intent.getAction())) {
            stopSelf();
            return START_NOT_STICKY;
        }
        startInForeground();
        if (bubble == null) showBubble();
        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        if (expanded) windowManager.removeView(panel);
        else if (bubble != null) windowManager.removeView(bubble);
        if (web != null) web.destroy();
        super.onDestroy();
    }

    // ---------- EmbeddedWeb.Host: lệnh từ các nút trên giao diện web ----------

    @Override
    public void collapse() {
        if (!expanded) return;
        windowManager.removeView(panel);
        windowManager.addView(bubble, bubbleParams);
        expanded = false;
    }

    @Override
    public void close() {
        stopSelf();
    }

    @Override
    public void replace(String text) {
        // chỉ dùng ở menu bôi đen chữ
    }

    @Override
    public String initialText() {
        return "";
    }

    @Override
    public boolean isReadonly() {
        return false;
    }

    // ---------- Bong bóng ----------

    @SuppressLint("ClickableViewAccessibility")
    private void showBubble() {
        windowManager = (WindowManager) getSystemService(WINDOW_SERVICE);
        DisplayMetrics screen = getResources().getDisplayMetrics();
        int size = dp(58);
        bubble = new ImageView(this);
        bubble.setImageResource(R.mipmap.ic_launcher_round);
        bubble.setContentDescription(getString(R.string.bubble_open));
        bubbleParams = new WindowManager.LayoutParams(size, size, overlayType(),
                WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE, PixelFormat.TRANSLUCENT);
        bubbleParams.gravity = Gravity.TOP | Gravity.START;
        bubbleParams.x = screen.widthPixels - size;
        bubbleParams.y = screen.heightPixels / 3;
        bubble.setOnTouchListener(new DragListener());
        windowManager.addView(bubble, bubbleParams);
    }

    /** Kéo để di chuyển; chạm (không kéo) để mở bảng */
    private final class DragListener implements View.OnTouchListener {
        private final int slop = ViewConfiguration.get(BubbleService.this).getScaledTouchSlop();
        private int startX, startY;
        private float downX, downY;
        private boolean dragging;

        @Override
        public boolean onTouch(View view, MotionEvent e) {
            switch (e.getActionMasked()) {
                case MotionEvent.ACTION_DOWN:
                    startX = bubbleParams.x;
                    startY = bubbleParams.y;
                    downX = e.getRawX();
                    downY = e.getRawY();
                    dragging = false;
                    return true;
                case MotionEvent.ACTION_MOVE:
                    float dx = e.getRawX() - downX, dy = e.getRawY() - downY;
                    if (!dragging && Math.hypot(dx, dy) < slop) return true;
                    dragging = true;
                    bubbleParams.x = startX + Math.round(dx);
                    bubbleParams.y = startY + Math.round(dy);
                    windowManager.updateViewLayout(bubble, bubbleParams);
                    return true;
                case MotionEvent.ACTION_UP:
                    if (dragging) snapToEdge();
                    else expand();
                    return true;
                default:
                    return false;
            }
        }
    }

    /** Thả tay thì bong bóng trượt về mép trái/phải gần nhất và không ra khỏi màn hình */
    private void snapToEdge() {
        DisplayMetrics screen = getResources().getDisplayMetrics();
        int size = bubble.getWidth();
        bubbleParams.y = Math.max(statusBarHeight(), Math.min(bubbleParams.y, screen.heightPixels - size * 2));
        int target = bubbleParams.x + size / 2 < screen.widthPixels / 2 ? 0 : screen.widthPixels - size;
        ValueAnimator animator = ValueAnimator.ofInt(bubbleParams.x, target).setDuration(180);
        animator.addUpdateListener(a -> {
            if (!bubble.isAttachedToWindow()) return;
            bubbleParams.x = (int) a.getAnimatedValue();
            windowManager.updateViewLayout(bubble, bubbleParams);
        });
        animator.start();
    }

    // ---------- Bảng mã hoá/giải mã ----------

    private void expand() {
        if (expanded) return;
        if (panel == null) createPanel();
        windowManager.removeView(bubble); // gỡ hẳn để không chặn chạm ở vùng bong bóng
        windowManager.addView(panel, panelParams);
        expanded = true;
    }

    private void createPanel() {
        Context themed = new ContextThemeWrapper(this, R.style.AppTheme_NoActionBar); // sáng/tối theo hệ thống
        panel = new FrameLayout(themed) {
            @Override
            public boolean dispatchTouchEvent(MotionEvent e) {
                if (e.getActionMasked() == MotionEvent.ACTION_OUTSIDE) { // chạm ra ngoài bảng thì thu nhỏ
                    post(BubbleService.this::collapse);
                    return true;
                }
                return super.dispatchTouchEvent(e);
            }

            @Override
            public boolean dispatchKeyEvent(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.KEYCODE_BACK) {
                    if (e.getAction() == KeyEvent.ACTION_UP) collapse();
                    return true;
                }
                return super.dispatchKeyEvent(e);
            }
        };
        web = EmbeddedWeb.create(themed, "bubble", this);
        EmbeddedWeb.fill(panel, web);

        DisplayMetrics screen = getResources().getDisplayMetrics();
        // Có thể nhận bàn phím (không đặt FLAG_NOT_FOCUSABLE), chạm ngoài bảng vẫn tới app bên dưới
        panelParams = new WindowManager.LayoutParams(screen.widthPixels - dp(16), Math.round(screen.heightPixels * PANEL_HEIGHT),
                overlayType(),
                WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL | WindowManager.LayoutParams.FLAG_WATCH_OUTSIDE_TOUCH,
                PixelFormat.TRANSLUCENT);
        panelParams.gravity = Gravity.TOP | Gravity.CENTER_HORIZONTAL;
        panelParams.y = statusBarHeight() + dp(8);
        panelParams.softInputMode = WindowManager.LayoutParams.SOFT_INPUT_ADJUST_RESIZE;
    }

    // ---------- Thông báo của foreground service ----------

    private void startInForeground() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            NotificationChannel channel = new NotificationChannel(CHANNEL_ID, getString(R.string.bubble_channel), NotificationManager.IMPORTANCE_MIN);
            getSystemService(NotificationManager.class).createNotificationChannel(channel);
        }
        PendingIntent open = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class), PendingIntent.FLAG_IMMUTABLE);
        PendingIntent stop = PendingIntent.getService(this, 1, new Intent(this, BubbleService.class).setAction(ACTION_STOP), PendingIntent.FLAG_IMMUTABLE);
        Notification notification = new NotificationCompat.Builder(this, CHANNEL_ID)
                .setSmallIcon(R.drawable.ic_stat_matma)
                .setContentTitle(getString(R.string.bubble_notification_title))
                .setContentText(getString(R.string.bubble_notification_text))
                .setContentIntent(open)
                .addAction(0, getString(R.string.bubble_stop), stop)
                .setOngoing(true)
                .setPriority(NotificationCompat.PRIORITY_MIN)
                .build();
        ServiceCompat.startForeground(this, NOTIFICATION_ID, notification,
                Build.VERSION.SDK_INT >= Build.VERSION_CODES.UPSIDE_DOWN_CAKE ? ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE : 0);
    }

    // ---------- Tiện ích ----------

    @SuppressWarnings("deprecation")
    private static int overlayType() {
        return Build.VERSION.SDK_INT >= Build.VERSION_CODES.O
                ? WindowManager.LayoutParams.TYPE_APPLICATION_OVERLAY
                : WindowManager.LayoutParams.TYPE_PHONE;
    }

    @SuppressLint({"DiscouragedApi", "InternalInsetResource"})
    private int statusBarHeight() {
        int id = getResources().getIdentifier("status_bar_height", "dimen", "android");
        return id > 0 ? getResources().getDimensionPixelSize(id) : dp(24);
    }

    private int dp(int value) {
        return Math.round(value * getResources().getDisplayMetrics().density);
    }
}
