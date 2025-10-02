import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { setActiveTab } from '../redux/navigationSlice';

const BottomNavBar = () => {
  const dispatch = useDispatch();
  const { activeTab } = useSelector((state) => state.navigation);

  const tabs = [
    { id: 'Home', label: 'Accueil', icon: 'home' },
    { id: 'Search', label: 'Recherche', icon: 'magnify' },
    { id: 'Profile', label: 'Profil', icon: 'account' },
    { id: 'Menu', label: 'Menu', icon: 'menu' },
  ];

  const handleTabPress = (tabId) => {
    dispatch(setActiveTab(tabId));
  };

  const renderTab = (tab) => {
    const isActive = activeTab === tab.id;
    
    return (
      <TouchableOpacity
        key={tab.id}
        style={styles.tabButton}
        onPress={() => handleTabPress(tab.id)}
      >
        <View style={[
          styles.tabContent,
          isActive && styles.activeTabContent,
        ]}>
          <MaterialCommunityIcons
            name={tab.icon}
            size={24}
            color={isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)'}
            style={[
              styles.tabIcon,
              isActive && styles.activeTabIcon,
            ]}
          />
          <Text style={[
            styles.tabLabel,
            isActive && styles.activeTabLabel,
          ]}>
            {tab.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[
          'rgba(255, 255, 255, 0.25)',
          'rgba(255, 255, 255, 0.15)',
          'rgba(255, 255, 255, 0.1)',
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.navGradient}
      >
        <View style={styles.tabsContainer}>
          {tabs.map(renderTab)}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20, // Safe area adaptée
    height: Platform.OS === 'ios' ? 100 : 90, // Hauteur adaptée par plateforme
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: Platform.OS === 'android' ? 15 : 0,
    zIndex: 100, // S'assure qu'il est au-dessus de tout
  },
  navGradient: {
    flex: 1,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.3)',
    paddingTop: 16,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    minHeight: 50,
  },
  activeTabContent: {
    backgroundColor: 'rgba(78, 205, 196, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(78, 205, 196, 0.3)',
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: Platform.OS === 'ios' ? 0.3 : 0.2,
    shadowRadius: Platform.OS === 'ios' ? 6 : 4,
    elevation: Platform.OS === 'android' ? 6 : 0,
  },
  tabIcon: {
    marginBottom: 2,
  },
  activeTabIcon: {
    textShadowColor: 'rgba(78, 205, 196, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  activeTabLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
    textShadowColor: 'rgba(78, 205, 196, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 3,
  },
});

export default BottomNavBar;