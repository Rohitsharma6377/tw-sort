// src/index.js
const sorter = require('./core/sorter');
const parser = require('./core/parser');

module.exports = {
  sortClasses: sorter.sortClasses,
  hasTailwindClasses: sorter.hasTailwindClasses,
  processFile: parser.processFile,
  processAndWriteFile: parser.processAndWriteFile
};