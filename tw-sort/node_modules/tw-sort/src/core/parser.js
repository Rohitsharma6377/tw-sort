// src/core/parser.js
const fs = require('fs-extra');

/**
 * Extract and sort className from HTML/JSX files
 */
function processFile(filePath, { sorter }) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  const patterns = [
    /className=["']([^"']+)["']/g,
    /className=\{`([^`]+)`\}/g,
    /class=["']([^"']+)["']/g,
    /:class=["']([^"']+)["']/g
  ];
  
  let updatedContent = content;
  let changesCount = 0;
  
  patterns.forEach(pattern => {
    updatedContent = updatedContent.replace(pattern, (match, classString) => {
      const sorted = sorter.sortClasses(classString);
      
      if (sorted !== classString) {
        changesCount++;
      }
      
      return match.replace(classString, sorted);
    });
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
  const { write = false, sorter } = options;
  
  try {
    const result = processFile(filePath, { sorter });
    
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