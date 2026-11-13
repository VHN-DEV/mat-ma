// Giao diện sáng/tối: mặc định sáng, nút ☾/☀ để đổi, nhớ lựa chọn.
// Lúc tải trang, đoạn script nhỏ trong <head> đã đặt data-theme để không bị nháy.
import { setSystemBarsDark } from '../platform/native.js';

const STORAGE_KEY = 'theme';
const BAR_COLOR = { light: '#ffffff', dark: '#171a20' }; // trùng --surface trong app.css

function apply(button, theme) {
  const dark = theme === 'dark';
  document.documentElement.dataset.theme = theme;
  button.querySelector('use').setAttribute('href', dark ? '#i-sun' : '#i-moon');
  button.setAttribute('aria-label', dark ? 'Chuyển giao diện sáng' : 'Chuyển giao diện tối');
  document.querySelector('meta[name="theme-color"]').content = BAR_COLOR[theme];
  setSystemBarsDark(dark);
}

export function initTheme(button) {
  apply(button, document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light');
  button.onclick = () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    apply(button, next);
    try { localStorage.setItem(STORAGE_KEY, next); } catch { /* chế độ riêng tư: bỏ qua */ }
  };
}
