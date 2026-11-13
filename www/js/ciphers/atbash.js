import { letterChart, shiftLetters } from '../core/text.js';

const flip = s => shiftLetters(s, i => 25 - i);

export default {
  id: 'atbash',
  group: 'Cơ bản',
  name: 'Đảo bảng chữ cái (a ↔ z)',
  summary: 'Lật ngược bảng chữ cái: a ↔ z, b ↔ y, c ↔ x …',
  intro: 'Atbash là một trong những mật mã cổ nhất, ban đầu dùng với bảng chữ cái Hebrew: chữ đầu đổi với chữ cuối, chữ thứ hai đổi với chữ áp cuối. Ở đây áp dụng cho bảng chữ cái 26 chữ.',
  rules: [
    'Viết bảng chữ cái xuôi a → z, bên dưới viết ngược z → a.',
    'Mỗi chữ thay bằng chữ nằm ngay bên dưới nó: a → z, n → m, m → n, nên "nam" → mzn.',
    'Mã hoá và giải mã làm giống hệt nhau, không cần khóa.',
    'Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Hai chữ đổi cho nhau luôn có tổng số thứ tự bằng 27: a (1) ↔ z (26), n (14) ↔ m (13).',
  vi: true,
  encode: flip,
  decode: flip,
  chart: () => letterChart(flip),
};
