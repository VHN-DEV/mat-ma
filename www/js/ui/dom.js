// Tiện ích DOM dùng chung.

export const $ = id => document.getElementById(id);

/** Chống chèn mã HTML khi đưa chữ của người dùng vào innerHTML */
export const escapeHTML = s => String(s).replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
