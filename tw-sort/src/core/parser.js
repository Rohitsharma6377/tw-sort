// src/core/parser.js
const fs = require('fs-extra');

/**
 * Extract and sort className from HTML/JSX files
 */
function processFile(filePath, { sorter, removeDuplicates = true }) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const patterns = [
    /className=["']([^"']+)["']/g,
    /className=\{`([^`]+)`\}/g,
    /class=["']([^"']+)["']/g,
    /:class=["']([^"']+)["']/g
  ];
  
  // Additional pattern for CSS @apply rules
  const applyPattern = /@apply\s+([^;]+);/g;
  
  let updatedContent = content;
  let changesCount = 0;
  
  // sort attributes/props
  patterns.forEach(pattern => {
    updatedContent = updatedContent.replace(pattern, (match, classString) => {
      const sorted = sorter.sortClasses(classString, { removeDuplicates });
      
      if (sorted !== classString) {
        changesCount++;
      }
      
      return match.replace(classString, sorted);
    });
  });
  
  // sort @apply rules in CSS/SCSS/SASS
  updatedContent = updatedContent.replace(applyPattern, (match, classList) => {
    const sorted = sorter.sortClasses(classList, { removeDuplicates });
    if (sorted !== classList) {
      changesCount++;
      return `@apply ${sorted};`;
    }
    return match;
  });
  
  return {
    content: updatedContent,
    changed: changesCount > 0,
    changesCount
  };
}

/**
 * Process a single file and optionally write changes
 */
async function processAndWriteFile(filePath, options = {}) {
  const { write = false, sorter, removeDuplicates = true } = options;
  
  try {
    const result = processFile(filePath, { sorter, removeDuplicates });
    
    if (result.changed && write) {
      await fs.writeFile(filePath, result.content, 'utf-8');
    }
    
    return {
      filePath,
      success: true,
      changed: result.changed,
      changesCount: result.changesCount
    };
  } catch (error) {
    return {
      filePath,
      success: false,
      error: error.message
    };
  }
}

module.exports = {
  processFile,
  processAndWriteFile
};