import { tableCodec } from '../core/codecs.js';

const NATO = Object.fromEntries(('Alfa Bravo Charlie Delta Echo Foxtrot Golf Hotel India Juliett Kilo Lima Mike November ' +
  'Oscar Papa Quebec Romeo Sierra Tango Uniform Victor Whiskey X-ray Yankee Zulu').split(' ').map(w => [w[0].toLowerCase(), w]));

export default {
  id: 'nato',
  group: 'Kỹ thuật',
  name: 'Bảng chữ cái NATO',
  summary: 'Mỗi chữ thay bằng một từ tiếng Anh: a = Alfa, b = Bravo, c = Charlie …',
  intro: 'Bảng chữ cái âm học NATO (bảng phiên âm ICAO) được dùng trong hàng không, quân đội và vô tuyến từ những năm 1950, để đánh vần rõ ràng qua bộ đàm, tránh nghe nhầm b với d, m với n.',
  rules: [
    'Mỗi chữ cái đổi thành từ mã của nó (xem Bảng tra): n = November, a = Alfa, m = Mike.',
    'Các từ mã trong cùng một từ cách nhau bằng dấu cách, các từ trong tin nhắn cách nhau bằng /.',
    'Viết đúng chính tả chuẩn: Alfa (không phải Alpha), Juliett (hai chữ t).',
    'Chữ có dấu được viết theo Telex trước.',
  ],
  tip: 'Khi giải bằng tay, chỉ cần lấy chữ cái đầu của mỗi từ mã.',
  vi: true,
  ...tableCodec(NATO, { sep: ' ', wordSep: ' / ' }),
  chart: () => Object.entries(NATO),
};
