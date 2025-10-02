const fs = require('fs');
const path = require('path');

// Function to recursively find all JS/JSX/TS/TSX files
function findFiles(dir, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  let results = [];
  
  try {
    const list = fs.readdirSync(dir);
    
    list.forEach(file => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      
      if (stat && stat.isDirectory()) {
        // Skip node_modules and other unnecessary directories
        if (!['node_modules', '.git', 'android', 'ios', '__tests__'].includes(file)) {
          results = results.concat(findFiles(filePath, extensions));
        }
      } else {
        const ext = path.extname(file);
        if (extensions.includes(ext)) {
          results.push(filePath);
        }
      }
    });
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  
  return results;
}

// Function to replace expo-font usage in a file
function replaceExpoFontInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Remove expo-font import
    const expoFontImportRegex = /import\s+{\s*useFonts\s*}\s+from\s+['"]expo-font['"];?\s*\n?/g;
    if (expoFontImportRegex.test(content)) {
      content = content.replace(expoFontImportRegex, '');
      modified = true;
    }
    
    // Remove useFonts hook usage and font loading logic
    const useFontsRegex = /const\s+\[([^\]]+)\]\s*=\s*useFonts\(\{[^}]*\}\);?\s*\n?/g;
    if (useFontsRegex.test(content)) {
      content = content.replace(useFontsRegex, '');
      modified = true;
    }
    
    // Remove font loading conditional rendering
    const fontLoadingRegex = /if\s*\(\s*!\s*\w*[Ll]oaded\s*\)\s*\{\s*return\s+null;\s*\}\s*\n?/g;
    if (fontLoadingRegex.test(content)) {
      content = content.replace(fontLoadingRegex, '');
      modified = true;
    }
    
    // Remove SplashScreen.hideAsync() calls related to font loading
    const splashScreenRegex = /useEffect\(\(\)\s*=>\s*\{\s*if\s*\(\s*\w*[Ll]oaded\s*\)\s*\{\s*SplashScreen\.hideAsync\(\);\s*\}\s*\},\s*\[\w*[Ll]oaded\]\);\s*\n?/g;
    if (splashScreenRegex.test(content)) {
      content = content.replace(splashScreenRegex, '');
      modified = true;
    }
    
    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error.message);
    return false;
  }
}

// Main execution
console.log('Starting expo-font replacement...');

const projectRoot = process.cwd();
const files = findFiles(projectRoot);

let modifiedCount = 0;

files.forEach(file => {
  if (replaceExpoFontInFile(file)) {
    console.log(`Updated: ${file}`);
    modifiedCount++;
  }
});

console.log(`\nCompleted! Modified ${modifiedCount} files.`);
console.log('\nNote: Custom fonts will now need to be registered in react-native.config.js');
console.log('and referenced by their font family name in styles.');