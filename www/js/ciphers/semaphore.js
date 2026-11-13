import { glyphPad } from '../core/pad.js';
import { svg } from '../core/svg.js';
import { ABC } from '../core/text.js';

// Hướng của hai tay cho từng chữ a-z. Hướng 0 = xuống, 1 = chéo dưới trái, 2 = trái … 7 = chéo dưới phải
// (xoay theo chiều kim đồng hồ, nhìn từ phía người xem)
const POSES = '01 02 03 04 05 06 07 12 13 46 14 15 16 17 23 24 25 26 27 34 35 47 56 57 36 67'.split(' ');

/** Một cánh tay cầm cờ (nửa đỏ nửa vàng) theo hướng `pos` */
const arm = pos => {
  const a = Math.PI / 2 + (pos * Math.PI) / 4, ux = Math.cos(a), uy = Math.sin(a);
  const pt = (along, side = 0) => `${(20 + ux * along - uy * side).toFixed(1)},${(20 + uy * along + ux * side).toFixed(1)}`;
  return `<polyline points="20,20 ${pt(17)}"/>` +
    `<polygon points="${pt(17)} ${pt(11)} ${pt(11, 6)}" fill="#dc2626" stroke="none"/>` +
    `<polygon points="${pt(17)} ${pt(17, 6)} ${pt(11, 6)}" fill="#facc15" stroke="none"/>`;
};

const draw = c => {
  const k = ABC.indexOf(c);
  if (k < 0) return null;
  return svg('<circle cx="20" cy="20" r="17" stroke-width="1" stroke-dasharray="2 3" opacity=".3"/>' +
    '<circle cx="20" cy="20" r="3" fill="currentColor" stroke="none"/>' + [...POSES[k]].map(Number).map(arm).join(''));
};

export default {
  id: 'semaphore',
  group: 'Hình',
  name: 'Cờ Semaphore',
  summary: 'Mỗi chữ là một tư thế giơ hai lá cờ theo 8 hướng.',
  intro: 'Semaphore là cách truyền tin bằng cờ tay, phổ biến trong hải quân từ thế kỷ 19 và trong Hướng đạo. Người phát tin cầm hai lá cờ (trên biển thường là cờ nửa đỏ nửa vàng) và giơ ở các góc khác nhau.',
  rules: [
    'Mỗi tay có thể giơ cờ theo 8 hướng cách nhau 45°: xuống, chéo dưới, ngang, chéo trên, lên.',
    'Từ a đến g: một cờ để thẳng xuống, cờ còn lại xoay dần theo chiều kim đồng hồ (nhìn từ phía người xem), từ chéo dưới bên trái tới chéo dưới bên phải.',
    'Các chữ còn lại là tổ hợp hai tay ở các hướng khác nhau, xem bàn phím bên dưới. Ví dụ r là hai tay dang ngang, u là hai tay giơ chéo lên thành hình chữ V.',
    'Hình được vẽ theo góc nhìn của người đứng đối diện người cầm cờ. Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Biểu tượng hòa bình ☮ nổi tiếng được ghép từ semaphore của hai chữ N và D (Nuclear Disarmament, nghĩa là giải trừ vũ khí hạt nhân).',
  vi: true,
  draw,
  pad: glyphPad(draw),
  // Mật mã lưu dạng chữ, giao diện vẽ từng chữ bằng `draw`
  encode: text => text,
  decode: code => code,
};
