Developer & Build Instructions
===============================

This document shows how to build, test and use the `tw-sort` project locally.

Prerequisites
- Node.js (16+ recommended)
- npm (bundled with Node)

Install dependencies

```bash
npm install
```

Run tests

```bash
npm test
```

Run CLI (dry-run)

```bash
node bin/cli.js .
```

Apply sorting to files under current directory

```bash
node bin/cli.js . --write
```

Useful npm scripts
- `npm run sort` — runs `node bin/cli.js . --write`
- `npm run sort:check` — runs `node bin/cli.js . --check`

Project layout
- `bin/cli.js` — CLI entry
- `src/core/sorter.js` — core class ordering + sorting logic
- `src/core/parser.js` — file parsing and replacement
- `src/cli.js` — file discovery and orchestration
- `tests/` — Jest test suite

How the sorter works (brief)
- A `CLASS_ORDER` array defines priority patterns (prefixes end with `-`)
- `getClassPriority()` maps a class to its index in the order (supports modifiers like `hover:`)
- `sortClasses()` splits the class string, removes duplicates, and sorts by priority

Making changes
- Update `CLASS_ORDER` in `src/core/sorter.js` to tweak ordering
- Add tests in `tests/` to assert behavior

Publishing
- Bump `version` in `package.json`
- Run `npm publish` (requires npm account)

If you want, I can add a small CONTRIBUTING.md or example walkthrough next.
