// tests/parser.test.js
const fs = require('fs-extra');
const path = require('path');
const parser = require('../src/core/parser');
const sorter = require('../src/core/sorter');

describe('Parser', () => {
  const tmpDir = path.join(__dirname, 'tmp');

  beforeEach(() => {
    fs.removeSync(tmpDir);
    fs.ensureDirSync(tmpDir);
  });

  afterAll(() => {
    fs.removeSync(tmpDir);
  });

  test('sorts className attributes in JSX file', () => {
    const file = path.join(tmpDir, 'component.jsx');
    const content = '<div className="text-red-500 p-4 flex" />';
    fs.writeFileSync(file, content, 'utf-8');

    const result = parser.processFile(file, { sorter });
    expect(result.changed).toBe(true);
    expect(result.content).toContain('flex p-4 text-red-500');
  });

  test('sorts @apply directive in CSS file', () => {
    const file = path.join(tmpDir, 'styles.css');
    const content = `.btn { @apply text-white bg-blue-500 p-4; }`;
    fs.writeFileSync(file, content, 'utf-8');

    const result = parser.processFile(file, { sorter });
    expect(result.changed).toBe(true);
    expect(result.content).toContain('@apply p-4 bg-blue-500 text-white;');
  });

  test('honors removeDuplicates option', () => {
    const file = path.join(tmpDir, 'dup.jsx');
    const content = '<div class="flex flex p-4 p-4" />';
    fs.writeFileSync(file, content, 'utf-8');
    
    const result = parser.processFile(file, { sorter, removeDuplicates: false });
    // duplicates should remain when option is false
    expect(result.content).toContain('flex flex p-4 p-4');
  });
});