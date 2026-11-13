const reverse = s => [...s.normalize('NFC')].reverse().join('');

export default {
  id: 'reverse',
  group: 'Cơ bản',
  name: 'Đọc ngược',
  summary: 'Viết ngược toàn bộ tin nhắn, từ ký tự cuối lên ký tự đầu.',
  intro: 'Dạng mật thư đơn giản nhất: không thay chữ nào cả, chỉ đảo thứ tự. Thường được dùng kết hợp với bộ khác (ví dụ mã hoá Morse rồi viết ngược) để tăng độ khó.',
  rules: [
    'Đọc tin nhắn từ ký tự cuối cùng ngược về ký tự đầu tiên và chép lại theo đúng thứ tự đó.',
    'Giữ nguyên dấu, chữ hoa, dấu cách và dấu câu: "Việt Nam" → "maN tệiV".',
    'Giải mã: viết ngược thêm một lần nữa.',
  ],
  encode: reverse,
  decode: reverse,
};
