import { tableCodec } from '../core/codecs.js';
import { ABC } from '../core/text.js';

const NUMBERS = Object.fromEntries([...ABC].map((c, i) => [c, String(i + 1)]));

export default {
  id: 'number',
  group: 'Cơ bản',
  name: 'Số thứ tự (a = 1)',
  summary: 'Thay mỗi chữ bằng số thứ tự của nó trong bảng chữ cái: a = 1 … z = 26.',
  intro: 'Còn gọi là mã A1Z26, dạng mật mã đơn giản nhất. Thường dùng làm thử thách khởi động trong trò chơi mật thư, hoặc kết hợp với các bộ khác để tăng độ khó.',
  rules: [
    'Dùng bảng chữ cái 26 chữ: a = 1, b = 2, c = 3 … z = 26.',
    'Các chữ trong một từ nối với nhau bằng dấu gạch ngang: nam = 14-1-13.',
    'Các từ cách nhau bằng dấu cách.',
    'Chữ có dấu được viết theo Telex trước: "Nam Định" → nam ddinhj → 14-1-13 4-4-9-14-8-10.',
  ],
  tip: 'Nhớ nhanh các mốc: e = 5, j = 10, o = 15, t = 20, y = 25.',
  vi: true,
  ...tableCodec(NUMBERS, { sep: '-', wordSep: ' ' }),
  chart: () => Object.entries(NUMBERS),
};
