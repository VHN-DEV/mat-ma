import { byteCodec } from '../core/codecs.js';
import { SPACE_KEY } from '../core/pad.js';

export default {
  id: 'binary',
  group: 'Kỹ thuật',
  name: 'Nhị phân',
  summary: 'Mỗi byte của tin nhắn viết thành 8 chữ số 0 và 1.',
  intro: 'Hệ nhị phân (cơ số 2) là cách máy tính lưu mọi dữ liệu. Tin nhắn được mã hoá UTF-8 thành các byte; mỗi byte là một số từ 0 đến 255, viết bằng 8 bit.',
  rules: [
    'Mỗi chữ cái tiếng Anh, chữ số, dấu câu là 1 byte: A = 65 = 01000001, a = 97 = 01100001.',
    'Chữ tiếng Việt có dấu chiếm 2–3 byte: "ệ" = 11100001 10111011 10000111.',
    'Các byte cách nhau bằng dấu cách. Giữ nguyên dấu và chữ hoa, không cần Telex.',
  ],
  tip: 'Đổi nhị phân sang số: các bit từ phải sang trái có giá trị 1, 2, 4, 8, 16, 32, 64, 128, rồi cộng giá trị của các bit 1 lại.',
  ...byteCodec(2, 8, /^[01]{1,8}$/),
  pad: [['<b>0</b>', '0'], ['<b>1</b>', '1'], SPACE_KEY],
  padCols: 4,
};
