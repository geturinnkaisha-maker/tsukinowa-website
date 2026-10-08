// Run: node --test tests/works-data.test.cjs (no dependencies).
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { window: {}, document: { querySelectorAll: () => [] } };
vm.createContext(context);
vm.runInContext(fs.readFileSync('assets/js/works-data.js', 'utf8'), context);
vm.runInContext(fs.readFileSync('assets/js/works.js', 'utf8'), context);
const select = context.window.WORKS.publishedWorks;
const record = (id, changes = {}) => ({ id, title: id, category: 'ドア補修', date: '2026-09', publishedAt: '2026-10-05', beforeImage: `assets/images/works/real/${id}/before.webp`, afterImage: `assets/images/works/real/${id}/after.webp`, imageType: 'real', published: true, ...changes });
test('published real cases have complete actual WebP pairs; drafts stay hidden', () => {
  const works = select(context.window.WORKS_DATA);
  assert.equal(works.length, 4);
  for (const work of works) for (const key of ['beforeImage', 'afterImage']) assert.ok(fs.existsSync(work[key]), work[key]);
  assert.equal(context.window.WORKS_DATA.length, 4);
  assert.ok(!context.window.WORKS_DATA.some(work => work.id === 'pet-wall-repair'));
  const pet = works.filter(work => work.title.includes('ペット'));
  assert.equal(pet.length, 1);
  assert.equal(pet[0].title, 'ペットによる壁面破損の補修');
  assert.equal(pet[0].category, '壁面補修');
  assert.equal(pet[0].description, 'ペットによる壁面の破損箇所を補修しました。');
  assert.ok(!/原状回復|クロス補修/.test(pet[0].title + pet[0].category + pet[0].description));
});
test('new records sort by date, then publication date; missing month uses publication date', () => {
  const works = select([record('old', {date:'2025-12'}), record('tie-old', {publishedAt:'2026-09-30'}), record('tie-new'), record('unknown', {date:''}), record('newest', {date:'2026-11'})]);
  assert.equal(Array.from(works, work => work.id).join(','), 'newest,unknown,tie-new,tie-old,old');
  assert.equal(works.slice(0,4).length,4);
  assert.equal(works.length,5);
});
test('AI, illustration paths, unknown provenance, drafts and duplicate IDs cannot enter Works', () => {
  const good = record('good');
  const input = [good, good, record('ai', {imageType:'ai'}), record('missing', {imageType:undefined}), record('illustration', {beforeImage:'assets/images/illustrations/services/floor-v3.webp'}), record('wrong-case', {afterImage:good.afterImage}), record('draft', {published:false}), record('no-before', {beforeImage:''}), record('no-after', {afterImage:undefined}), record('no-title', {title:' '}), record('no-category', {category:''}), record('../escape')];
  assert.equal(Array.from(select(input), work => work.id).join(','), 'good');
});
test('future categories and commented blank template do not create cases or missing image references', () => {
  assert.deepEqual(Array.from(context.window.WORKS_CATEGORIES), ['クロス張替え','壁面補修','穴補修','ドア補修','CF・床施工','原状回復','その他内装補修']);
  assert.equal(context.window.WORKS_DATA.length, 4);
  assert.deepEqual(fs.readdirSync('assets/images/works/real/_template'), ['README.md']);
});
