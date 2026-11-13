import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const WWW = fileURLToPath(new URL('../www/', import.meta.url));

test('sw.js lưu đủ mọi file của app để chạy offline', () => {
  const listed = new Set([...readFileSync(join(WWW, 'sw.js'), 'utf8').matchAll(/^\s*'([^']+)',$/gm)].map(m => m[1]));
  const files = readdirSync(WWW, { recursive: true })
    .map(f => f.replaceAll('\\', '/'))
    .filter(f => statSync(join(WWW, f)).isFile() && f !== 'sw.js' && !f.endsWith('.txt'));
  for (const f of files) assert.ok(listed.has(f), `sw.js chưa có ${f}`);
  for (const f of listed) assert.ok(f === './' || files.includes(f), `sw.js liệt kê file không tồn tại: ${f}`);
});
