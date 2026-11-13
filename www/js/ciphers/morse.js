import { tableCodec } from '../core/codecs.js';

// Morse quốc tế (ITU): chữ, số và dấu câu thông dụng
const MORSE = {
  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--',
  n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
  0: '-----', 1: '.----', 2: '..---', 3: '...--', 4: '....-', 5: '.....', 6: '-....', 7: '--...', 8: '---..', 9: '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', '!': '-.-.--', '-': '-....-', '/': '-..-.', ':': '---...', "'": '.----.',
  '"': '.-..-.', '(': '-.--.', ')': '-.--.-', '=': '-...-', '+': '.-.-.', '@': '.--.-.', '&': '.-...',
};

export default {
  id: 'morse',
  group: 'Cơ bản',
  name: 'Morse',
  summary: 'Mỗi chữ là một dãy tín hiệu ngắn (.) và dài (-): "sos" = ... --- ...',
  intro: 'Mã Morse được Samuel Morse và Alfred Vail phát triển vào những năm 1830–1840 để gửi tin qua điện báo, sau này còn truyền bằng âm thanh, đèn và cờ. Đây là loại mật thư phổ biến nhất trong sinh hoạt Đoàn – Đội và Hướng đạo.',
  rules: [
    'Mỗi chữ cái, chữ số, dấu câu có một mã riêng gồm chấm (tín hiệu ngắn) và gạch (tín hiệu dài), xem Bảng tra.',
    'Trong mật mã viết, các chữ cách nhau bằng một dấu cách, các từ cách nhau bằng dấu /.',
    'Chữ có dấu được viết theo Telex trước: "ơ" → ow → --- .--',
  ],
  tip: 'Các chữ hay dùng có mã ngắn nhất: e (.), t (-), a (.-), i (..), n (-.), m (--). Khi giải, tách theo dấu / thành từng từ, rồi tách theo dấu cách thành từng chữ.',
  vi: true,
  ...tableCodec(MORSE, { sep: ' ', wordSep: ' / ' }),
  chart: () => Object.entries(MORSE),
  pad: [['<b>·</b>', '.', 'chấm'], ['<b>−</b>', '-', 'gạch'], ['<small>ngắt chữ</small>', ' '], ['<small>ngắt từ</small>', ' / ']],
  padCols: 5,
};
