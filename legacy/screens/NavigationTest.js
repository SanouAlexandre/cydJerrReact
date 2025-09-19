import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NavigationTest = () => {
  const navigation = useNavigation();
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Navigation Test Component</Text>
      <Text>Navigation object: {navigation ? 'OK' : 'ERROR'}</Text>
    </View>
  );
};

export default NavigationTest;