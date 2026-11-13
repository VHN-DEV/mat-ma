import { glyphPad } from '../core/pad.js';
import { svg } from '../core/svg.js';
import { ABC } from '../core/text.js';

// a-i: khung #, j-r: khung # có chấm, s-v: khung X, w-z: khung X có chấm
const X_SHAPES = ['M6 8L20 32L34 8', 'M8 6L32 20L8 34', 'M32 6L8 20L32 34', 'M6 32L20 8L34 32']; // ô trên, trái, phải, dưới
const X_DOTS = [[20, 17], [18, 20], [22, 20], [20, 23]];

const draw = c => {
  const k = ABC.indexOf(c);
  if (k < 0) return null;
  const dotted = (k >= 9 && k < 18) || k >= 22;
  let path, dot = [20, 20];
  if (k < 18) {
    // Ô trong khung #: có cạnh ở phía nào còn ô bên cạnh
    const row = Math.floor((k % 9) / 3), col = k % 3;
    path = [row > 0 && 'M6 6H34', row < 2 && 'M6 34H34', col > 0 && 'M6 6V34', col < 2 && 'M34 6V34'].filter(Boolean).join('');
  } else {
    path = X_SHAPES[(k - 18) % 4];
    dot = X_DOTS[(k - 18) % 4];
  }
  return svg(`<path d="${path}"/>${dotted ? `<circle cx="${dot[0]}" cy="${dot[1]}" r="2.5" fill="currentColor" stroke="none"/>` : ''}`);
};

export default {
  id: 'pigpen',
  group: 'Hình',
  name: 'Chuồng bò (Pigpen)',
  summary: 'Mỗi chữ là một mảnh của khung # hoặc khung X, có chấm hoặc không.',
  intro: 'Mật mã chuồng bò (Pigpen, còn gọi là mật mã Hội Tam Điểm) đã được dùng từ thế kỷ 18. Mỗi chữ được thay bằng hình dạng của "chuồng" chứa nó trong 4 khung kẻ sẵn.',
  rules: [
    'Vẽ 4 khung: khung # thứ nhất chứa a–i, khung # thứ hai (mỗi ô có một chấm) chứa j–r, khung X thứ nhất chứa s–v, khung X thứ hai (có chấm) chứa w–z.',
    'Trong khung #, các chữ xếp từ trái qua phải, từ trên xuống: a b c / d e f / g h i. Trong khung X, các chữ xếp theo thứ tự ô trên, trái, phải, dưới.',
    'Mỗi chữ được vẽ bằng các cạnh bao quanh ô của nó, kèm chấm nếu thuộc khung có chấm. Ví dụ e là ô giữa nên là hình vuông kín, a là góc ┘.',
    'Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Để giải: bấm lần lượt các hình ở bàn phím bên dưới. Bàn phím cũng chính là bảng tra.',
  vi: true,
  draw,
  pad: glyphPad(draw),
  // Mật mã lưu dạng chữ, giao diện vẽ từng chữ bằng `draw`
  encode: text => text,
  decode: code => code,
};
