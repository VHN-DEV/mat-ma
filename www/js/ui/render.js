// Các hàm vẽ giao diện: không giữ trạng thái, chỉ nhận dữ liệu và phần tử để vẽ vào.
import { escapeHTML } from './dom.js';
import { infoButton } from './tooltip.js';

const BACKSPACE_KEY = ['<svg class="icon"><use href="#i-backspace"/></svg>', null, 'xoá lùi'];

/** Ô nhập khóa của bộ mật mã, gọn trên một hàng: nhãn, ô nhập, nút (i) nếu có help; gọi onInput(id, value) khi sửa */
export function renderParams(container, defs = [], onInput) {
  container.replaceChildren(...defs.map(p => {
    const field = Object.assign(document.createElement('div'), { className: 'param' });
    field.innerHTML = `<label for="param-${p.id}">${escapeHTML(p.label)}</label>`;
    const input = Object.assign(document.createElement('input'), { id: `param-${p.id}`, type: p.type, value: p.value, min: p.min ?? '', max: p.max ?? '' });
    if (p.type === 'number') input.inputMode = 'numeric';
    input.oninput = () => onInput(p.id, input.value);
    field.append(input);
    if (p.help) field.insertAdjacentHTML('beforeend', infoButton(p.help, p.label));
    return field;
  }));
}

/** Bàn phím riêng (luôn kèm phím xoá lùi). Trả về giá trị của từng phím theo thứ tự; null = xoá lùi */
export function renderPad(container, keys, cols = 7) {
  container.hidden = !keys;
  if (!keys) return [];
  const all = [...keys, BACKSPACE_KEY];
  container.style.setProperty('--cols', cols);
  container.innerHTML = all.map(([label, , name], i) =>
    `<button type="button" data-i="${i}"${name ? ` aria-label="${escapeHTML(name)}"` : ''}>${label}</button>`).join('');
  return all.map(k => k[1]);
}

/** Phần giới thiệu & quy tắc của bộ mật mã */
export function renderGuide(container, cipher) {
  container.innerHTML =
    `<p>${escapeHTML(cipher.intro)}</p>` +
    `<h3>Quy tắc</h3><ol>${cipher.rules.map(r => `<li><span>${escapeHTML(r)}</span></li>`).join('')}</ol>` +
    (cipher.tip ? `<p class="tip"><b>Mẹo</b>${escapeHTML(cipher.tip)}</p>` : '');
}

/** Bảng tra [chữ, mã]; ẩn nếu bộ mật mã không có */
export function renderChart(details, body, rows) {
  details.hidden = !rows;
  if (rows) body.innerHTML = rows.map(([from, to]) => `<span><b>${escapeHTML(from)}</b>${escapeHTML(to)}</span>`).join('');
}

/** Mật mã dạng hình: mỗi ký tự một hình, dấu cách thành khoảng trống, ký tự không có hình giữ nguyên */
export const glyphHTML = (text, draw) => [...text].map(ch =>
  ch === ' ' ? '<span class="gap"></span>' : draw(ch) ?? `<span class="ch">${escapeHTML(ch)}</span>`).join('');
