import assert from 'node:assert/strict';
import test from 'node:test';
import { CIPHERS, defaultParams } from '../www/js/ciphers/index.js';
import { fromTelex, toTelex } from '../www/js/core/telex.js';

const byId = id => CIPHERS.find(c => c.id === id);
const SENTENCE = 'Người Việt Nam yêu hòa bình, quý trọng tự do và độc lập. Xin chào thế giới, mom ơi!';

test('Telex: tiếng Việt <-> Telex', () => {
  assert.equal(toTelex('Việt Nam'), 'vieetj nam');
  assert.equal(toTelex('Người'), 'nguwowif');
  assert.equal(fromTelex(toTelex(SENTENCE)), SENTENCE.toLowerCase());
  // Telex do người gõ: dấu ở cuối từ hoặc ngay sau nguyên âm
  for (const [telex, viet] of [['vieetj', 'việt'], ['vieejt', 'việt'], ['ddinhj', 'định'], ['nguowif', 'người'], ['gif', 'gì'],
    ['giaf', 'già'], ['quas', 'quá'], ['cuar', 'của'], ['khuyur', 'khuỷu'], ['ngoaif', 'ngoài'], ['hoangf', 'hoàng'], ['dduwowcj', 'được']]) {
    assert.equal(fromTelex(telex), viet, telex);
  }
  assert.equal(fromTelex('anh nam di choi'), 'anh nam di choi'); // chữ không dấu giữ nguyên
});

test('mọi bộ: có đủ thông tin hiển thị và giới thiệu', () => {
  const ids = new Set();
  for (const c of CIPHERS) {
    assert.ok(!ids.has(c.id), `trùng id ${c.id}`);
    ids.add(c.id);
    for (const field of ['id', 'group', 'name', 'summary', 'intro']) assert.ok(c[field]?.trim(), `${c.id} thiếu ${field}`);
    assert.ok(c.rules?.length > 0, `${c.id} thiếu rules`);
    for (const p of c.params ?? []) assert.ok(p.help, `${c.id}: khóa ${p.id} thiếu help`);
  }
});

test('mọi bộ: mã hoá rồi giải mã ra lại tin nhắn', () => {
  for (const c of CIPHERS.filter(c => c.id !== 't9')) { // T9 chỉ giải ra các chữ có thể có
    const p = defaultParams(c);
    assert.equal(c.decode(c.encode(SENTENCE, p), p), c.vi ? SENTENCE.toLowerCase() : SENTENCE, c.name);
  }
});

test('ví dụ đã biết (kể cả ví dụ ghi trong phần quy tắc)', () => {
  const enc = (id, s, p = {}) => byId(id).encode(s, { ...defaultParams(byId(id)), ...p });
  const dec = (id, s, p = {}) => byId(id).decode(s, { ...defaultParams(byId(id)), ...p });
  assert.equal(dec('phone', '6626'), 'nam');
  assert.equal(dec('phone', '66 2 6'), 'nam');
  assert.equal(enc('phone', 'mom'), '6 666 6');
  assert.equal(enc('phone', 'a 2'), '202222');
  assert.equal(enc('phone', 'Định'), '3 344466445');
  assert.equal(enc('t9', 'nam'), '626');
  assert.equal(enc('t9', 'Việt'), '843385');
  assert.equal(dec('t9', '626'), '[mno][abc][mno]');
  assert.equal(enc('morse', 'sos'), '... --- ...');
  assert.equal(enc('morse', 'ơ'), '--- .--');
  assert.equal(enc('number', 'nam'), '14-1-13');
  assert.equal(enc('number', 'Nam Định'), '14-1-13 4-4-9-14-8-10');
  assert.equal(enc('caesar', 'nam'), 'qdp');
  assert.equal(enc('atbash', 'nam'), 'mzn');
  assert.equal(enc('reverse', 'Việt Nam'), 'maN tệiV');
  assert.equal(enc('vigenere', 'attack at dawn', { key: 'lemon' }), 'lxfopv ef rnhr');
  assert.equal(enc('polybius', 'nam'), '32 11 31');
  assert.equal(enc('polybius', 'fg'), '16 21');
  assert.equal(enc('rail', 'WEAREDISCOVEREDFLEEATONCE'), 'WECRLTEERDSOEEFEAOCAIVDEN');
  assert.equal(enc('braille', 'nam'), '⠝⠁⠍');
  assert.equal(enc('nato', 'nam'), 'November Alfa Mike');
  assert.equal(enc('binary', 'A'), '01000001');
  assert.equal(enc('binary', 'ệ'), '11100001 10111011 10000111');
  assert.equal(enc('hex', 'ệ'), 'e1 bb 87');
  assert.equal(enc('base64', 'Việt Nam'), Buffer.from('Việt Nam').toString('base64'));
  assert.throws(() => dec('base64', '%%%'));
  assert.throws(() => dec('binary', '0102'));
});

test('bộ dạng hình có hình cho đủ 26 chữ', () => {
  for (const c of CIPHERS.filter(c => c.draw)) {
    for (const ch of 'abcdefghijklmnopqrstuvwxyz') assert.match(c.draw(ch), /^<svg/, `${c.name} ${ch}`);
  }
});
