// tests/sorter.test.js
const { sortClasses } = require('../src/core/sorter');

describe('Tailwind Class Sorter', () => {
  test('sorts basic classes correctly', () => {
    const input = 'text-red-500 p-4 flex mt-2 bg-white';
    const expected = 'flex mt-2 p-4 bg-white text-red-500';
    expect(sortClasses(input)).toBe(expected);
  });
  
  test('removes duplicate classes', () => {
    const input = 'flex flex p-4 p-4 text-red-500';
    const expected = 'flex p-4 text-red-500';
    expect(sortClasses(input)).toBe(expected);
  });
  
  test('handles state modifiers', () => {
    const input = 'hover:bg-blue-500 flex bg-white';
    const expected = 'flex bg-white hover:bg-blue-500';
    expect(sortClasses(input)).toBe(expected);
  });
  
  test('handles empty string', () => {
    expect(sortClasses('')).toBe('');
  });
  
  test('handles null or undefined', () => {
    expect(sortClasses(null)).toBe('');
    expect(sortClasses(undefined)).toBe('');
  });
  
  test('preserves single class', () => {
    const input = 'flex';
    expect(sortClasses(input)).toBe('flex');
  });
  
  test('handles complex layout', () => {
    const input = 'text-white bg-blue-500 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow';
    const result = sortClasses(input);
    
    // Check that classes are present
    expect(result).toContain('p-6');
    expect(result).toContain('bg-blue-500');
    expect(result).toContain('text-white');
    expect(result).toContain('rounded-lg');
  });

  test('optionally keeps duplicates when requested', () => {
    const input = 'flex flex p-4 p-4 text-red-500';
    const result = sortClasses(input, { removeDuplicates: false });
    expect(result).toBe('flex flex p-4 p-4 text-red-500');
  });
});