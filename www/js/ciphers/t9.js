import { toTelex } from '../core/telex.js';
import { KEYS, keyIndex, PHONE_PAD } from './shared/keypad.js';

// Không dùng `vi: true`: kết quả giải mã là các nhóm chữ [abc] để người dùng tự ghép, không đổi ngược Telex được
export default {
  id: 't9',
  group: 'Cơ bản',
  name: 'T9 (mỗi chữ bấm 1 lần)',
  summary: 'Mỗi chữ chỉ bấm 1 lần phím chứa nó: "nam" = 626.',
  intro: 'T9 (Text on 9 keys) là chế độ gõ đoán chữ trên điện thoại cũ: mỗi chữ chỉ bấm một lần, máy tự đoán từ dựa trên từ điển. Làm mật mã thì ngắn gọn nhưng khó giải hơn, vì một dãy số có thể ứng với nhiều từ.',
  rules: [
    'Mỗi chữ thay bằng số của phím chứa nó: a, b, c → 2; d, e, f → 3; … w, x, y, z → 9.',
    'Dấu cách viết là 0.',
    'Chữ có dấu được viết theo Telex trước: "Việt" → vieetj → 843385.',
  ],
  tip: 'Khi giải, mỗi số có 3–4 khả năng. App liệt kê các chữ có thể có của từng số, ví dụ 626 → [mno][abc][mno], bạn thử ghép thành từ có nghĩa: nam, man, oan…',
  pad: PHONE_PAD,
  padCols: 3,

  encode: text => [...toTelex(text)].map(c => { const k = keyIndex(c); return k < 0 ? c : String(k); }).join(''),
  decode: code => code.replace(/\d/g, d => d === '0' ? ' ' : d === '1' ? '1' : `[${KEYS[d].slice(0, -1)}]`),
};
