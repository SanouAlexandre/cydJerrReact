const fs = require('fs');
const path = require('path');

// Files to process
const filesToProcess = [
  'legacy/screens/JoyJerrScreen.js',
  'legacy/screens/LoginScreen.js',
  'legacy/components/LoadingScreen.js',
  'legacy/screens/CloudJerrScreen.js',
  'legacy/screens/StoragePlansScreen.js',
  'legacy/screens/ResetPasswordScreen.js',
  'legacy/screens/ShopJerrScreen.js',
  'legacy/screens/StarDetailsScreen.js',
  'legacy/screens/FundingJerrScreen.js',
  'legacy/screens/OnboardingScreen.js',
  'legacy/screens/AvoJerrScreen.js',
  'legacy/screens/SmadJerrScreen.js',
  'legacy/screens/DomJerrScreen.js',
  'legacy/screens/PicJerrScreen.js',
  'legacy/screens/GameJerrScreen.js',
  'legacy/screens/ForgotPasswordScreen.js',
  'legacy/screens/FileManagerScreen.js',
  'legacy/screens/VagoJerrScreen.js',
  'legacy/screens/PlanDetailsScreen.js',
  'legacy/screens/NewsJerrScreen.js',
  'legacy/screens/CodJerrScreen.js',
  'legacy/screens/ImmoJerrScreen.js',
  'legacy/screens/SignupScreen.js',
  'legacy/screens/EmailVerificationScreen.js',
  'legacy/screens/JobJerrScreen.js',
  'legacy/components/ErrorBoundary.js',
  'legacy/screens/SagaJerrScreen.js',
  'legacy/screens/CloudSettingsScreen.js',
  'legacy/screens/LeaseJerrScreen.js',
  'legacy/screens/DoctoJerrScreen.js',
  'legacy/screens/EvenJerrScreen.js',
  'legacy/screens/CapiJerrScreen.js',
  'legacy/screens/TransferScreen.js',
  'legacy/screens/PiolJerrScreen.js',
  'legacy/screens/AppJerrScreen.js',
  'legacy/screens/InvestmentHistoryScreen.js',
  'legacy/screens/KidJerrScreen.js',
  'legacy/screens/CapiJerrProfileScreen.js'
];

// Process each file
filesToProcess.forEach(relativeFilePath => {
  const filePath = path.join(__dirname, relativeFilePath);
  
  // Read file content
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error(`Error reading file ${filePath}:`, err);
      return;
    }
    
    // Replace import statement
    let newContent = data.replace(
      /import\s*{\s*BlurView\s*}\s*from\s*['"]expo-blur['"];?/g,
      "import { BlurView } from '@react-native-community/blur';"
    );
    
    // Replace intensity prop with blurAmount and add blurType
    newContent = newContent.replace(
      /<BlurView\s+intensity={(\d+)}/g, 
      (match, intensity) => {
        return `<BlurView blurAmount={${intensity}} blurType="light"`;
      }
    );
    
    // Handle cases where tint is already specified
    newContent = newContent.replace(
      /<BlurView\s+intensity={(\d+)}\s+tint="([^"]+)"/g,
      (match, intensity, tint) => {
        return `<BlurView blurAmount={${intensity}} blurType="${tint}"`;
      }
    );
    
    // Write updated content back to file
    fs.writeFile(filePath, newContent, 'utf8', err => {
      if (err) {
        console.error(`Error writing file ${filePath}:`, err);
        return;
      }
      console.log(`Successfully updated ${filePath}`);
    });
  });
});

console.log('Replacement process started. Check console for results.');