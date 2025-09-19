import { StyleSheet, Dimensions, Platform } from 'react-native';
import { UI_CONSTANTS } from './commonUIStyles';
import { starJerrTokens } from '../utils/starJerrTokens';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // 2 colonnes avec marges

export const starJerrStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: starJerrTokens.spacing.s16,
  },
  loadingText: {
    color: starJerrTokens.colors.textWhite,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 100,
  },

  // Header
  header: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    padding: starJerrTokens.spacing.s16,
    marginBottom: starJerrTokens.spacing.s16,
    ...starJerrTokens.shadows.shadowSoft,
    // Styles responsives pour différentes plateformes
    ...Platform.select({
      ios: {
        minHeight: 120, // Hauteur minimale pour iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        minHeight: 110, // Hauteur minimale pour Android
        elevation: 8,
      },
    }),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: starJerrTokens.spacing.s8,
  },
  backButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: starJerrTokens.radius.r12,
    backgroundColor: starJerrTokens.colors.glassBg,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    // Effet glass morphism
    backdropFilter: 'blur(10px)',
    // Styles responsives pour différentes plateformes
    ...Platform.select({
      ios: {
        shadowColor: starJerrTokens.colors.neonBlue,
        shadowOpacity: 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 8,
        shadowColor: starJerrTokens.colors.neonBlue,
      },
    }),
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starIcon: {
    fontSize: 32,
    marginRight: starJerrTokens.spacing.s8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
  },
  createTokenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: starJerrTokens.colors.gold,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    minHeight: 44, // Hauteur minimale pour accessibilité
    minWidth: 80, // Largeur minimale pour accessibilité
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  createTokenText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textDark,
    marginLeft: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
  },

  // Market Stats
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: starJerrTokens.spacing.s16,
  },
  statCard: {
    flex: 1,
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r8,
    padding: starJerrTokens.spacing.s12,
    alignItems: 'center',
    marginHorizontal: 4,
    ...starJerrTokens.shadows.shadowSoft,
  },
  statValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginTop: 2,
    textAlign: 'center',
  },

  // Search Bar
  searchContainer: {
    position: 'relative',
    marginBottom: starJerrTokens.spacing.s24,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: starJerrTokens.spacing.s16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textWhite,
    ...starJerrTokens.shadows.shadowSoft,
  },

  // Category Grid
  gridContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: starJerrTokens.spacing.s16,
  },
  gridContent: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: cardWidth,
    marginBottom: starJerrTokens.spacing.s16,
  },
  categoryContent: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    padding: starJerrTokens.spacing.s16,
    alignItems: 'center',
    ...starJerrTokens.shadows.shadowSoft,
  },
  categoryEmoji: {
    fontSize: 48,
    marginBottom: starJerrTokens.spacing.s12,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
    marginBottom: starJerrTokens.spacing.s8,
  },
  tokenBadge: {
    backgroundColor: `${starJerrTokens.colors.gold}1A`, // 10% opacity
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    borderRadius: starJerrTokens.radius.r8,
    paddingHorizontal: starJerrTokens.spacing.s8,
    paddingVertical: 4,
    marginTop: 4,
  },
  tokenBadgeText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.gold,
    textAlign: 'center',
  },

  // Category Details Screen
  gradient: {
    flex: 1,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: starJerrTokens.spacing.s16,
    paddingVertical: starJerrTokens.spacing.s20,
    borderBottomWidth: 1,
    borderBottomColor: starJerrTokens.colors.borderGlass,
    backgroundColor: starJerrTokens.colors.glassBgDark,
    // Effet glass morphism pour l'en-tête
    backdropFilter: 'blur(20px)',
    // Ombre subtile
    ...starJerrTokens.shadows.shadowSoft,
  },
  categoryHeaderContent: {
    flex: 1,
    alignItems: 'center',
    marginLeft: -44, // Compenser la largeur du bouton retour
  },
  categoryHeaderEmoji: {
    fontSize: 40,
    marginBottom: starJerrTokens.spacing.s8,
  },
  categoryHeaderTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
    textAlign: 'center',
  },
  categoryHeaderCount: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
    marginTop: 4,
  },

  // Stars Grid
  starsGridContent: {
    padding: starJerrTokens.spacing.s16,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100,
  },
  starsGridRow: {
    justifyContent: 'space-between',
  },
  starCard: {
    width: cardWidth,
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r16,
    marginBottom: starJerrTokens.spacing.s16,
    overflow: 'hidden',
    ...starJerrTokens.shadows.shadowDeep,
    // Effet glass morphism avancé
    backdropFilter: 'blur(20px)',
    // Bordure néon subtile
    shadowColor: starJerrTokens.colors.neonBlue,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },
  starImageContainer: {
    position: 'relative',
    height: 120,
  },
  starImage: {
    width: '100%',
    height: '100%',
  },
  starImagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: starJerrTokens.colors.glassBgDark,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: starJerrTokens.colors.borderGlass,
    // Effet shimmer subtil
    opacity: 0.8,
  },
  verifiedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: starJerrTokens.colors.neonGreen,
    borderRadius: starJerrTokens.radius.r12,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.neonGreen,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // Effet néon
    shadowColor: starJerrTokens.colors.neonGreen,
    shadowOpacity: 0.6,
    shadowRadius: 6,
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  starInfo: {
    padding: starJerrTokens.spacing.s12,
    backgroundColor: starJerrTokens.colors.glassBgLight,
    borderTopWidth: 1,
    borderTopColor: starJerrTokens.colors.borderGlass,
    // Effet glass morphism pour la section info
    backdropFilter: 'blur(10px)',
  },
  starName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: 4,
  },
  starNationality: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginBottom: 2,
  },
  starSpecialty: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.gold,
    marginBottom: 8,
  },
  tokenPriceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tokenPrice: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.success,
  },
  tokenAvailableBadge: {
    backgroundColor: `${starJerrTokens.colors.gold}20`,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    borderRadius: starJerrTokens.radius.r8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    // Effet néon doré
    shadowColor: starJerrTokens.colors.gold,
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    shadowOffset: {
      width: 0,
      height: 0,
    },
  },
  tokenAvailableText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.gold,
    textShadowColor: starJerrTokens.colors.gold,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 2,
  },

  // Loading, Empty and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: starJerrTokens.spacing.s16,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: starJerrTokens.spacing.s32,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    textAlign: 'center',
    marginTop: starJerrTokens.spacing.s16,
    marginBottom: starJerrTokens.spacing.s8,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: starJerrTokens.spacing.s24,
  },
  errorStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: starJerrTokens.spacing.s32,
  },
  errorStateTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    textAlign: 'center',
    marginTop: starJerrTokens.spacing.s16,
    marginBottom: starJerrTokens.spacing.s8,
  },
  errorStateSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: starJerrTokens.spacing.s24,
  },
  retryButton: {
    backgroundColor: starJerrTokens.colors.gold,
    paddingHorizontal: starJerrTokens.spacing.s24,
    paddingVertical: starJerrTokens.spacing.s12,
    borderRadius: starJerrTokens.radius.r8,
    ...starJerrTokens.shadows.shadowSoft,
  },
  retryButtonText: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textDark,
  },
});