import { StyleSheet, Platform, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

// Styles communs pour corriger les problèmes d'accessibilité UI
export const commonUIStyles = StyleSheet.create({
  // Container principal avec espacement pour TabNavigator
  safeContainer: {
    flex: 1,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80, // Espace pour TabNavigator
  },

  // Header fixe avec positionnement sécurisé
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 16,
    zIndex: 1000,
    backgroundColor: 'transparent',
  },

  // Contenu principal avec espacement pour header fixe
  contentWithFixedHeader: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
    paddingBottom: Platform.OS === 'ios' ? 100 : 80,
  },

  // Header content avec alignement sécurisé
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 44, // Hauteur minimale pour accessibilité
  },

  // Bouton de retour accessible
  accessibleBackButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Titre centré accessible
  accessibleHeaderTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'System'
    }),
    color: '#FFFFFF',
    marginHorizontal: 16,
    fontWeight: 'bold',
  },

  // Actions header avec espacement
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // Bouton d'action accessible
  accessibleActionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // FAB (Floating Action Button) avec positionnement sécurisé
  accessibleFAB: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100, // Au-dessus du TabNavigator
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  // Container pour contenu scrollable
  scrollableContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator + FAB
  },

  // Espacement bottom pour éviter le chevauchement avec TabNavigator
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 100 : 80,
  },

  // Container pour les tabs avec espacement sécurisé
  tabsContainer: {
    marginTop: Platform.OS === 'ios' ? 100 : 80, // Espace pour header fixe
    backgroundColor: 'transparent',
  },

  // Styles pour les modals avec positionnement sécurisé
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'flex-end',
  },

  modalContent: {
    backgroundColor: 'rgba(20,20,20,0.95)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: Platform.OS === 'ios' ? 40 : 30,
    paddingHorizontal: 20,
    maxHeight: height * 0.8,
  },

  // Styles pour les éléments interactifs
  touchableArea: {
    minHeight: 44,
    minWidth: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Container pour les listes avec espacement sécurisé
  listContainer: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 100 : 80,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
});

// Constantes pour les espacements
export const UI_CONSTANTS = {
  HEADER_HEIGHT: Platform.OS === 'ios' ? 100 : 80,
  TAB_NAVIGATOR_HEIGHT: Platform.OS === 'ios' ? 90 : 70,
  SAFE_AREA_BOTTOM: Platform.OS === 'ios' ? 100 : 80,
  FAB_BOTTOM_OFFSET: Platform.OS === 'ios' ? 120 : 100,
  MIN_TOUCH_TARGET: 44,
  BORDER_RADIUS: {
    small: 8,
    medium: 12,
    large: 16,
    round: 22,
  },
  SPACING: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
  },
};

// Fonction utilitaire pour créer des styles glassmorphism
export const createGlassStyle = (opacity = 0.1, borderOpacity = 0.2) => ({
  backgroundColor: `rgba(255, 255, 255, ${opacity})`,
  borderWidth: 1,
  borderColor: `rgba(255, 255, 255, ${borderOpacity})`,
  ...Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
});

// Fonction utilitaire pour créer des styles de boutons accessibles
export const createAccessibleButtonStyle = (size = 'medium') => {
  const sizes = {
    small: { width: 36, height: 36, borderRadius: 18 },
    medium: { width: 44, height: 44, borderRadius: 22 },
    large: { width: 56, height: 56, borderRadius: 28 },
  };

  return {
    ...sizes[size],
    justifyContent: 'center',
    alignItems: 'center',
    ...createGlassStyle(),
  };
};