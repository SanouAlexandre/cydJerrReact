import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabBarBackground({ style }: { style?: any }) {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.background,
        {
          paddingBottom: insets.bottom,
        },
        style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    flex: 1,
  },
});