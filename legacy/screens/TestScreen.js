import React, { useState } from 'react';
import { View, Text } from 'react-native';

const TestScreen = () => {
  const [test, setTest] = useState('Hello');
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ color: '#FFFFFF' }}>{test}</Text>
    </View>
  );
};

export default TestScreen;