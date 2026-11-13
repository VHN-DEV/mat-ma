// Tiện ích xử lý chữ dùng chung cho các bộ mật mã (thuần logic, không đụng tới giao diện).

export const ABC = 'abcdefghijklmnopqrstuvwxyz';

/** Chia lấy dư luôn dương: mod(-1, 26) = 25 */
export const mod = (n, m) => ((n % m) + m) % m;

/** Đảo bảng mã {a: '.-'} -> {'.-': 'a'}; mã viết thường để giải mã không phân biệt hoa thường */
export const invert = table => Object.fromEntries(Object.entries(table).map(([k, v]) => [v.toLowerCase(), k]));

/** Chuẩn hoá khóa người dùng nhập: bỏ dấu, chỉ giữ a-z 0-9 ("Khóa 1" -> "khoa1") */
export const keyOf = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/gi, 'd').toLowerCase().replace(/[^a-z0-9]/g, '');

/** Đổi từng chữ a-z theo vị trí: f(0..25) trả về vị trí mới, tự quay vòng trong bảng chữ cái */
export const shiftLetters = (s, f) => s.replace(/[a-z]/g, c => ABC[mod(f(ABC.indexOf(c)), 26)]);

/** Bảng tra a-z: [['a', f('a')], ['b', f('b')], ...] */
export const letterChart = f => [...ABC].map(c => [c, f(c)]);
