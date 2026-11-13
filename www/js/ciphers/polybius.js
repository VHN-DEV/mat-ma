import { tableCodec } from '../core/codecs.js';
import { ABC, keyOf } from '../core/text.js';

const SIZE = 6;
/** Bảng 6x6: chữ của khóa xếp trước (bỏ chữ trùng), rồi a-z, 0-9 */
const grid = key => [...new Set(keyOf(key) + ABC + '0123456789')];
/** Tọa độ của ô thứ i: số hàng rồi số cột, a = 11 */
const coord = i => `${Math.floor(i / SIZE) + 1}${(i % SIZE) + 1}`;
const codec = key => tableCodec(Object.fromEntries(grid(key).map((c, i) => [c, coord(i)])), { sep: ' ', wordSep: ' / ' });

export default {
  id: 'polybius',
  group: 'Có khóa',
  name: 'Tọa độ (bảng 6×6)',
  summary: 'Mỗi ký tự viết bằng tọa độ hàng – cột trong bảng 6×6: a = 11, b = 12, g = 21.',
  intro: 'Bảng Polybius do sử gia Hy Lạp Polybius mô tả từ thế kỷ 2 TCN, ban đầu để truyền tin bằng đuốc. Bản gốc là bảng 5×5 (gộp i và j); app dùng bảng 6×6 để chứa đủ 26 chữ và 10 chữ số, không phải gộp chữ nào.',
  rules: [
    'Xếp các ký tự vào bảng 6 hàng × 6 cột: hàng 1 là a b c d e f, hàng 2 là g h i j k l … cuối bảng là các chữ số 0–9.',
    'Mỗi ký tự viết thành 2 chữ số: số hàng rồi số cột. a = 11, f = 16, g = 21, n = 32.',
    'Các ký tự cách nhau bằng dấu cách, các từ cách nhau bằng dấu /.',
    'Nếu có từ khóa: các chữ của từ khóa (bỏ chữ trùng) được xếp vào đầu bảng, sau đó mới tới các ký tự còn lại. Người nhận cần biết khóa để dựng lại đúng bảng.',
    'Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Bàn phím bên dưới chính là bảng tọa độ: bấm vào từng ô để gõ nhanh mật mã khi giải.',
  vi: true,
  params: [{
    id: 'key', label: 'Từ khóa (có thể bỏ trống)', type: 'text', value: '',
    help: 'Các chữ của từ khóa được xếp lên đầu bảng làm bảng khác đi; người nhận cần cùng từ khóa. Bỏ trống để dùng bảng chuẩn a–z, 0–9.',
  }],

  encode: (text, p) => codec(p.key).encode(text),
  decode: (code, p) => codec(p.key).decode(code),
  pad: p => [...grid(p.key).map((c, i) => [`<b>${c}</b><small>${coord(i)}</small>`, `${coord(i)} `, c]), ['<small>ngắt từ</small>', '/ ']],
  padCols: SIZE,
};
