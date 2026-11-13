// Bàn phím điện thoại, dùng chung cho bộ Điện thoại và T9.
// Phím k: bấm 1 lần ra chữ đầu, bấm thêm ra chữ kế tiếp, hết chữ thì ra số. Phím 0: dấu cách, rồi số 0.
export const KEYS = [' 0', '1', 'abc2', 'def3', 'ghi4', 'jkl5', 'mno6', 'pqrs7', 'tuv8', 'wxyz9'];

/** Số phím chứa ký tự c, -1 nếu không có */
export const keyIndex = c => KEYS.findIndex(keys => keys.includes(c));

export const PHONE_PAD = [
  ...[1, 2, 3, 4, 5, 6, 7, 8, 9].map(k => [`<b>${k}</b><small>${KEYS[k].slice(0, -1) || '&nbsp;'}</small>`, String(k)]),
  ['<small>ngắt</small>', ' ', 'ngắt chữ'],
  ['<b>0</b><small>cách</small>', '0'],
];
