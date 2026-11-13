// Giữ dấu tiếng Việt cho các bộ mật mã chỉ có a-z: đổi sang kiểu gõ Telex trước khi mã hoá, đổi ngược khi giải mã.

const VOWELS = 'aăâeêioôơuưy';
const TONE_KEY = { '́': 's', '̀': 'f', '̉': 'r', '̃': 'x', '̣': 'j' };
const TONE_MARK = Object.fromEntries(Object.entries(TONE_KEY).map(([mark, key]) => [key, mark]));
const MOD_KEY = { 'â': 'aa', 'ă': 'aw', 'ê': 'ee', 'ô': 'oo', 'ơ': 'ow', 'ư': 'uw', 'đ': 'dd' };
const MOD_READ = [['uow', 'ươ'], ...Object.entries(MOD_KEY).map(([ch, key]) => [key, ch])];
// Trong tiếng Việt, s/f/r/x/j đứng sau nguyên âm (trong cùng một từ) chỉ có thể là dấu thanh
const TONE_AFTER_VOWEL = new RegExp(`(?<=[${VOWELS}].*)[sfrxj]`);
const SYLLABLE = new RegExp(`^(qu|gi(?=[${VOWELS}])|[^${VOWELS}]*)([${VOWELS}]*)(.*)$`);

/** "Người Việt" -> "nguwowif vieetj" (chữ thường, dấu thanh đặt cuối từ như gõ Telex) */
export const toTelex = s => s.normalize('NFC').toLowerCase().replace(/\p{L}+/gu, word => {
  let tone = '';
  const body = [...word].map(ch => {
    const d = ch.normalize('NFD');
    for (const m of d) tone = TONE_KEY[m] ?? tone;
    const base = d.replace(/[̣̀́̃̉]/g, '').normalize('NFC');
    return MOD_KEY[base] ?? base.normalize('NFD').replace(/[̀-ͯ]/g, '');
  }).join('');
  return body + tone;
});

/**
 * Telex -> tiếng Việt. Nhận dấu thanh ở cuối từ ("vieetj") hoặc ngay sau nguyên âm ("vieejt").
 * shortcut: từ nước ngoài có aa/ee/oo/ow... hoặc s/f/r/x/j sau nguyên âm sẽ bị đọc thành có dấu ("good" -> "gôd")
 */
export const fromTelex = s => s.replace(/[a-zđăâêôơư]+/g, word => {
  for (const [key, ch] of MOD_READ) word = word.replaceAll(key, ch);
  const tone = word.match(TONE_AFTER_VOWEL);
  if (!tone) return word;
  word = word.slice(0, tone.index) + word.slice(tone.index + 1);
  const [, head, v, tail] = word.match(SYLLABLE);
  if (!v) return word + tone[0];
  // Vị trí dấu (kiểu cũ: hòa, thủy): nguyên âm có mũ/móc > có phụ âm cuối thì nguyên âm cuối > 3 nguyên âm thì ở giữa > nguyên âm đầu
  const hat = v.search(/[ăâêôơư](?!.*[ăâêôơư])/);
  const i = hat >= 0 ? hat : tail ? v.length - 1 : v.length === 3 ? 1 : 0;
  return head + v.slice(0, i) + (v[i] + TONE_MARK[tone[0]]).normalize('NFC') + v.slice(i + 1) + tail;
});

/** Bọc bộ mật mã có `vi: true` để tự đổi Telex hai chiều; bộ khác giữ nguyên */
export const withTelex = cipher => !cipher.vi ? cipher : {
  ...cipher,
  encode: (text, p) => cipher.encode(toTelex(text), p),
  decode: (code, p) => fromTelex(cipher.decode(code, p)),
};
