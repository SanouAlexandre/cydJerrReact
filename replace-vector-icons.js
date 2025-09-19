const fs = require('fs');
const path = require('path');

// Directories to scan
const directories = [
  path.join(__dirname, 'app'),
  path.join(__dirname, 'legacy')
];

// Function to process a file
function processFile(filePath) {
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }

    // Replace @expo/vector-icons with react-native-vector-icons
    const newContent = data.replace(/@expo\/vector-icons/g, 'react-native-vector-icons');

    // Write the file back
    fs.writeFile(filePath, newContent, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
        return;
      }
      console.log(`Successfully updated ${filePath}`);
    });
  });
}

// Function to scan directory recursively
function scanDirectory(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}:`, err);
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(directory, file.name);
      
      if (file.isDirectory()) {
        scanDirectory(fullPath);
      } else if (file.isFile() && (file.name.endsWith('.js') || file.name.endsWith('.jsx') || file.name.endsWith('.ts') || file.name.endsWith('.tsx'))) {
        // Check if file contains @expo/vector-icons
        fs.readFile(fullPath, 'utf8', (err, data) => {
          if (err) {
            console.error(`Error reading file ${fullPath}:`, err);
            return;
          }
          
          if (data.includes('@expo/vector-icons')) {
            processFile(fullPath);
          }
        });
      }
    });
  });
}

// Start scanning directories
directories.forEach(dir => {
  console.log(`Scanning directory: ${dir}`);
  scanDirectory(dir);
});

console.log('Replacement process started. Check console for results.');