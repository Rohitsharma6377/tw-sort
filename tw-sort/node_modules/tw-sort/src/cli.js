// src/cli.js
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');
const chalk = require('chalk');
const sorter = require('./core/sorter');
const parser = require('./core/parser');

/**
 * Find all files to process (WINDOWS COMPATIBLE)
 */
function findFiles(targetPath) {
  try {
    const stats = fs.statSync(targetPath);
    
    if (stats.isFile()) {
      return [targetPath];
    }
  } catch (error) {
    console.error(chalk.red(`Error: Path not found - ${targetPath}`));
    return [];
  }
  
  // Use forward slashes for glob (works on Windows too)
  const normalizedPath = targetPath.replace(/\\/g, '/');
  
  const patterns = [
    `${normalizedPath}/**/*.jsx`,
    `${normalizedPath}/**/*.tsx`,
    `${normalizedPath}/**/*.js`,
    `${normalizedPath}/**/*.ts`,
    `${normalizedPath}/**/*.html`,
    `${normalizedPath}/**/*.vue`,
    `${normalizedPath}/**/*.svelte`
  ];
  
  const files = [];
  
  patterns.forEach(pattern => {
    try {
      const matches = glob.sync(pattern, {
        ignore: ['**/node_modules/**', '**/dist/**', '**/build/**'],
        nodir: true,
        windowsPathsNoEscape: true
      });
      files.push(...matches);
    } catch (error) {
      console.error(chalk.red(`Error searching files: ${error.message}`));
    }
  });
  
  return [...new Set(files)];
}

/**
 * Sort classes in a directory
 */
async function sortDirectory(targetPath, options = {}) {
  const { write = false, check = false } = options;
  
  console.log(chalk.gray(`Scanning: ${targetPath}\n`));
  
  const files = findFiles(targetPath);
  
  if (files.length === 0) {
    console.log(chalk.yellow('⚠ No files found to process.'));
    console.log(chalk.gray('\nLooking for: .jsx, .tsx, .js, .ts, .html, .vue, .svelte files'));
    return;
  }
  
  console.log(chalk.gray(`Found ${files.length} file(s)\n`));
  
  let processedCount = 0;
  let changedCount = 0;
  let errorCount = 0;
  
  for (const file of files) {
    const result = await parser.processAndWriteFile(file, {
      write,
      sorter
    });
    
    if (result.success) {
      processedCount++;
      
      if (result.changed) {
        changedCount++;
        const status = write ? chalk.green('✓ Sorted') : chalk.yellow('⚠ Needs sorting');
        console.log(`${status} ${chalk.gray(path.relative(process.cwd(), file))}`);
      }
    } else {
      errorCount++;
      console.log(chalk.red(`✗ Error: ${file}`));
      console.log(chalk.red(`  ${result.error}`));
    }
  }
  
  console.log('\n' + chalk.bold('Summary:'));
  console.log(chalk.gray(`  Processed: ${processedCount} files`));
  console.log(chalk.yellow(`  Changed: ${changedCount} files`));
  
  if (errorCount > 0) {
    console.log(chalk.red(`  Errors: ${errorCount} files`));
  }
  
  if (!write && changedCount > 0) {
    console.log('\n' + chalk.blue('ℹ Run with --write to apply changes'));
  }
  
  if (check && changedCount > 0) {
    console.log('\n' + chalk.red('Some files need sorting!'));
    process.exit(1);
  }
  
  console.log('\n' + chalk.green('✨ Done!'));
}

module.exports = {
  sortDirectory,
  findFiles
};