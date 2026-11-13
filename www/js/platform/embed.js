// Nút riêng của app Android: bật bong bóng (app chính) và thao tác trong bảng nhúng (bong bóng / menu bôi đen chữ).
import { $ } from '../ui/dom.js';
import { copyText, toast } from '../ui/feedback.js';
import { bridge, MODE, startBubble } from './native.js';

/** Phần tử có data-modes="web android ..." chỉ hiện ở các chế độ được liệt kê */
export function applyMode() {
  document.body.dataset.mode = MODE;
  document.body.classList.toggle('embed', MODE === 'bubble' || MODE === 'process');
  document.querySelectorAll('[data-modes]').forEach(el => { el.hidden = !el.dataset.modes.split(' ').includes(MODE); });
}

/** app = { ui, state, encode, decode } của main.js */
export function initPlatform({ ui, state, encode, decode }) {
  const setCode = text => { ui.code.value = text; state.lastEdited = 'code'; decode(); };
  const setMsg = text => { ui.msg.value = text; state.lastEdited = 'msg'; encode(); };

  if (MODE === 'android') {
    $('bubble-start').onclick = async () => {
      const { started } = await startBubble();
      toast(started ? 'Đã bật bong bóng, mở Zalo hoặc Messenger để dùng' : 'Cần cho phép "Hiển thị trên ứng dụng khác" để bật bong bóng');
    };
  }
  if (!bridge) return;

  document.querySelectorAll('[data-embed="close"]').forEach(b => { b.onclick = () => bridge.close(); });
  $('embed-min').onclick = () => bridge.collapse();

  $('act-paste-decode').onclick = () => {
    const text = bridge.readClipboard();
    if (text) setCode(text);
    else toast('Chưa có gì để dán, hãy sao chép tin nhắn trước');
  };
  $('act-copy-code').onclick = () => {
    copyText(ui.code.value);
    setTimeout(() => bridge.collapse(), 700); // thu nhỏ để dán ngay vào ô chat
  };

  if (MODE === 'process') {
    const original = bridge.initialText();
    const swap = $('act-swap');
    const fill = asCode => {
      if (asCode) setCode(original);
      else setMsg(original);
      swap.textContent = asCode ? 'Chuyển sang mã hoá' : 'Chuyển sang giải mã';
    };
    // Chữ chỉ đọc thường là tin đã nhận nên giải mã; chữ trong ô chat thì mã hoá
    fill(bridge.isReadonly());
    swap.onclick = () => fill(state.lastEdited === 'msg');
    $('act-replace').hidden = bridge.isReadonly();
    $('act-replace').onclick = () => bridge.replace(state.lastEdited === 'msg' ? ui.code.value : ui.msg.value);
  }
}
