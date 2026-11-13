import { byteCodec } from '../core/codecs.js';

export default {
  id: 'hex',
  group: 'Kỹ thuật',
  name: 'Thập lục phân (Hex)',
  summary: 'Mỗi byte của tin nhắn viết thành 2 ký tự hệ 16 (0–9, a–f).',
  intro: 'Hệ thập lục phân (cơ số 16) là cách viết gọn của nhị phân: mỗi ký tự hex thay cho 4 bit. Lập trình viên dùng hex để xem dữ liệu, viết mã màu (#ff0000) …',
  rules: [
    'Các chữ số hex gồm 0–9, rồi a = 10, b = 11 … f = 15.',
    'Mỗi byte UTF-8 viết thành 2 ký tự: A = 41, a = 61, dấu cách = 20.',
    'Chữ tiếng Việt có dấu chiếm 2–3 byte: "ệ" = e1 bb 87. Giữ nguyên dấu và chữ hoa.',
  ],
  ...byteCodec(16, 2, /^[0-9a-f]{1,2}$/i),
};
