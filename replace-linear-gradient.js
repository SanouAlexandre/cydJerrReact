const fs = require('fs');
const path = require('path');

// Function to recursively find all files in a directory
function findFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      // Skip node_modules and other unnecessary directories
      if (!['node_modules', '.git', 'android', 'ios', '.expo'].includes(file)) {
        findFiles(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.jsx') || file.endsWith('.ts') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  
  return fileList;
}

// Function to replace expo-linear-gradient imports
function replaceLinearGradientImports() {
  const projectRoot = process.cwd();
  const files = findFiles(projectRoot);
  let replacedCount = 0;
  
  files.forEach(filePath => {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      
      // Check if file contains expo-linear-gradient import
      if (content.includes("from 'expo-linear-gradient'") || content.includes('from "expo-linear-gradient"')) {
        console.log(`Processing: ${filePath}`);
        
        // Replace the import statement
        let newContent = content
          .replace(/import\s*{\s*LinearGradient\s*}\s*from\s*['"]expo-linear-gradient['"];?/g, 
                   "import LinearGradient from 'react-native-linear-gradient';")
          .replace(/import\s*{\s*LinearGradient\s*}\s*from\s*['"]expo-linear-gradient['"];?/g, 
                   "import LinearGradient from 'react-native-linear-gradient';");
        
        // Write the updated content back to the file
        fs.writeFileSync(filePath, newContent, 'utf8');
        replacedCount++;
        console.log(`✓ Updated: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`\n✅ Replacement complete! Updated ${replacedCount} files.`);
}

// Run the replacement
replaceLinearGradientImports();