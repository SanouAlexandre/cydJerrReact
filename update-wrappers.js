const fs = require('fs');
const path = require('path');

// List of wrapper files that follow the same pattern
const wrapperFiles = [
  'DoctoJerr.tsx',
  'NewsJerr.tsx', 
  'CydJerrNation.tsx',
  'JobJerr.tsx',
  'CodeJerr.tsx',
  'PicJerr.tsx',
  'CapiJerr.tsx',
  'ChabJerr.tsx',
  'SpeakJerr.tsx',
  'ShopJerr.tsx',
  'DomJerr.tsx',
  'KidJerr.tsx',
  'AppJerr.tsx',
  'CloudJerr.tsx',
  'PiolJerr.tsx',
  'SmadJerr.tsx',
  'ImmoJerr.tsx',
  'AssuJerr.tsx',
  'EvenJerr.tsx',
  'FundingJerr.tsx',
  'StarJerr.tsx',
  'TeachJerr.tsx',
  'AvoJerr.tsx'
];

const appDir = path.join(__dirname, 'app');

wrapperFiles.forEach(fileName => {
  const filePath = path.join(appDir, fileName);
  
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace expo-router import with React Navigation imports
    content = content.replace(
      'import { useRouter } from "expo-router";',
      `import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '@/src/navigation/types';`
    );
    
    // Replace useRouter hook
    content = content.replace(
      'const router = useRouter();',
      'const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();'
    );
    
    // Replace fakeNavigation object
    content = content.replace(
      /const fakeNavigation = \{[\s\S]*?\};/,
      `const fakeNavigation = {
    goBack: () => navigation.goBack(),
    navigate: (path: string) => navigation.navigate(path.replace("/", "") as keyof RootStackParamList),
    replace: (path: string) => navigation.replace(path.replace("/", "") as keyof RootStackParamList),
  };`
    );
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${fileName}`);
  } else {
    console.log(`File not found: ${fileName}`);
  }
});

console.log('Wrapper files update completed!');