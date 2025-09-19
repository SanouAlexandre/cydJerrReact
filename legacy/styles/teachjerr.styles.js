import { StyleSheet, Dimensions, Platform } from 'react-native';
import { UI_CONSTANTS } from './commonUIStyles';
import { theme } from '../utils/theme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');
const isTablet = screenWidth > 768;

export const teachJerrStyles = StyleSheet.create({
  // Main container
  container: {
    flex: 1,
    backgroundColor: theme.colors.bgStart,
  },
  
  // Background gradient
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  // Fixed header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  headerGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    height: 60,
  },
  
  headerButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: theme.radius.medium,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
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
  
  headerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  headerActions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  
  // Scroll view
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Search section
  searchSection: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  },
  
  searchContainer: {
    position: 'relative',
    height: 56,
    borderRadius: theme.radius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.medium,
  },
  
  searchGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  searchIcon: {
    position: 'absolute',
    left: theme.spacing.md,
    top: '50%',
    marginTop: -10,
    zIndex: 1,
  },
  
  searchInput: {
    flex: 1,
    height: '100%',
    paddingLeft: 50,
    paddingRight: theme.spacing.md,
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textPrimary,
  },
  
  // Promotional banner
  promoBanner: {
    marginHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.lg,
    borderRadius: theme.radius.large,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  
  promoBannerGradient: {
    padding: theme.spacing.lg,
  },
  
  promoBannerContent: {
    alignItems: 'center',
  },
  
  promoBannerEmoji: {
    fontSize: 32,
    marginBottom: theme.spacing.sm,
  },
  
  promoBannerTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textDark,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  promoBannerSubtitle: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
    opacity: 0.8,
  },
  
  promoCta: {
    backgroundColor: theme.colors.gold,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.radius.medium,
    ...theme.shadows.softDown,
  },
  
  promoCtaText: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textDark,
  },
  
  // Search results
  searchResults: {
    marginBottom: theme.spacing.lg,
  },
  
  searchResultsTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Sections
  section: {
    marginBottom: theme.spacing.xl,
  },
  
  sectionHeader: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  
  sectionTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  
  // Horizontal list
  horizontalList: {
    paddingRight: theme.spacing.md,
  },
  
  // Grid layout
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  
  gridItem: {
    width: isTablet ? '48%' : '100%',
    marginBottom: theme.spacing.md,
  },
  
  // Course cards
  horizontalCard: {
    width: 320,
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  
  gridCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.large,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
    ...theme.shadows.medium,
  },
  
  cardTouchable: {
    flex: 1,
  },
  
  cardImageContainer: {
    position: 'relative',
    height: 180,
  },
  
  cardImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  
  // Badges
  badge: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.radius.small,
    ...theme.shadows.softDown,
  },
  
  bestSellerBadge: {
    backgroundColor: theme.colors.bestSeller,
  },
  
  newBadge: {
    backgroundColor: theme.colors.newBadge,
  },
  
  badgeText: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
  },
  
  // Card content
  cardContent: {
    padding: theme.spacing.md,
  },
  
  cardTitle: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
    lineHeight: theme.typography.sizes.md * theme.typography.lineHeights.tight,
  },
  
  cardTeacher: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  
  // Rating
  cardRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  
  starsContainer: {
    flexDirection: 'row',
    marginRight: theme.spacing.xs,
  },
  
  star: {
    fontSize: 12,
    marginRight: 1,
  },
  
  reviewsCount: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textTertiary,
  },
  
  // Meta information
  cardMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  
  duration: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textSecondary,
  },
  
  level: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textSecondary,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: theme.spacing.xs,
    paddingVertical: 2,
    borderRadius: theme.radius.small,
  },
  
  // Pricing
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  
  originalPrice: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textTertiary,
    textDecorationLine: 'line-through',
    marginRight: theme.spacing.sm,
  },
  
  finalPrice: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamilyBold,
    color: theme.colors.gold,
  },
  
  studentsCount: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.textTertiary,
  },
  
  // Bottom spacer
  bottomSpacer: {
    height: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator
  },
});

export default teachJerrStyles;