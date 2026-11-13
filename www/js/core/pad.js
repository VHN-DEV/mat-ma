// Phím cho bàn phím riêng của bộ mật mã. Mỗi phím: [nhãn HTML, ký tự chèn vào mật mã, tên đọc cho trình đọc màn hình]
import { ABC } from './text.js';

export const SPACE_KEY = ['<small>cách</small>', ' ', 'dấu cách'];

/** Bàn phím a-z vẽ bằng hình của bộ mật mã, kèm phím cách */
export const glyphPad = draw => [...[...ABC].map(c => [`${draw(c)}<small>${c}</small>`, c, c]), SPACE_KEY];
