import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';

const ChabJerrScreenSimple = () => {
  const [activeTab, setActiveTab] = useState('Accueil');
  
  return (
    <LinearGradient
      colors={['#FF3030', '#FF6B6B', '#4ECDC4']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title}>ChabJerr - Version Simple</Text>
        <Text style={styles.subtitle}>Onglet actif: {activeTab}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});

export default ChabJerrScreenSimple;