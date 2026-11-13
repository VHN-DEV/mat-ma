// Các khuôn mã hoá dùng chung: bộ mật mã chỉ cần đưa bảng hoặc tham số vào là có sẵn encode/decode.
import { invert } from './text.js';

/**
 * Mã từng ký tự theo bảng; các mã trong một từ nối bằng `sep`, các từ nối bằng `wordSep`.
 * Ký tự không có trong bảng giữ nguyên. Ví dụ Morse: tableCodec(MORSE, { sep: ' ', wordSep: ' / ' })
 */
export const tableCodec = (table, { sep, wordSep }) => {
  const rev = invert(table);
  const splitter = x => x.trim() ? new RegExp(`\\s*${x.trim()}\\s*`) : /\s+/;
  return {
    encode: s => s.trim().split(/\s+/).map(w => [...w].map(c => table[c] ?? c).join(sep)).join(wordSep),
    decode: s => s.trim().split(splitter(wordSep))
      .map(w => w.split(splitter(sep)).map(c => rev[c.toLowerCase()] ?? c).join('')).join(' '),
  };
};

/** Mỗi ký tự đổi thành đúng 1 ký tự khác, không cần dấu ngăn (vd: chữ nổi Braille) */
export const charCodec = table => {
  const rev = invert(table);
  return {
    encode: s => [...s].map(c => table[c] ?? c).join(''),
    decode: s => [...s].map(c => rev[c] ?? c).join(''),
  };
};

export const toUtf8 = s => [...new TextEncoder().encode(s)];
/** Ném lỗi nếu các byte không phải UTF-8 hợp lệ */
export const fromUtf8 = bytes => new TextDecoder('utf-8', { fatal: true }).decode(new Uint8Array(bytes));

/** Viết từng byte UTF-8 theo cơ số `base`, đủ `width` chữ số; giữ nguyên dấu và chữ hoa */
export const byteCodec = (base, width, validGroup) => ({
  encode: s => toUtf8(s).map(b => b.toString(base).padStart(width, '0')).join(' '),
  decode: s => {
    const groups = s.trim().split(/\s+/).filter(Boolean);
    if (!groups.every(g => validGroup.test(g))) throw new Error('Mật mã sai định dạng');
    return fromUtf8(groups.map(g => parseInt(g, base)));
  },
});
