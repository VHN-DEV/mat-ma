// Hộp chọn bộ mật mã dạng thẻ, gom theo nhóm; mỗi thẻ có tóm tắt và ví dụ mã hoá "nam" để xem trước.
import { defaultParams } from '../ciphers/index.js';
import { escapeHTML } from './dom.js';
import { glyphHTML } from './render.js';

const SAMPLE = 'nam';

function card(cipher) {
  const code = cipher.encode(SAMPLE, defaultParams(cipher));
  return `<button type="button" class="pick" data-id="${cipher.id}">
    <span class="pick-name">${escapeHTML(cipher.name)}</span>
    <span class="pick-sample"><span class="from">${SAMPLE} →</span>${cipher.draw ? glyphHTML(code, cipher.draw) : escapeHTML(code)}</span>
    <span class="pick-desc">${escapeHTML(cipher.summary)}</span>
  </button>`;
}

/** Dựng hộp chọn trong <dialog>; onPick(id) khi người dùng chọn một bộ */
export function createPicker(dialog, ciphers, onPick) {
  const groups = [...new Set(ciphers.map(c => c.group))];
  dialog.querySelector('.sheet-body').innerHTML = groups.map(group => `
    <section class="pick-group">
      <h3>${escapeHTML(group)}</h3>
      <div class="pick-grid">${ciphers.filter(c => c.group === group).map(card).join('')}</div>
    </section>`).join('');

  dialog.addEventListener('click', e => {
    const pick = e.target.closest('[data-id]');
    if (pick) {
      dialog.close();
      onPick(pick.dataset.id);
    } else if (e.target === dialog || e.target.closest('[data-close]')) {
      dialog.close(); // bấm ra nền mờ hoặc nút đóng
    }
  });

  return {
    open(currentId) {
      dialog.querySelectorAll('[data-id]').forEach(b => b.setAttribute('aria-current', b.dataset.id === currentId));
      dialog.showModal();
      dialog.querySelector('[aria-current="true"]')?.focus();
    },
  };
}
