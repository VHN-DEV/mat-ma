// Nút (i) giải thích: phần tử nào có thuộc tính data-tip sẽ hiện bong bóng chứa nội dung đó khi bấm.
// Bấm lại, bấm ra ngoài, cuộn trang hoặc nhấn Esc thì đóng (không đóng khi đổi kích thước: thanh địa chỉ điện thoại co giãn liên tục). Bong bóng là vùng role="status" nên trình đọc màn hình đọc được.
import { escapeHTML } from './dom.js';

let bubble, current = null;

/** HTML của một nút (i) — dùng khi vẽ giao diện bằng JS */
export const infoButton = (text, name = 'thông tin') =>
  `<button type="button" class="info" aria-label="Giải thích: ${escapeHTML(name)}" aria-expanded="false" data-tip="${escapeHTML(text)}"><svg class="icon"><use href="#i-info"/></svg></button>`;

function show(target) {
  hide();
  current = target;
  current.setAttribute('aria-expanded', 'true');
  bubble.textContent = target.dataset.tip;
  bubble.classList.add('show');
  const r = target.getBoundingClientRect();
  const { offsetWidth: w, offsetHeight: h } = bubble;
  const left = Math.min(Math.max(12, r.left + r.width / 2 - w / 2), innerWidth - w - 12);
  const top = r.bottom + 8 + h < innerHeight ? r.bottom + 8 : r.top - h - 8;
  Object.assign(bubble.style, { left: `${left}px`, top: `${top}px` });
}

function hide() {
  if (!current) return;
  current.setAttribute('aria-expanded', 'false');
  current = null;
  bubble.classList.remove('show');
}

export function initTooltips() {
  bubble = Object.assign(document.createElement('div'), { className: 'tooltip' });
  bubble.setAttribute('role', 'status');
  document.body.append(bubble);
  document.querySelectorAll('[data-tip]').forEach(el => el.setAttribute('aria-expanded', 'false'));

  document.addEventListener('click', e => {
    const target = e.target.closest('[data-tip]');
    if (target && target !== current) show(target);
    else hide();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') hide(); });
  addEventListener('scroll', hide, { passive: true });
}
