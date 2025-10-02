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

// Function to replace expo-image usage in a file
function replaceExpoImageInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;
    
    // Replace expo-image import with React Native Image
    const expoImageImportRegex = /import\s+{\s*Image\s*}\s+from\s+['"]expo-image['"];?\s*\n?/g;
    if (expoImageImportRegex.test(content)) {
      // Check if React Native import already exists
      const hasReactNativeImport = /import\s+{[^}]*}\s+from\s+['"]react-native['"];?/g.test(content);
      
      if (hasReactNativeImport) {
        // Add Image to existing React Native import
        content = content.replace(
          /import\s+{([^}]*)}\s+from\s+['"]react-native['"];?/g,
          (match, imports) => {
            if (!imports.includes('Image')) {
              const cleanImports = imports.trim();
              const newImports = cleanImports ? `${cleanImports}, Image` : 'Image';
              return match.replace(imports, newImports);
            }
            return match;
          }
        );
      } else {
        // Add new React Native import with Image
        const firstImportMatch = content.match(/^import\s+.*$/m);
        if (firstImportMatch) {
          const insertPosition = content.indexOf(firstImportMatch[0]);
          content = content.slice(0, insertPosition) + 
                   'import { Image } from "react-native";\n' + 
                   content.slice(insertPosition);
        } else {
          content = 'import { Image } from "react-native";\n' + content;
        }
      }
      
      // Remove expo-image import
      content = content.replace(expoImageImportRegex, '');
      modified = true;
    }
    
    // Replace contentFit prop with resizeMode (expo-image specific prop)
    const contentFitRegex = /resizeMode=/g;
    if (contentFitRegex.test(content)) {
      content = content.replace(contentFitRegex, 'resizeMode=');
      modified = true;
    }
    
    // Replace contentFit values with resizeMode equivalents
    const contentFitValues = {
      '"contain"': '"contain"',
      '"cover"': '"cover"',
      '"fill"': '"stretch"',
      '"scale-down"': '"contain"',
      '"none"': '"center"'
    };
    
    Object.keys(contentFitValues).forEach(oldValue => {
      const regex = new RegExp(`resizeMode=${oldValue.replace(/"/g, '\\"')}`, 'g');
      if (regex.test(content)) {
        content = content.replace(regex, `resizeMode=${contentFitValues[oldValue]}`);
        modified = true;
      }
    });
    
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
console.log('Starting expo-image replacement...');

const projectRoot = process.cwd();
const files = findFiles(projectRoot);

let modifiedCount = 0;

files.forEach(file => {
  if (replaceExpoImageInFile(file)) {
    console.log(`Updated: ${file}`);
    modifiedCount++;
  }
});

console.log(`\nCompleted! Modified ${modifiedCount} files.`);
console.log('\nNote: expo-image has been replaced with React Native\'s Image component.');
console.log('contentFit props have been converted to resizeMode equivalents.');