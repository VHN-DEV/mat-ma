// Điểm vào của app: giữ trạng thái (bộ mật mã đang chọn, khóa, chiều đang gõ) và nối sự kiện giao diện.
import { CIPHERS, defaultParams } from './ciphers/index.js';
import { applyMode, initPlatform } from './platform/embed.js';
import { bridge, MODE } from './platform/native.js';
import { $, escapeHTML } from './ui/dom.js';
import { copyText, toast } from './ui/feedback.js';
import { createPicker } from './ui/picker.js';
import { glyphHTML, renderChart, renderGuide, renderPad, renderParams } from './ui/render.js';
import { initTooltips } from './ui/tooltip.js';

const STORAGE_KEY = 'cipher';
const EXAMPLE = 'Việt Nam';

const ui = {
  curGroup: $('cur-group'), curName: $('cur-name'), summary: $('summary'), params: $('params'), example: $('example'),
  guideTitle: $('guide-title'), guide: $('guide-body'), telex: $('telex'), chart: $('chart'), chartBody: $('chart-body'),
  msg: $('msg'), code: $('code'), glyphs: $('glyphs'), error: $('error'), pad: $('pad'),
  flow: $('flow'), flowLabel: $('flow-label'), lcdName: $('lcd-name'), lcdCount: $('lcd-count'),
  paste: $('paste'), share: $('share'),
};

const state = {
  cipher: CIPHERS[0],
  params: {},
  padValues: [],
  lastEdited: 'msg', // ô người dùng gõ gần nhất: đổi khóa/đổi bộ mã thì tính lại theo chiều này
};

// ---------- Mã hoá / giải mã ----------
function showDirection() {
  const decoding = state.lastEdited === 'code';
  ui.flow.classList.toggle('decoding', decoding);
  ui.flowLabel.textContent = decoding ? 'Đang giải mã' : 'Đang mã hoá';
}

function showCode() {
  const { draw } = state.cipher;
  if (draw) ui.glyphs.innerHTML = glyphHTML(ui.code.value, draw);
  ui.lcdCount.textContent = `${[...ui.code.value].length} ký tự`;
  showDirection();
}

function encode() {
  ui.error.textContent = '';
  ui.code.value = state.cipher.encode(ui.msg.value, state.params);
  showCode();
}

function decode() {
  try {
    ui.msg.value = state.cipher.decode(ui.code.value, state.params);
    ui.error.textContent = '';
  } catch {
    ui.error.textContent = 'Mật mã chưa đúng định dạng của bộ này.';
  }
  showCode();
}

const recompute = () => (state.lastEdited === 'code' ? decode() : encode());

// ---------- Vẽ lại phần phụ thuộc khóa ----------
function refresh() {
  const { cipher, params } = state;
  const example = cipher.encode(EXAMPLE, params);
  ui.example.innerHTML = cipher.draw ? glyphHTML(example, cipher.draw) : escapeHTML(example);
  renderChart(ui.chart, ui.chartBody, cipher.chart?.(params));
  state.padValues = renderPad(ui.pad, typeof cipher.pad === 'function' ? cipher.pad(params) : cipher.pad, cipher.padCols);
  recompute();
}

function selectCipher(id) {
  const cipher = CIPHERS.find(c => c.id === id) ?? CIPHERS[0];
  // Đang giải mã thì giải lại mật mã bằng bộ mới (tiện thử xem bộ nào đúng).
  // Riêng bộ dạng hình lưu mật mã ở dạng chữ nên khi đổi sang/từ bộ hình thì mã hoá lại từ tin nhắn.
  const keepDirection = !cipher.draw && !state.cipher.draw;
  Object.assign(state, { cipher, params: defaultParams(cipher), lastEdited: keepDirection ? state.lastEdited : 'msg' });

  ui.curGroup.textContent = cipher.group;
  ui.curName.textContent = cipher.name;
  ui.lcdName.textContent = cipher.name.toUpperCase();
  ui.summary.textContent = cipher.summary;
  ui.guideTitle.textContent = cipher.name;
  renderGuide(ui.guide, cipher);
  ui.telex.hidden = !cipher.vi;
  ui.code.hidden = !!cipher.draw;
  ui.glyphs.hidden = !cipher.draw;
  // Mật mã dạng hình: các nút sao chép/dán chữ (data-text-code) sẽ làm lộ tin nhắn nên ẩn đi
  document.body.classList.toggle('draw-cipher', !!cipher.draw);
  renderParams(ui.params, cipher.params, (key, value) => { state.params[key] = value; refresh(); });
  refresh();

  try { localStorage.setItem(STORAGE_KEY, cipher.id); } catch { /* chế độ riêng tư: bỏ qua */ }
}

// ---------- Sự kiện ----------
const picker = createPicker($('picker'), CIPHERS, selectCipher);
$('pick-open').onclick = () => picker.open(state.cipher.id);

ui.msg.oninput = () => { state.lastEdited = 'msg'; encode(); };
ui.code.oninput = () => { state.lastEdited = 'code'; decode(); };

ui.pad.onclick = e => {
  const button = e.target.closest('button');
  if (!button) return;
  const value = state.padValues[button.dataset.i];
  ui.code.value = value === null ? ui.code.value.slice(0, -1) : ui.code.value + value;
  navigator.vibrate?.(8);
  state.lastEdited = 'code';
  decode();
};

document.querySelectorAll('[data-copy]').forEach(button => {
  button.onclick = () => copyText(ui[button.dataset.copy].value);
});

$('clear').onclick = () => {
  ui.msg.value = '';
  state.lastEdited = 'msg';
  encode();
  ui.msg.focus();
};

ui.paste.hidden = !bridge && !navigator.clipboard?.readText;
ui.paste.onclick = async () => {
  try {
    const text = bridge ? bridge.readClipboard() : await navigator.clipboard.readText();
    if (!text) throw new Error('empty');
    ui.code.value = text;
    state.lastEdited = 'code';
    decode();
  } catch {
    toast('Không đọc được bộ nhớ tạm, hãy nhấn giữ ô mật mã và chọn Dán');
  }
};

ui.share.hidden = !navigator.share;
ui.share.onclick = () => navigator.share({ text: ui.code.value }).catch(() => { /* người dùng huỷ chia sẻ */ });

// ---------- Khởi động ----------
applyMode();
initTooltips();
let saved = null;
try { saved = localStorage.getItem(STORAGE_KEY); } catch { /* chế độ riêng tư: bỏ qua */ }
selectCipher(saved);
initPlatform({ ui, state, encode, decode });

// Cài như app + chạy offline. Chỉ cần cho bản web: app Android đã chứa sẵn file.
if (MODE === 'web' && 'serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js');
}
