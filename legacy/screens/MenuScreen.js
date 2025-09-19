import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from 'react-native-vector-icons';


const MenuScreen = () => {
  const menuSections = [
    {
      title: 'Navigation',
      items: [
        { id: 1, title: 'Tableau de bord', icon: 'view-dashboard', color: '#FF6B9D' },
        { id: 2, title: 'Mes Univers', icon: 'apps', color: '#6C5CE7' },
        { id: 3, title: 'Favoris', icon: 'heart', color: '#74B9FF' },
        { id: 4, title: 'Récents', icon: 'clock', color: '#00CEC9' },
      ],
    },
    {
      title: 'Outils',
      items: [
        { id: 5, title: 'Calculatrice', icon: 'calculator', color: '#4ECDC4' },
        { id: 6, title: 'Calendrier', icon: 'calendar', color: '#96CEB4' },
        { id: 7, title: 'Notes', icon: 'note-text-outline', color: '#FFEAA7' },
        { id: 8, title: 'Traducteur', icon: 'translate', color: '#DDA0DD' },
      ],
    },
    {
      title: 'Système',
      items: [
        { id: 9, title: 'Paramètres', icon: 'cog', color: '#FFB6C1' },
        { id: 10, title: 'Sécurité', icon: 'shield-check', color: '#87CEEB' },
        { id: 11, title: 'Stockage', icon: 'database', color: '#98FB98' },
        { id: 12, title: 'Mise à jour', icon: 'download', color: '#F0E68C' },
      ],
    },
  ];

  const renderMenuItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.menuItem}>
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.2)',
          'rgba(255, 255, 255, 0.1)',
        ]}
        style={styles.menuItemGradient}
      >
        <View style={[styles.menuIconContainer, { backgroundColor: `${item.color}40` }]}>
          <MaterialCommunityIcons 
            name={item.icon} 
            size={24} 
            color={item.color} 
          />
        </View>
        <Text style={styles.menuItemTitle}>{item.title}</Text>
        <MaterialCommunityIcons 
          name="chevron-right" 
          size={18} 
          color="rgba(255, 255, 255, 0.5)" 
        />
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderSection = (section, index) => (
    <View key={index} style={styles.section}>
      <Text style={styles.sectionTitle}>{section.title}</Text>
      <View style={styles.sectionItems}>
        {section.items.map(renderMenuItem)}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Platform.OS === 'android' ? 'transparent' : undefined}
        translucent={Platform.OS === 'android'}
      />
      
      <LinearGradient
        colors={[
          '#FF6B9D',
          '#C44569',
          '#6C5CE7',
          '#74B9FF',
          '#00CEC9',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Menu</Text>
            <Text style={styles.headerSubtitle}>Centre de contrôle CydJerr</Text>
          </View>
          
          <ScrollView 
            style={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            {menuSections.map(renderSection)}
            
            {/* Section d'informations */}
            <View style={styles.infoSection}>
              <LinearGradient
                colors={[
                  'rgba(255, 255, 255, 0.15)',
                  'rgba(255, 255, 255, 0.05)',
                ]}
                style={styles.infoCard}
              >
                <MaterialCommunityIcons 
                  name="information" 
                  size={32} 
                  color="rgba(255, 255, 255, 0.8)" 
                  style={styles.infoIcon}
                />
                <Text style={styles.infoTitle}>CydJerr Nation v1.0</Text>
                <Text style={styles.infoText}>Votre écosystème digital personnel</Text>
              </LinearGradient>
            </View>
          </ScrollView>
        </SafeAreaView>
        
  
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 12,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  sectionItems: {
    gap: 8,
  },
  menuItem: {
    borderRadius: 12,
    shadowColor: 'rgba(0, 0, 0, 0.1)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  menuItemGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  menuIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  infoSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  infoCard: {
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  infoIcon: {
    marginBottom: 10,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default MenuScreen;