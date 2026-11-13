import { KEYS, keyIndex, PHONE_PAD } from './shared/keypad.js';

export default {
  id: 'phone',
  group: 'Cơ bản',
  name: 'Điện thoại (bấm phím)',
  summary: 'Bấm phím như nhắn tin trên điện thoại cũ: n = 66, a = 2, m = 6, nên "nam" = 6626.',
  intro: 'Mô phỏng cách nhắn tin trên điện thoại bàn phím số thời trước màn hình cảm ứng: mỗi phím số mang 3–4 chữ cái, muốn gõ chữ nào thì bấm phím đó nhiều lần. Đây là dạng mật thư quen thuộc trong sinh hoạt Đoàn – Đội.',
  rules: [
    'Tìm phím chứa chữ cần gõ: 2 = abc, 3 = def, 4 = ghi, 5 = jkl, 6 = mno, 7 = pqrs, 8 = tuv, 9 = wxyz.',
    'Chữ đứng thứ mấy trên phím thì viết số phím bấy nhiêu lần: a = 2, b = 22, c = 222, s = 7777.',
    'Dấu cách giữa các từ viết là 0. Chữ số trong tin nhắn thì bấm qua hết các chữ của phím: số 2 = 2222, số 0 = 00.',
    'Hai chữ liền nhau nằm trên cùng một phím phải ngắt bằng dấu cách, vì 66 có thể là "n" hoặc "mm": mm = 6 6, mom = 6 666 6.',
    'Chữ có dấu được viết theo Telex trước rồi mới mã hoá: "Định" → ddinhj → 3 344466445.',
  ],
  tip: 'Khi giải: tách mật mã thành các cụm số giống nhau đứng liền nhau, đếm số lần lặp để biết là chữ thứ mấy trên phím. 6626 → 66 | 2 | 6 → n a m.',
  vi: true,
  pad: PHONE_PAD,
  padCols: 3,

  encode: text => {
    let out = '';
    for (const c of text) {
      const k = keyIndex(c);
      const press = k < 0 ? c : String(k).repeat(KEYS[k].indexOf(c) + 1);
      if (out.endsWith(press[0])) out += ' '; // cùng phím với chữ trước thì phải ngắt, nếu không 66 là n hay mm?
      out += press;
    }
    return out;
  },

  // Mỗi dãy số giống nhau = 1 chữ (bấm quá thì quay vòng như điện thoại thật); dấu cách chỉ để ngắt
  decode: code => code.replace(/(\d)\1*| /g, (run, d) => d ? KEYS[d][(run.length - 1) % KEYS[d].length] : ''),
};
