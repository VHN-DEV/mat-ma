import { charCodec } from '../core/codecs.js';
import { SPACE_KEY } from '../core/pad.js';
import { ABC } from '../core/text.js';

// Các chấm (1-6) của từng chữ a-z -> ký tự Unicode Braille (chấm n = bit n-1 tính từ U+2800)
const DOTS = '1 12 14 145 15 124 1245 125 24 245 13 123 134 1345 135 1234 12345 1235 234 2345 136 1236 2456 1346 13456 1356'.split(' ');
const BRAILLE = Object.fromEntries(DOTS.map((dots, i) =>
  [ABC[i], String.fromCharCode(0x2800 + [...dots].reduce((bits, d) => bits | (1 << (d - 1)), 0))]));

export default {
  id: 'braille',
  group: 'Hình',
  name: 'Chữ nổi (Braille)',
  summary: 'Mỗi chữ là một ô 6 chấm của chữ nổi Braille.',
  intro: 'Chữ nổi do Louis Braille, một người Pháp bị mù từ nhỏ, công bố năm 1829 để người khiếm thị đọc bằng đầu ngón tay. Mỗi ô có 6 vị trí chấm xếp thành 2 cột × 3 hàng.',
  rules: [
    'Các chấm được đánh số: cột trái từ trên xuống là 1, 2, 3; cột phải từ trên xuống là 4, 5, 6.',
    '10 chữ đầu a–j chỉ dùng các chấm 1, 2, 4, 5: a = chấm 1, b = chấm 1-2, c = chấm 1-4 …',
    'k–t giống a–j nhưng thêm chấm 3; u, v, x, y, z thêm cả chấm 3 và 6. Riêng w là ngoại lệ vì tiếng Pháp thời đó không dùng chữ w.',
    'App dùng ký tự Braille Unicode nên có thể sao chép và dán như chữ thường. Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Chữ nổi tiếng Việt thực tế có quy tắc riêng cho dấu thanh; app dùng Telex để thống nhất với các bộ mã khác.',
  vi: true,
  ...charCodec(BRAILLE),
  pad: [...Object.entries(BRAILLE).map(([c, b]) => [`<b class="braille">${b}</b><small>${c}</small>`, b, c]), SPACE_KEY],
};
