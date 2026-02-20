#!/usr/bin/env node

// bin/cli.js
const { program } = require('commander');
const chalk = require('chalk');
const path = require('path');
const { sortDirectory } = require('../src/cli');

program
  .name('tw-sort')
  .description('Sort and optimize Tailwind CSS classes')
  .version('1.0.0');

program
  .argument('[path]', 'Path to files or directory', '.')
  .option('-w, --write', 'Write changes to files (default: dry run)')
  .option('-c, --check', 'Check without modifying (exit with error if unsorted)')
  .option('--no-remove-duplicates', 'Do **not** remove duplicate classes (default: duplicates are removed)')
  .action(async (targetPath, options) => {
    console.log(chalk.blue.bold('🎨 TW-Sort - Tailwind Class Sorter\n'));
    
    const absolutePath = path.resolve(process.cwd(), targetPath);
    
    try {
      await sortDirectory(absolutePath, options);
    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();