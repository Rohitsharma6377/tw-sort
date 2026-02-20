// tests/cli.test.js
const fs = require('fs-extra');
const path = require('path');
const { findFiles } = require('../src/cli');

describe('CLI helper utilities', () => {
  const tmpDir = path.join(__dirname, 'cli-fixtures');

  beforeEach(() => {
    fs.removeSync(tmpDir);
    fs.ensureDirSync(tmpDir);
  });

  afterAll(() => {
    fs.removeSync(tmpDir);
  });

  test('findFiles returns expected extensions and ignores node_modules', () => {
    // create various files
    const paths = [
      'src/index.jsx',
      'src/app.js',
      'src/styles.css',
      'src/component.vue',
      'src/ignored.txt',
      'node_modules/test.js',
      'dist/app.js'
    ];

    paths.forEach(p => {
      const full = path.join(tmpDir, p);
      fs.ensureDirSync(path.dirname(full));
      fs.writeFileSync(full, '', 'utf-8');
    });

    const found = findFiles(tmpDir);
    expect(found.some(f => f.endsWith('index.jsx'))).toBe(true);
    expect(found.some(f => f.endsWith('app.js'))).toBe(true);
    expect(found.some(f => f.endsWith('styles.css'))).toBe(true);
    expect(found.some(f => f.endsWith('component.vue'))).toBe(true);

    expect(found.every(f => !f.includes('node_modules'))).toBe(true);
    expect(found.every(f => !f.includes('dist'))).toBe(true);
    expect(found.some(f => f.endsWith('ignored.txt'))).toBe(false);
  });
});