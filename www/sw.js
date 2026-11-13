// Chạy offline: trả file từ bộ nhớ đệm ngay, đồng thời tải bản mới ở nền cho lần mở sau.
// Thêm file mới vào www/ thì thêm vào FILES (test/sw.test.js sẽ báo nếu quên).
const CACHE = 'mat-ma';
const FILES = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/fonts.css',
  'css/app.css',
  'fonts/be-vietnam-pro-latin-400-normal.woff2',
  'fonts/be-vietnam-pro-latin-600-normal.woff2',
  'fonts/be-vietnam-pro-latin-700-normal.woff2',
  'fonts/be-vietnam-pro-vietnamese-400-normal.woff2',
  'fonts/be-vietnam-pro-vietnamese-600-normal.woff2',
  'fonts/be-vietnam-pro-vietnamese-700-normal.woff2',
  'fonts/jetbrains-mono-latin-wght-normal.woff2',
  'fonts/jetbrains-mono-vietnamese-wght-normal.woff2',
  'icons/apple-touch-icon.png',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'js/main.js',
  'js/core/codecs.js',
  'js/core/pad.js',
  'js/core/svg.js',
  'js/core/telex.js',
  'js/core/text.js',
  'js/ui/dom.js',
  'js/ui/feedback.js',
  'js/ui/picker.js',
  'js/ui/render.js',
  'js/ui/theme.js',
  'js/ui/tooltip.js',
  'js/platform/native.js',
  'js/platform/embed.js',
  'js/ciphers/index.js',
  'js/ciphers/shared/keypad.js',
  'js/ciphers/atbash.js',
  'js/ciphers/base64.js',
  'js/ciphers/binary.js',
  'js/ciphers/braille.js',
  'js/ciphers/caesar.js',
  'js/ciphers/hex.js',
  'js/ciphers/morse.js',
  'js/ciphers/nato.js',
  'js/ciphers/number.js',
  'js/ciphers/phone.js',
  'js/ciphers/pigpen.js',
  'js/ciphers/polybius.js',
  'js/ciphers/rail-fence.js',
  'js/ciphers/reverse.js',
  'js/ciphers/semaphore.js',
  'js/ciphers/t9.js',
  'js/ciphers/vigenere.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(cache => cache.addAll(FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(async cache => {
    const cached = await cache.match(e.request, { ignoreSearch: true });
    const fresh = fetch(e.request).then(res => {
      if (res.ok) cache.put(e.request, res.clone());
      return res;
    });
    if (!cached) return fresh;
    e.waitUntil(fresh.catch(() => {}));
    return cached;
  }));
});
