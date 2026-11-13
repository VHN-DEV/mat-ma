// Nhận biết app đang chạy ở đâu và gọi phần native của app Android.
// Trên web thường: bridge = null, MODE = 'web', app chạy như trang web bình thường.

const MODES = ['web', 'android', 'bubble', 'process'];
const capacitor = window.Capacitor;

/** Cầu nối của WebView nhúng (bong bóng nổi, menu bôi đen chữ), xem android/.../EmbeddedWeb.java */
export const bridge = window.MatMaNative ?? null;

/**
 * Chế độ chạy:
 *   web      trang web / PWA
 *   android  app Android chính (Capacitor)
 *   bubble   bảng mở từ bong bóng nổi
 *   process  bảng mở từ menu bôi đen chữ ở app khác
 * Thử chế độ nhúng trên máy tính: thêm ?mode=bubble hoặc ?mode=process vào địa chỉ.
 */
const requested = new URLSearchParams(location.search).get('mode');
export const MODE = MODES.includes(requested) ? requested : capacitor?.getPlatform?.() === 'android' ? 'android' : 'web';
export const EMBEDDED = MODE === 'bubble' || MODE === 'process';

/** Bật bong bóng nổi (BubblePlugin.java); trả về { started: boolean } */
export const startBubble = () => capacitor.nativePromise('Bubble', 'start', {});
