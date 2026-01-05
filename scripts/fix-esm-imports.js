#!/usr/bin/env node
/**
 * Add .js extensions to ESM imports
 * Required for Node.js ESM compatibility
 */

const fs = require('fs');
const path = require('path');
const { glob } = require('glob');

const esmDir = path.join(__dirname, '../dist/esm');

// Find all .js files
const files = glob.sync(`${esmDir}/**/*.js`);

let totalFixed = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let modified = false;
  
  // Helper to resolve import path
  const resolveImport = (basePath, importPath) => {
    if (importPath.endsWith('.js')) return importPath;
    
    const fileDir = path.dirname(basePath);
    const absolutePath = path.resolve(fileDir, importPath);
    
    // Check if it's a directory with index
    if (fs.existsSync(absolutePath) && fs.statSync(absolutePath).isDirectory()) {
      return `${importPath}/index.js`;
    }
    
    // Check if .js file exists
    if (fs.existsSync(`${absolutePath}.js`)) {
      return `${importPath}.js`;
    }
    
    // Default to .js extension
    return `${importPath}.js`;
  };
  
  // Fix relative imports: './module' -> './module.js' or './module/index.js'
  content = content.replace(
    /from ['"](\.[^'"]+)(?<!\.js)['"]/g,
    (match, importPath) => {
      if (importPath.endsWith('.js')) return match;
      modified = true;
      const resolved = resolveImport(file, importPath);
      return `from '${resolved}'`;
    }
  );
  
  // Fix re-exports: export * from './module'
  content = content.replace(
    /export \* from ['"](\.[^'"]+)(?<!\.js)['"]/g,
    (match, importPath) => {
      if (importPath.endsWith('.js')) return match;
      modified = true;
      const resolved = resolveImport(file, importPath);
      return `export * from '${resolved}'`;
    }
  );
  
  // Fix export { } from
  content = content.replace(
    /export \{[^}]+\} from ['"](\.[^'"]+)(?<!\.js)['"]/g,
    (match, importPath) => {
      if (importPath.endsWith('.js')) return match;
      modified = true;
      const resolved = resolveImport(file, importPath);
      return match.replace(`'${importPath}'`, `'${resolved}'`).replace(`"${importPath}"`, `"${resolved}"`);
    }
  );
  
  if (modified) {
    fs.writeFileSync(file, content, 'utf8');
    totalFixed++;
  }
});

console.log(`✅ Fixed ESM imports in ${totalFixed} files`);

