import { Platform } from 'react-native';

// Utilitaires pour les ombres néomorphiques JobJerr
export const shadows = {
  // Ombre douce
  soft: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: 3,
    },
  }),
  
  // Ombre moyenne
  medium: Platform.select({
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
  
  // Ombre forte
  strong: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.25,
      shadowRadius: 16,
    },
    android: {
      elevation: 12,
    },
  }),
  
  // Ombre néomorphique (double ombre)
  neomorphic: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: -2, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
    },
    android: {
      elevation: 8,
    },
  }),
  
  // Ombre pour les boutons
  button: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    android: {
      elevation: 4,
    },
  }),
  
  // Ombre pour les cartes
  card: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.12,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
  
  // Ombre pour les modals
  modal: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.3,
      shadowRadius: 24,
    },
    android: {
      elevation: 16,
    },
  }),
  
  // Ombre interne (effet enfoncé)
  inset: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    android: {
      elevation: -2, // Note: Android ne supporte pas vraiment les ombres internes
    },
  }),
  
  // Ombre colorée (accent)
  accent: Platform.select({
    ios: {
      shadowColor: '#FFDE59',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
};

// Fonction pour créer une ombre personnalisée
export const createShadow = ({
  color = '#000',
  offset = { width: 0, height: 4 },
  opacity = 0.15,
  radius = 8,
  elevation = 6
}) => {
  return Platform.select({
    ios: {
      shadowColor: color,
      shadowOffset: offset,
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: {
      elevation,
    },
  });
};

// Fonction pour créer un effet néomorphique complet
export const createNeomorphicShadow = ({
  lightColor = 'rgba(255, 255, 255, 0.1)',
  darkColor = 'rgba(0, 0, 0, 0.3)',
  distance = 4,
  intensity = 0.15
}) => {
  return Platform.select({
    ios: {
      // Ombre principale (sombre)
      shadowColor: darkColor,
      shadowOffset: { width: distance, height: distance },
      shadowOpacity: intensity,
      shadowRadius: distance * 2,
    },
    android: {
      elevation: distance * 2,
    },
  });
};

// Ombres pour les états d'interaction
export const interactionShadows = {
  // État normal
  normal: shadows.medium,
  
  // État pressed (ombre réduite)
  pressed: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
    },
    android: {
      elevation: 2,
    },
  }),
  
  // État hover (ombre augmentée)
  hover: Platform.select({
    ios: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
    },
    android: {
      elevation: 8,
    },
  }),
  
  // État focus (ombre colorée)
  focus: Platform.select({
    ios: {
      shadowColor: '#FFDE59',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.4,
      shadowRadius: 8,
    },
    android: {
      elevation: 6,
    },
  }),
};