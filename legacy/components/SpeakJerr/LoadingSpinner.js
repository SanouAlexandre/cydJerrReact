import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';

const LoadingSpinner = ({ 
  message = 'Chargement...',
  size = 'large',
  color = '#007AFF',
  style,
  showMessage = true,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {/* Spinner */}
        <ActivityIndicator
          size={size}
          color={color}
          style={styles.spinner}
        />
        
        {/* Message */}
        {showMessage && (
          <Text style={styles.message}>{message}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 64,
  },
  content: {
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default LoadingSpinner;