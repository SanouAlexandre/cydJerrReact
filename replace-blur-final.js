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
    
    // Replace any remaining intensity props with blurAmount
    let newContent = data.replace(/intensity={/g, 'blurAmount={');
    
    // Add blurType="light" to any BlurView that doesn't have it
    newContent = newContent.replace(/<BlurView\s+blurAmount={([^}]+)}\s+style=/g, 
      '<BlurView blurAmount={$1} blurType="light" style=');
    
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

console.log('Final replacement process started. Check console for results.');