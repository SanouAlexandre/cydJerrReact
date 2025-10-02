import { PlatformPressable } from '@react-navigation/elements';
import React from 'react';
import { Vibration } from 'react-native';

export function HapticTab(props: any) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Use React Native's built-in Vibration API instead of expo-haptics
        Vibration.vibrate(10); // Light vibration for 10ms
        props.onPressIn?.(ev);
      }}
    />
  );
}