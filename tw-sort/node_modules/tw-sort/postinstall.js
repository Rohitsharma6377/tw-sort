// postinstall.js
const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  
  // Add script if it doesn't exist
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  
  if (!packageJson.scripts['tw-sort']) {
    packageJson.scripts['tw-sort'] = 'tw-sort . --write';
    packageJson.scripts['tw-sort:check'] = 'tw-sort . --check';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    
    console.log('\n✅ tw-sort scripts added to your package.json!');
    console.log('Run: npm run tw-sort\n');
  }
} catch (error) {
  // Silent fail - user can add manually
}