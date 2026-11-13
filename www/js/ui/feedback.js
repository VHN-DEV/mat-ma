// Phản hồi cho người dùng: thông báo nhanh (toast) và sao chép.
import { bridge } from '../platform/native.js';
import { $ } from './dom.js';

let timer;

/** Hiện thông báo nhỏ ở cuối màn hình trong chốc lát */
export function toast(message) {
  const el = $('toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(timer);
  timer = setTimeout(() => el.classList.remove('show'), 1800);
}

/** Sao chép vào clipboard: WebView nhúng dùng clipboard của Android, trình duyệt cũ dùng cách cũ */
export async function copyText(text) {
  if (bridge) {
    bridge.copy(text);
  } else {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const t = Object.assign(document.createElement('textarea'), { value: text });
      document.body.append(t);
      t.select();
      document.execCommand('copy');
      t.remove();
    }
  }
  toast('Đã sao chép');
}
