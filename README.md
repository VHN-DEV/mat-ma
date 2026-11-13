# Mật Mã

App mã hoá & giải mã mật thư: 17 bộ mã (Điện thoại, T9, Morse, Caesar, Vigenère, Tọa độ, Hàng rào, Chuồng bò, Chữ nổi, Semaphore, NATO, Nhị phân, Hex, Base64…), hỗ trợ tiếng Việt có dấu, chạy offline. Một mã nguồn web chạy được ở 3 dạng: **trang web**, **PWA** (cài từ trình duyệt trên Android/iPhone) và **app Android** (Capacitor).

## Chạy thử

App dùng ES modules nên phải mở qua `http://`, không mở trực tiếp file:

- XAMPP: http://localhost/New%20folder%20(2)/www/
- Hoặc bất kỳ server tĩnh nào trỏ vào thư mục `www/`.

Chạy test (Node 22+): `npm test`

## Cấu trúc thư mục

```
www/                      Toàn bộ app web (Capacitor đóng gói thư mục này)
├── index.html            Khung giao diện + bộ icon SVG dùng chung (#i-...)
├── manifest.webmanifest  Thông tin PWA (tên, icon, màu)
├── sw.js                 Service worker: lưu file để chạy offline
├── css/                  fonts.css (font nhúng), app.css (giao diện, màu khai báo ở :root)
├── fonts/                Be Vietnam Pro, JetBrains Mono (SIL OFL)
├── icons/                Icon PWA (tạo bằng tools/icons.ps1)
└── js/
    ├── main.js           Điểm vào: trạng thái + nối sự kiện
    ├── core/             Logic dùng chung, không đụng giao diện, test được bằng Node
    │   ├── text.js       Bảng chữ cái, dời chữ, chuẩn hoá khóa
    │   ├── telex.js      Tiếng Việt <-> Telex (giữ dấu cho bộ mã a–z)
    │   ├── codecs.js     Khuôn mã hoá dùng chung: theo bảng, từng ký tự, theo byte
    │   ├── pad.js        Phím cho bàn phím riêng
    │   └── svg.js        Khung SVG cho bộ mã dạng hình
    ├── ciphers/          MỖI BỘ MÃ MỘT FILE
    │   ├── index.js      Danh sách bộ mã + mô tả kiểu dữ liệu Cipher
    │   ├── shared/       Dữ liệu dùng chung giữa vài bộ (bàn phím điện thoại)
    │   └── phone.js, morse.js, …
    ├── ui/               Giao diện: render.js (vẽ), picker.js (hộp chọn), tooltip.js (nút i),
    │                     theme.js (sáng/tối), feedback.js (sao chép, thông báo), dom.js
    └── platform/         Tích hợp app Android: native.js (nhận biết chế độ chạy), embed.js (nút riêng
                          của bong bóng nổi / menu bôi đen chữ). Phần tử có data-modes chỉ hiện ở chế độ đó
test/                     Test tự động (node:test)
tools/icons.ps1           Tạo icon PWA + Android + màn hình chờ
android/                  Dự án Android do Capacitor tạo
capacitor.config.json     Cấu hình app Android (appId, tên app)
```

## Thêm một bộ mật mã mới

1. Tạo file `www/js/ciphers/ten-bo-ma.js`:

   ```js
   export default {
     id: 'ten-bo-ma',                 // cố định, không đổi sau khi phát hành
     group: 'Cơ bản',                 // Cơ bản | Có khóa | Hình | Kỹ thuật
     name: 'Tên hiển thị',
     summary: 'Tóm tắt quy tắc trong 1 câu.',
     intro: 'Giới thiệu: bộ mã là gì, nguồn gốc.',
     rules: ['Bước 1 …', 'Bước 2 …, có ví dụ'],
     tip: 'Mẹo giải (không bắt buộc).',
     vi: true,                        // bộ chỉ xử lý a–z: tự giữ dấu tiếng Việt qua Telex
     encode: (text, p) => …,
     decode: (code, p) => …,          // ném lỗi nếu mật mã sai định dạng
   };
   ```

   Tuỳ chọn thêm: `params` (ô khóa, kèm `help` cho nút i), `pad` (bàn phím riêng), `draw` (bộ mã dạng hình), `chart` (bảng tra). Xem mô tả đầy đủ ở đầu `www/js/ciphers/index.js` và dùng lại các khuôn trong `core/codecs.js`.
2. Import và thêm vào mảng `CIPHERS` trong `www/js/ciphers/index.js`.
3. Thêm đường dẫn file vào `FILES` trong `www/sw.js`.
4. `npm test`: test tự kiểm tra bộ mới có đủ phần giới thiệu, mã hoá rồi giải mã ra đúng tin nhắn, và có trong danh sách offline.

## Cài lên điện thoại

### PWA (Android + iPhone, miễn phí)

Đưa thư mục `www/` lên một host **HTTPS**. Với GitHub Pages: repo đã có sẵn `.github/workflows/pages.yml`, chỉ cần vào repo Settings → Pages → Source chọn **GitHub Actions**; mỗi lần push lên `main`, test chạy xong là trang được cập nhật tại `https://<tài-khoản>.github.io/<tên-repo>/`. Sau đó:

- Android (Chrome): mở trang → menu ⋮ → **Cài đặt ứng dụng**.
- iPhone (Safari): mở trang → nút Chia sẻ → **Thêm vào MH chính**.

Sau lần mở đầu tiên, app chạy được cả khi không có mạng.

### App Android (APK)

Cần JDK 21 và Android SDK.

```powershell
$env:JAVA_HOME = 'C:\Program Files\Microsoft\jdk-21.0.13.21-hotspot'
npx cap sync android          # chép www/ mới nhất vào app; chạy lại mỗi khi sửa web
cd android; .\gradlew.bat assembleDebug
```

File APK: `android/app/build/outputs/apk/debug/app-debug.apk` (cài trực tiếp lên máy để dùng/thử).
Để đưa lên Google Play: đổi `appId` trong `capacitor.config.json` thành tên miền của bạn (không đổi được sau khi đăng), rồi tạo bản ký (Android Studio → Build → Generate Signed App Bundle).

### Dùng khi đang chat (chỉ app Android)

- **Bong bóng nổi**: trong app bấm *Bật bong bóng* (lần đầu cấp quyền "Hiển thị trên ứng dụng khác"). Bong bóng nổi trên Zalo, Messenger…; chạm để mở bảng nhỏ:
  - Nhận tin: sao chép tin nhắn trong Zalo → chạm bong bóng → **Dán & giải mã**.
  - Gửi tin: gõ tin nhắn → **Sao chép mã** (bảng tự thu nhỏ) → dán vào ô chat.
  - Tắt: nút ⏻ trên bảng hoặc nút *Tắt* ở thông báo.
- **Menu bôi đen chữ**: gõ tin trong ô chat → bôi đen → chọn **Mật Mã** trên menu nổi → chọn bộ mã → **Thay vào ô chat**.

Cả hai mở lại đúng giao diện web ở chế độ thu gọn (`index.html?mode=bubble|process`), nên mọi bộ mã mới thêm vào đều tự có ở đây. Thử trên máy tính: mở `www/index.html?mode=bubble`.
Mã native: `android/app/src/main/java/vn/matma/app/` (`BubbleService`, `ProcessTextActivity`, `EmbeddedWeb`, `BubblePlugin`). iPhone không cho app vẽ đè lên app khác nên không có hai tính năng này.

### App iPhone (App Store)

Cần máy Mac có Xcode và tài khoản Apple Developer: `npm i @capacitor/ios && npx cap add ios && npx cap open ios`.

## Giấy phép font

Be Vietnam Pro và JetBrains Mono theo SIL Open Font License 1.1, xem `www/fonts/LICENSE-*.txt`.
