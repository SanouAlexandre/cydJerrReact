import React from 'react';
import { TouchableOpacity, Linking, Alert } from 'react-native';

interface ExternalLinkProps {
  href: string;
  children: React.ReactNode;
  style?: any;
}

export function ExternalLink({ href, children, style }: ExternalLinkProps) {
  const handlePress = async () => {
    try {
      const supported = await Linking.canOpenURL(href);
      if (supported) {
        await Linking.openURL(href);
      } else {
        Alert.alert('Error', `Cannot open URL: ${href}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  return (
    <TouchableOpacity onPress={handlePress} style={style}>
      {children}
    </TouchableOpacity>
  );
}