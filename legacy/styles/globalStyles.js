/**
 * Styles globaux et couleurs pour l'application CydJerr
 */

// Palette de couleurs principale
export const colors = {
  // Couleurs primaires
  primary: '#FF6B35',
  primaryDark: '#E55A2B',
  primaryLight: '#FF8A65',
  
  // Couleurs secondaires
  secondary: '#2196F3',
  secondaryDark: '#1976D2',
  secondaryLight: '#64B5F6',
  
  // Couleurs d'accent
  accent: '#FF4081',
  accentDark: '#E91E63',
  accentLight: '#FF80AB',
  
  // Couleurs de fond
  background: '#000000',
  backgroundLight: '#121212',
  backgroundCard: '#1E1E1E',
  backgroundModal: '#2C2C2C',
  
  // Couleurs de surface
  surface: '#1E1E1E',
  surfaceLight: '#2C2C2C',
  surfaceDark: '#121212',
  
  // Couleurs de texte
  text: '#FFFFFF',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.5)',
  textDisabled: 'rgba(255, 255, 255, 0.3)',
  
  // Couleurs d'état
  success: '#4CAF50',
  successLight: '#81C784',
  successDark: '#388E3C',
  
  warning: '#FF9800',
  warningLight: '#FFB74D',
  warningDark: '#F57C00',
  
  error: '#F44336',
  errorLight: '#EF5350',
  errorDark: '#D32F2F',
  
  info: '#2196F3',
  infoLight: '#64B5F6',
  infoDark: '#1976D2',
  
  // Couleurs neutres
  white: '#FFFFFF',
  black: '#000000',
  gray: '#9E9E9E',
  grayLight: '#E0E0E0',
  grayDark: '#424242',
  
  // Couleurs avec transparence
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Couleurs de bordure
  border: 'rgba(255, 255, 255, 0.1)',
  borderLight: 'rgba(255, 255, 255, 0.05)',
  borderDark: 'rgba(255, 255, 255, 0.2)',
  
  // Couleurs spécifiques aux fonctionnalités
  like: '#FF4081',
  share: '#2196F3',
  comment: '#FF9800',
  bookmark: '#9C27B0',
  
  // Couleurs des réseaux sociaux
  facebook: '#1877F2',
  twitter: '#1DA1F2',
  instagram: '#E4405F',
  youtube: '#FF0000',
  tiktok: '#000000',
  whatsapp: '#25D366',
  telegram: '#0088CC',
};

// Tailles de police
export const fontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 20,
  xxxl: 24,
  title: 28,
  heading: 32,
  display: 40,
};

// Poids de police
export const fontWeights = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Espacements
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
};

// Rayons de bordure
export const borderRadius = {
  xs: 2,
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 20,
  round: 50,
  circle: 9999,
};

// Ombres
export const shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Styles de texte communs
export const textStyles = {
  heading1: {
    fontSize: fontSizes.display,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  heading2: {
    fontSize: fontSizes.heading,
    fontWeight: fontWeights.bold,
    color: colors.text,
  },
  heading3: {
    fontSize: fontSizes.title,
    fontWeight: fontWeights.semibold,
    color: colors.text,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    color: colors.text,
  },
  bodyLarge: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.normal,
    color: colors.text,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    color: colors.textSecondary,
  },
  button: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.semibold,
    color: colors.white,
  },
};

// Styles de conteneur communs
export const containerStyles = {
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  card: {
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.medium,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.small,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.text,
  },
};

export default {
  colors,
  fontSizes,
  fontWeights,
  spacing,
  borderRadius,
  shadows,
  textStyles,
  containerStyles,
};