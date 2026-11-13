/** Thứ tự đọc các vị trí 0..n-1 khi viết zigzag trên `rails` hàng rồi đọc từng hàng */
const railOrder = (n, rails) => {
  const cycle = 2 * Math.max(2, rails | 0) - 2;
  const row = i => Math.min(i % cycle, cycle - (i % cycle));
  return [...Array(n).keys()].sort((a, b) => row(a) - row(b) || a - b);
};

export default {
  id: 'rail',
  group: 'Có khóa',
  name: 'Hàng rào (zigzag)',
  summary: 'Viết tin nhắn theo hình zigzag trên nhiều hàng rồi đọc lần lượt từng hàng.',
  intro: 'Mật mã hàng rào (rail fence) là mật mã hoán vị: không thay chữ nào cả mà chỉ xáo trộn thứ tự các ký tự. Tên gọi đến từ hình zigzag giống các thanh của hàng rào.',
  rules: [
    'Chọn khóa là số hàng (mặc định 3).',
    'Viết lần lượt từng ký tự theo đường zigzag: đi xuống từ hàng 1 tới hàng cuối, rồi đi lên lại hàng 1, cứ thế lặp lại.',
    'Đọc hết hàng 1 từ trái qua phải, rồi tới hàng 2, hàng 3 … và nối lại thành mật mã.',
    'Ví dụ 3 hàng: WEAREDISCOVEREDFLEEATONCE → WECRLTEERDSOEEFEAOCAIVDEN.',
    'Dấu cách, dấu thanh và chữ hoa đều được giữ nguyên, cũng bị xáo trộn như các ký tự khác.',
  ],
  tip: 'Giải bằng tay: đếm tổng số ký tự, vẽ khung zigzag trống, điền mật mã lần lượt vào từng hàng rồi đọc theo đường zigzag.',
  params: [{
    id: 'rails', label: 'Số hàng', type: 'number', value: 3, min: 2, max: 10,
    help: 'Số hàng của hình zigzag (2–10). Người nhận phải dùng đúng số hàng này để giải.',
  }],

  encode: (text, p) => {
    const chars = [...text.normalize('NFC')];
    return railOrder(chars.length, p.rails).map(i => chars[i]).join('');
  },
  decode: (code, p) => {
    const chars = [...code.normalize('NFC')], out = [];
    railOrder(chars.length, p.rails).forEach((pos, k) => { out[pos] = chars[k]; });
    return out.join('');
  },
};
