const glob = require('glob');
const path = require('path');

const targetPath = path.resolve('./test');
console.log('Target path:', targetPath);

const pattern = path.join(targetPath, '**/*.html').replace(/\\/g, '/');
console.log('Pattern:', pattern);

const files = glob.sync(pattern, { windowsPathsNoEscape: true });
console.log('Found files:', files);
