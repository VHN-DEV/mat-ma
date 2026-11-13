// Danh sách bộ mật mã của app.
// Thêm bộ mới: tạo 1 file trong thư mục này, export default một object đúng kiểu Cipher bên dưới,
// rồi import và thêm vào CIPHERS. Test (test/ciphers.test.js) tự kiểm tra mọi bộ có trong danh sách.

/**
 * @typedef {Object} Cipher
 * @property {string} id        Mã định danh cố định (dùng để lưu lựa chọn của người dùng), đừng đổi sau khi phát hành
 * @property {string} group     Nhóm hiển thị trong ô chọn: Cơ bản | Có khóa | Hình | Kỹ thuật
 * @property {string} name      Tên hiển thị
 * @property {string} summary   Tóm tắt quy tắc trong 1 câu
 * @property {string} intro     Giới thiệu: bộ mã là gì, nguồn gốc
 * @property {string[]} rules   Các bước quy tắc, nên có ví dụ
 * @property {string} [tip]     Mẹo giải hoặc ghi chú thêm
 * @property {(text: string, p: Object) => string} encode  Tin nhắn -> mật mã
 * @property {(code: string, p: Object) => string} decode  Mật mã -> tin nhắn; ném lỗi nếu mật mã sai định dạng
 * @property {boolean} [vi]     true: mã hoá trên bản Telex để giữ dấu tiếng Việt (bộ chỉ xử lý a-z)
 * @property {Param[]} [params] Ô nhập khóa; giá trị truyền vào encode/decode qua p[id]
 * @property {PadKey[] | ((p: Object) => PadKey[])} [pad]  Bàn phím riêng để gõ mật mã trên điện thoại
 * @property {number} [padCols] Số cột của bàn phím (mặc định 7)
 * @property {(ch: string) => string | null} [draw]  Mật mã dạng hình: trả về SVG cho từng ký tự
 * @property {(p: Object) => [string, string][]} [chart]  Bảng tra [chữ, mã]
 *
 * @typedef {{ id: string, label: string, help?: string, type: 'text' | 'number', value: string | number, min?: number, max?: number }} Param
 *   help: nội dung nút (i) giải thích ô khóa
 * @typedef {[label: string, value: string, name?: string]} PadKey  [nhãn HTML, ký tự chèn vào mật mã, tên đọc cho trình đọc màn hình]
 */

import { withTelex } from '../core/telex.js';
import atbash from './atbash.js';
import base64 from './base64.js';
import binary from './binary.js';
import braille from './braille.js';
import caesar from './caesar.js';
import hex from './hex.js';
import morse from './morse.js';
import nato from './nato.js';
import number from './number.js';
import phone from './phone.js';
import pigpen from './pigpen.js';
import polybius from './polybius.js';
import railFence from './rail-fence.js';
import reverse from './reverse.js';
import semaphore from './semaphore.js';
import t9 from './t9.js';
import vigenere from './vigenere.js';

/** Thứ tự trong mảng = thứ tự hiển thị. @type {Cipher[]} */
export const CIPHERS = [
  phone, t9, morse, number, caesar, atbash, reverse, // Cơ bản
  vigenere, polybius, railFence, // Có khóa
  pigpen, braille, semaphore, // Hình
  nato, binary, hex, base64, // Kỹ thuật
].map(withTelex);

/** Giá trị khóa mặc định của một bộ: { shift: 3 } */
export const defaultParams = cipher => Object.fromEntries((cipher.params ?? []).map(p => [p.id, p.value]));
