
# TW-Sort

TW-Sort is a small CLI and library to sort and optimize Tailwind CSS utility classes in your HTML, JSX, Vue, Svelte, and JS/TS files. It ensures a consistent class order, removes duplicates, and supports state modifiers like `hover:` and `focus:`.

## Features

- Sort Tailwind classes into a recommended order
- Remove duplicate classes
- Works with HTML, JSX, Vue, Svelte, JS, TS **and CSS/SCSS/SASS** files (including `@apply` rules)
- CLI for scanning and optionally writing changes

## Installation

Install locally in your project:

```bash
npm install --save-dev ./
```

Or install globally (from this repo path):

```bash
npm install -g ./
```

## CLI Usage

Run a dry run (default) that reports files needing sorting. If you omit the path the tool will automatically search common directories such as `src`, `app`, `pages`, or `components` if present; otherwise it scans the current folder.

```bash
node bin/cli.js [path]
```

Apply changes in-place:

```bash
node bin/cli.js <path> --write
```

Check mode (exit non-zero if files need sorting):

```bash
node bin/cli.js <path> --check
```

Options:

- `--write`, `-w`: Write changes to files
- `--check`, `-c`: Exit with error if unsorted files are found
- `--no-remove-duplicates`: Disable removal of duplicate classes (duplicates are removed by default)

You can also process `@apply` directives in CSS/SCSS/SASS; the CLI will include `*.css`, `*.scss`, and `*.sass` files in the search patterns.

## Programmatic API

Use the library in Node.js:

```js
const { sortClasses, processFile, processAndWriteFile } = require('./src');

// Sort a class string
console.log(sortClasses('text-red-500 p-4 flex mt-2 bg-white'));

// Process a file (dry-run)
processAndWriteFile('test/example.html', { write: false, sorter: require('./src/core/sorter') })
	.then(res => console.log(res));
```

## Example

Given `test/example.html` with mixed Tailwind classes, run the CLI to see which files need sorting, or run with `--write` to apply changes.

## Contributing

Contributions, bug reports and enhancements are welcome. Please open an issue or pull request.

## License

This project is licensed under the MIT License — see the `LICENSE` file for details.

## Author

Rohit Sharma — https://rohitsharmadev.me
