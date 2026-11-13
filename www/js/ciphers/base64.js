import { fromUtf8, toUtf8 } from '../core/codecs.js';

export default {
  id: 'base64',
  group: 'Kỹ thuật',
  name: 'Base64',
  summary: 'Chuẩn viết lại dữ liệu thành chuỗi gồm A–Z, a–z, 0–9, + và /.',
  intro: 'Base64 được dùng khắp nơi trong máy tính để gửi dữ liệu qua email, đường link, JSON … Nó không phải mật mã bảo mật mà chỉ là cách viết lại dữ liệu, nhưng nhìn vào thì không đọc được ngay.',
  rules: [
    'Tin nhắn được đổi sang các byte UTF-8.',
    'Cứ 3 byte (24 bit) được chia thành 4 nhóm 6 bit; mỗi nhóm ứng với 1 trong 64 ký tự A–Z, a–z, 0–9, +, /.',
    'Nếu số byte không chia hết cho 3 thì thêm dấu = ở cuối cho đủ.',
    'Giữ nguyên dấu và chữ hoa.',
  ],
  tip: 'Mật mã Base64 thường có một hoặc hai dấu = ở cuối, đó là dấu hiệu để nhận ra nó.',

  encode: text => btoa(String.fromCharCode(...toUtf8(text))),
  decode: code => fromUtf8([...atob(code.replace(/\s/g, ''))].map(c => c.charCodeAt(0))), // atob ném lỗi nếu sai định dạng
};
