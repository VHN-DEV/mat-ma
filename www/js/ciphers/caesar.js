import { letterChart, shiftLetters } from '../core/text.js';

export default {
  id: 'caesar',
  group: 'Cơ bản',
  name: 'Dời chữ (Caesar)',
  summary: 'Dời mỗi chữ đi một số bước cố định trong bảng chữ cái: dời 3 thì a → d, n → q.',
  intro: 'Mật mã Caesar mang tên Julius Caesar, vị tướng La Mã được cho là đã dời mỗi chữ 3 bước khi viết thư quân sự. Đây là mật mã thay thế cổ điển nổi tiếng nhất.',
  rules: [
    'Chọn khóa là số bước dời, từ 1 đến 25 (mặc định 3).',
    'Mỗi chữ thay bằng chữ đứng sau nó đúng số bước đó; đến z thì quay lại a. Dời 3: x → a, y → b, z → c.',
    'Giải mã thì dời ngược lại cùng số bước.',
    'Chữ có dấu được viết theo Telex trước; chữ số và dấu câu giữ nguyên.',
  ],
  tip: 'Nếu không biết khóa, chỉ cần đổi số ở ô khóa và thử lần lượt từ 1 đến 25 cho tới khi ra câu có nghĩa.',
  vi: true,
  params: [{
    id: 'shift', label: 'Dời bao nhiêu chữ', type: 'number', value: 3, min: 1, max: 25,
    help: 'Số bước dời mỗi chữ trong bảng chữ cái (1–25). Người nhận phải dùng đúng số này để giải.',
  }],

  encode: (text, p) => shiftLetters(text, i => i + +p.shift),
  decode: (code, p) => shiftLetters(code, i => i - +p.shift),
  chart: p => letterChart(c => shiftLetters(c, i => i + +p.shift)),
};
