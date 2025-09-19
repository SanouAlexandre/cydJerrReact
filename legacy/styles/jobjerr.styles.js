import { StyleSheet, Dimensions, Platform } from 'react-native';
import { UI_CONSTANTS } from './commonUIStyles';

const { width, height } = Dimensions.get('window');

export const jobjerrStyles = StyleSheet.create({
  // Container principal
  container: {
    flex: 1,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  loadingText: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
  },

  // Header
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'ios' ? 100 : 80,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  headerGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingBottom: 12,
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'ios' ? 44 : 24,
  },
  
  headerButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
    flex: 1,
    textAlign: 'center',
    fontFamily: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'System'
    }),
    fontSize: 20,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 16,
  },
  
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  // Feed Container
  feedContainer: {
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator
    paddingHorizontal: 16,
  },

  // Composer
  composer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
  },
  
  composerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  
  composerAvatar: {
    fontSize: 32,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
  },
  
  composerInput: {
    flex: 1,
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.95)',
    minHeight: 44,
    textAlignVertical: 'top',
  },
  
  composerExpanded: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  
  composerCounter: {
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  
  counterText: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  composerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  composerMedia: {
    flexDirection: 'row',
    gap: 12,
  },
  
  mediaButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 222, 89, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 222, 89, 0.2)',
  },
  
  publishButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  publishButtonActive: {
    backgroundColor: '#FFDE59',
    borderColor: '#FFDE59',
  },
  
  publishButtonText: {
    fontFamily: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'System'
    }),
    fontSize: 14,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
  },

  // Post Card
  postCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
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
  },
  
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  postAvatar: {
    fontSize: 32,
    width: 40,
    height: 40,
    textAlign: 'center',
    lineHeight: 40,
    marginRight: 12,
  },
  
  postAuthorInfo: {
    flex: 1,
  },
  
  postAuthorName: {
    fontFamily: Platform.select({
      ios: 'Poppins-Bold',
      android: 'Poppins-Bold',
      default: 'System'
    }),
    fontSize: 16,
    fontWeight: 'bold',
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 2,
  },
  
  postAuthorTitle: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  postTimestamp: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  
  postContent: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: 16,
  },

  // Post Actions
  postActions: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    paddingTop: 12,
  },
  
  reactionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  
  reactionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: 4,
  },
  
  reactionButtonActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  
  reactionCount: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    gap: 6,
  },
  
  actionText: {
    fontFamily: Platform.select({
      ios: 'Poppins-Regular',
      android: 'Poppins-Regular',
      default: 'System'
    }),
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },


});