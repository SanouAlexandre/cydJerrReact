import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  StatusBar,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import StatusItem from '../../components/SpeakJerr/StatusItem';

const { width, height } = Dimensions.get('window');

const StatusViewerScreen = ({ navigation, route }) => {
  const { statuses = [], initialIndex = 0, statusId } = route.params || {};
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const flatListRef = useRef(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Naviguer vers le statut initial si fourni
    if (initialIndex > 0 && flatListRef.current) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: initialIndex,
          animated: false,
        });
      }, 100);
    }
  }, [initialIndex]);

  const handleScroll = (event) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const viewSize = event.nativeEvent.layoutMeasurement;
    const pageNum = Math.floor(contentOffset.x / viewSize.width);
    setCurrentIndex(pageNum);
  };

  const goToNext = () => {
    if (currentIndex < statuses.length - 1) {
      const nextIndex = currentIndex + 1;
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
      setCurrentIndex(nextIndex);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      flatListRef.current?.scrollToIndex({
        index: prevIndex,
        animated: true,
      });
      setCurrentIndex(prevIndex);
    }
  };

  const renderStatusItem = ({ item, index }) => {
    const author = item.author;
    const authorName = author 
      ? `${author.firstName || ''} ${author.lastName || ''}`.trim() || author.username
      : 'Utilisateur inconnu';
    
    // Formatage de l'heure
    const formatTime = (timestamp) => {
      if (!timestamp) return '';
      
      const date = new Date(timestamp);
      const now = new Date();
      const diffInHours = (now - date) / (1000 * 60 * 60);
      
      if (diffInHours < 1) {
        const diffInMinutes = Math.floor((now - date) / (1000 * 60));
        return diffInMinutes < 1 ? 'À l\'instant' : `${diffInMinutes}min`;
      } else if (diffInHours < 24) {
        return `${Math.floor(diffInHours)}h`;
      } else {
        const diffInDays = Math.floor(diffInHours / 24);
        return `${diffInDays}j`;
      }
    };

    // Contenu sécurisé
    const getSafeContent = () => {
      if (!item.content) return null;
      if (typeof item.content === 'string') return item.content;
      if (typeof item.content === 'object' && item.content.text) {
        return item.content.text;
      }
      return null;
    };
    
    const getContentStyles = () => {
      if (!item.content || typeof item.content !== 'object') return {};
      return {
        color: item.content.textColor || '#FFFFFF',
        backgroundColor: item.content.backgroundColor || '#000000'
      };
    };
    
    const safeContent = getSafeContent();
    const contentStyles = getContentStyles();

    // Média URL
    const mediaUrl = item.mediaUrl || item.media?.url || item.image?.url || item.attachment?.url;
    const mediaType = item.mediaType || item.media?.type || 'image';

    return (
      <View style={styles.statusContainer}>
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.3)']}
          style={styles.statusOverlay}
        >
          {/* Header */}
          <View style={styles.statusHeader}>
            <View style={styles.authorContainer}>
              {author?.avatar?.url ? (
                <Image source={{ uri: author.avatar.url }} style={styles.authorAvatar} />
              ) : (
                <View style={[styles.authorAvatar, styles.defaultAvatar]}>
                  <Ionicons name="person" size={20} color="#FFFFFF" />
                </View>
              )}
              
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{authorName}</Text>
                <Text style={styles.timeText}>{formatTime(item.createdAt)}</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.optionsButton}>
              <Ionicons name="ellipsis-horizontal" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Contenu principal */}
          <ScrollView 
            style={styles.contentScrollView}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {/* Média */}
            {mediaUrl && (
              <View style={styles.mediaContainer}>
                <Image
                  source={{ uri: mediaUrl }}
                  style={styles.media}
                  resizeMode="contain"
                  onError={(error) => {
                    console.log('Erreur de chargement image:', mediaUrl, error);
                  }}
                  onLoad={() => console.log('Image chargée avec succès:', mediaUrl)}
                />
              </View>
            )}

            {/* Contenu texte */}
            {safeContent && (
              <View style={[styles.textContainer, contentStyles]}>
                <Text style={[styles.contentText, { color: contentStyles.color || '#FFFFFF' }]}>
                  {safeContent}
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Actions en bas */}
          <View style={styles.bottomActions}>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="chatbubble-outline" size={28} color="#FFFFFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="paper-plane-outline" size={28} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Ionicons name="eye-outline" size={16} color="#FFFFFF" />
                <Text style={styles.statText}>{item.views?.length || 0}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  };

  const renderHeader = () => {
    const currentStatus = statuses[currentIndex];
    return (
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#000000" />
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Statut</Text>
          <Text style={styles.headerSubtitle}>
            {currentIndex + 1} sur {statuses.length}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          {statuses.length > 1 && (
            <View style={styles.navigationButtons}>
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === 0 && styles.navButtonDisabled,
                ]}
                onPress={goToPrevious}
                disabled={currentIndex === 0}
              >
                <Ionicons
                  name="chevron-back"
                  size={20}
                  color={currentIndex === 0 ? '#C7C7CC' : '#007AFF'}
                />
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.navButton,
                  currentIndex === statuses.length - 1 && styles.navButtonDisabled,
                ]}
                onPress={goToNext}
                disabled={currentIndex === statuses.length - 1}
              >
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={currentIndex === statuses.length - 1 ? '#C7C7CC' : '#007AFF'}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    );
  };

  if (!statuses || statuses.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
        {renderHeader()}
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#C7C7CC" />
          <Text style={styles.emptyText}>Aucun statut à afficher</Text>
          <TouchableOpacity
            style={styles.backToFeedButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backToFeedText}>Retour</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent />
      {renderHeader()}
      
      <FlatList
        ref={flatListRef}
        data={statuses}
        renderItem={renderStatusItem}
        keyExtractor={(item) => item._id || item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        getItemLayout={(data, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        onScrollToIndexFailed={(info) => {
          console.warn('Scroll to index failed:', info);
          // Fallback: scroll to the nearest valid index
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            flatListRef.current?.scrollToIndex({
              index: Math.min(info.index, statuses.length - 1),
              animated: false,
            });
          });
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    backgroundColor: '#FFFFFF',
    minHeight: Platform.OS === 'ios' ? 100 : 80,
    ...Platform.select({
      android: {
        paddingTop: StatusBar.currentHeight || 24,
      },
    }),
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  headerRight: {
    minWidth: 80,
    alignItems: 'flex-end',
  },
  navigationButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navButton: {
    padding: 8,
    marginLeft: 4,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  statusContainer: {
    width: width,
    flex: 1,
    backgroundColor: '#000000',
    position: 'relative',
  },
  statusOverlay: {
    flex: 1,
    paddingTop: 60,
    paddingBottom: 40,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  authorAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  defaultAvatar: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  timeText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  optionsButton: {
    padding: 8,
  },
  contentScrollView: {
    flex: 1,
    marginTop: 100,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  mediaContainer: {
    width: '100%',
    maxHeight: height * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  media: {
    width: '100%',
    height: height * 0.5,
    borderRadius: 12,
  },
  textContainer: {
    padding: 20,
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentText: {
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 32,
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 12,
    marginRight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 4,
    fontWeight: '500',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
  },
  backToFeedButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backToFeedText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StatusViewerScreen;