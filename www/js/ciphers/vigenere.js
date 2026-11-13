import { ABC, keyOf, mod } from '../core/text.js';

/** dir = 1: mã hoá, -1: giải mã. Khóa chỉ tiến lên ở chữ cái, bỏ qua dấu cách và dấu câu */
const vigenere = (s, key, dir) => {
  const k = keyOf(key).replace(/\d/g, '');
  let i = 0;
  return k ? s.replace(/[a-z]/g, c => ABC[mod(ABC.indexOf(c) + dir * ABC.indexOf(k[i++ % k.length]), 26)]) : s;
};

export default {
  id: 'vigenere',
  group: 'Có khóa',
  name: 'Vigenère (khóa chữ)',
  summary: 'Dời mỗi chữ theo từng chữ của một từ khóa lặp lại, giống Caesar nhưng mỗi chữ dời một kiểu.',
  intro: 'Được Bellaso mô tả năm 1553 và về sau mang tên nhà ngoại giao Pháp Blaise de Vigenère. Vì mỗi chữ dời một số bước khác nhau nên nó từng được gọi là "mật mã không thể phá" suốt khoảng 300 năm.',
  rules: [
    'Chọn một từ khóa, ví dụ "mat thu". App bỏ dấu và dấu cách, chỉ lấy chữ cái: matthu.',
    'Viết từ khóa lặp lại bên dưới các chữ của tin nhắn (bỏ qua dấu cách và dấu câu).',
    'Mỗi chữ dời đi số bước bằng vị trí của chữ khóa bên dưới nó: a = 0, b = 1, c = 2 … z = 25.',
    'Ví dụ khóa "lemon": a + l (11) = l, t + e (4) = x … nên "attack" thành "lxfopv".',
    'Giải mã thì dời ngược lại. Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Người nhận phải biết đúng từ khóa. Từ khóa càng dài thì mật mã càng khó phá.',
  vi: true,
  params: [{
    id: 'key', label: 'Từ khóa', type: 'text', value: 'mat thu',
    help: 'Chỉ dùng chữ cái a–z; dấu và dấu cách được bỏ qua. Người nhận phải biết đúng từ khóa này để giải.',
  }],

  encode: (text, p) => vigenere(text, p.key, 1),
  decode: (code, p) => vigenere(code, p.key, -1),
};
