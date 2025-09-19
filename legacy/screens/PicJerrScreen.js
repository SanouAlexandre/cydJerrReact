import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Platform,
  Animated,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons, MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { formatJerr } from '../utils/price';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Données mockées pour les photos
const mockPhotos = {
  portraits: [
    {
      id: 1,
      title: 'Portrait Urbain',
      location: 'Paris, France',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
      likes: 1247,
      views: 8934,
      price: 2500, // 25 Jerr
      photographer: 'Alex Martin',
    },
    {
      id: 2,
      title: 'Lumière Naturelle',
      location: 'Lyon, France',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=300',
      likes: 892,
      views: 5621,
      price: 1800, // 18 Jerr
      photographer: 'Sophie Dubois',
    },
    {
      id: 3,
      title: 'Expression Authentique',
      location: 'Marseille, France',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
      likes: 2156,
      views: 12847,
      price: 3200, // 32 Jerr
      photographer: 'Thomas Leroux',
    },
  ],
  paysages: [
    {
      id: 4,
      title: 'Coucher de Soleil',
      location: 'Provence, France',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300',
      likes: 3421,
      views: 18765,
      price: 4500, // 45 Jerr
      photographer: 'Marie Rousseau',
    },
    {
      id: 5,
      title: 'Montagne Majestueuse',
      location: 'Alpes, France',
      image: 'https://images.unsplash.com/photo-1464822759844-d150baec0494?w=300',
      likes: 2876,
      views: 15432,
      price: 3800, // 38 Jerr
      photographer: 'Pierre Moreau',
    },
    {
      id: 6,
      title: 'Océan Infini',
      location: 'Bretagne, France',
      image: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=300',
      likes: 1987,
      views: 11234,
      price: 2900, // 29 Jerr
      photographer: 'Claire Durand',
    },
  ],
  architecture: [
    {
      id: 7,
      title: 'Géométrie Moderne',
      location: 'La Défense, Paris',
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300',
      likes: 1654,
      views: 9876,
      price: 3500, // 35 Jerr
      photographer: 'Antoine Blanc',
    },
    {
      id: 8,
      title: 'Patrimoine Historique',
      location: 'Versailles, France',
      image: 'https://images.unsplash.com/photo-1520637836862-4d197d17c93a?w=300',
      likes: 2341,
      views: 14567,
      price: 4200, // 42 Jerr
      photographer: 'Isabelle Petit',
    },
    {
      id: 9,
      title: 'Design Contemporain',
      location: 'Lyon, France',
      image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=300',
      likes: 1432,
      views: 8765,
      price: 2700, // 27 Jerr
      photographer: 'Lucas Bernard',
    },
  ],
  art: [
    {
      id: 10,
      title: 'Street Art Vibrant',
      location: 'Belleville, Paris',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=300',
      likes: 3876,
      views: 21543,
      price: 5500, // 55 Jerr
      photographer: 'Emma Leroy',
    },
    {
      id: 11,
      title: 'Installation Moderne',
      location: 'Centre Pompidou, Paris',
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      likes: 2198,
      views: 13456,
      price: 3900, // 39 Jerr
      photographer: 'Julien Roux',
    },
    {
      id: 12,
      title: 'Sculpture Urbaine',
      location: 'Nantes, France',
      image: 'https://images.unsplash.com/photo-1578321272176-b7bbc0679853?w=300',
      likes: 1765,
      views: 10234,
      price: 3100, // 31 Jerr
      photographer: 'Camille Faure',
    },
  ],
  street: [
    {
      id: 13,
      title: 'Vie Parisienne',
      location: 'Montmartre, Paris',
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300',
      likes: 2654,
      views: 16789,
      price: 4100, // 41 Jerr
      photographer: 'Nicolas Girard',
    },
    {
      id: 14,
      title: 'Mouvement Urbain',
      location: 'Toulouse, France',
      image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=300',
      likes: 1876,
      views: 11987,
      price: 2800, // 28 Jerr
      photographer: 'Sarah Martin',
    },
    {
      id: 15,
      title: 'Reflets Urbains',
      location: 'Bordeaux, France',
      image: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=300',
      likes: 2987,
      views: 18234,
      price: 3600, // 36 Jerr
      photographer: 'David Lecomte',
    },
  ],
};

// Tags tendances
const trendingTags = [
  { id: 1, name: 'Minimalisme', color: '#B0E0E6' },
  { id: 2, name: 'Noir & Blanc', color: '#87CEEB' },
  { id: 3, name: 'Golden Hour', color: '#FFD700' },
  { id: 4, name: 'Urbain', color: '#DDA0DD' },
  { id: 5, name: 'Nature', color: '#98FB98' },
  { id: 6, name: 'Portrait', color: '#FFB6C1' },
  { id: 7, name: 'Vintage', color: '#F0E68C' },
  { id: 8, name: 'Macro', color: '#FFA07A' },
];

const PicJerrScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Accueil');
  const [favorites, setFavorites] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set());
  const scrollY = useRef(new Animated.Value(0)).current;
  const tabScrollRef = useRef(null);

  const tabs = ['Accueil', 'Explorer', 'Collections', 'Partager'];

  const toggleFavorite = (photoId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(photoId)) {
      newFavorites.delete(photoId);
    } else {
      newFavorites.add(photoId);
    }
    setFavorites(newFavorites);
  };

  const toggleBookmark = (photoId) => {
    const newBookmarks = new Set(bookmarks);
    if (newBookmarks.has(photoId)) {
      newBookmarks.delete(photoId);
    } else {
      newBookmarks.add(photoId);
    }
    setBookmarks(newBookmarks);
  };

  const renderPhotoCard = ({ item }) => (
    <View style={styles.photoCard}>
      <Image source={{ uri: item.image }} style={styles.photoImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.8)']}
        style={styles.photoOverlay}
      >
        <View style={styles.photoActions}>
          <TouchableOpacity
            style={[styles.actionButton, favorites.has(item.id) && styles.activeAction]}
            onPress={() => toggleFavorite(item.id)}
          >
            <Ionicons
              name={favorites.has(item.id) ? 'heart' : 'heart-outline'}
              size={16}
              color={favorites.has(item.id) ? '#FF6B9D' : 'white'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, bookmarks.has(item.id) && styles.activeAction]}
            onPress={() => toggleBookmark(item.id)}
          >
            <Ionicons
              name={bookmarks.has(item.id) ? 'bookmark' : 'bookmark-outline'}
              size={16}
              color={bookmarks.has(item.id) ? '#4ECDC4' : 'white'}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.photoInfo}>
          <Text style={styles.photoTitle}>{item.title}</Text>
          <Text style={styles.photoLocation}>{item.location}</Text>
          <View style={styles.photoStats}>
            <View style={styles.statItem}>
              <Ionicons name="heart" size={12} color="#FF6B9D" />
              <Text style={styles.statText}>{item.likes}</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="eye" size={12} color="#4ECDC4" />
              <Text style={styles.statText}>{item.views}</Text>
            </View>
            <Text style={styles.photoPrice}>{formatJerr(item.price)}</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderThematicSection = (title, icon, photos) => (
    <View style={styles.thematicSection}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleContainer}>
          <MaterialCommunityIcons name={icon} size={20} color="#B0E0E6" />
          <Text style={styles.sectionTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.seeAllButton}>
          <Text style={styles.seeAllText}>Voir tout</Text>
          <Ionicons name="chevron-forward" size={16} color="#B0E0E6" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={photos}
        renderItem={renderPhotoCard}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carouselContainer}
      />
    </View>
  );

  const renderHeroSection = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.heroSection}>
      <LinearGradient
        colors={['rgba(176, 224, 230, 0.3)', 'rgba(135, 206, 235, 0.2)']}
        style={styles.heroGradient}
      >
        <Text style={styles.welcomeText}>Bienvenue sur PicJerr</Text>
        <Text style={styles.heroTitle}>Découvrez l'univers PicJerr</Text>
        <Text style={styles.heroSubtitle}>
          Explorez une collection unique de photographies d'exception,
          capturez l'instant parfait et partagez votre vision artistique
        </Text>
        <View style={styles.heroButtons}>
          <TouchableOpacity style={[styles.heroButton, styles.primaryButton]}>
            <MaterialCommunityIcons name="compass" size={20} color="white" />
            <Text style={styles.heroButtonText}>Explorer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.heroButton, styles.secondaryButton]}>
            <MaterialCommunityIcons name="download" size={20} color="#B0E0E6" />
            <Text style={[styles.heroButtonText, { color: '#B0E0E6' }]}>Télécharger</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </BlurView>
  );

  const renderTrendingSection = () => (
    <View style={styles.trendingSection}>
      <Text style={styles.sectionTitle}>Tendances du jour</Text>
      <View style={styles.tagsGrid}>
        {trendingTags.map((tag) => (
          <TouchableOpacity key={tag.id} style={[styles.trendingTag, { borderColor: tag.color }]}>
            <BlurView blurAmount={15} blurType="light" style={styles.tagBlur}>
              <Text style={[styles.tagText, { color: tag.color }]}>{tag.name}</Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderAccueilContent = () => (
    <>
      {renderHeroSection()}
      {renderThematicSection('Portraits', 'account', mockPhotos.portraits)}
      {renderThematicSection('Paysages', 'image-filter-hdr', mockPhotos.paysages)}
      {renderThematicSection('Architecture', 'city', mockPhotos.architecture)}
      {renderThematicSection('Art', 'palette', mockPhotos.art)}
      {renderThematicSection('Street', 'road', mockPhotos.street)}
      {renderTrendingSection()}
    </>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Accueil':
        return renderAccueilContent();
      case 'Explorer':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Explorer</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Collections':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Collections</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Partager':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Partager</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#B0E0E6', '#87CEEB', '#4682B4']}
        style={styles.background}
      >
        {/* Header fixe */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <BlurView blurAmount={20} blurType="light" style={styles.backButtonBlur}>
              <Ionicons name="chevron-back" size={24} color="white" />
            </BlurView>
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>PicJerr</Text>
          
          <View style={styles.headerRight} />
        </View>

        {/* Barre d'onglets */}
        <View style={styles.tabsContainer}>
          <ScrollView
            ref={tabScrollRef}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContainer}
          >
            {tabs.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[
                  styles.tab,
                  activeTab === tab && styles.activeTab,
                ]}
                onPress={() => setActiveTab(tab)}
              >
                <Text
                  style={[
                    styles.tabText,
                    activeTab === tab && styles.activeTabText,
                  ]}
                >
                  {tab}
                </Text>
                {activeTab === tab && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Contenu principal */}
        <Animated.ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          scrollEventThrottle={16}
        >
          {renderTabContent()}
        </Animated.ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  backButtonBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  headerRight: {
    width: 40,
  },
  tabsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabsScrollContainer: {
    paddingHorizontal: 20,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginRight: 8,
    position: 'relative',
  },
  activeTab: {
    // Styles pour l'onglet actif
  },
  tabText: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  activeTabText: {
    fontWeight: '500',
    color: '#B0E0E6',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    left: 20,
    right: 20,
    height: 2,
    backgroundColor: '#B0E0E6',
    borderRadius: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    margin: 20,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  heroButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#B0E0E6',
  },
  secondaryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: '#B0E0E6',
  },
  heroButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  thematicSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    fontSize: 14,
    color: '#B0E0E6',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  carouselContainer: {
    paddingLeft: 0,
    paddingRight: 20,
  },
  photoCard: {
    width: 200,
    height: 150,
    marginRight: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  photoImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  photoOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'space-between',
    padding: 12,
  },
  photoActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeAction: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  photoInfo: {
    gap: 4,
  },
  photoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  photoLocation: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  photoStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  photoPrice: {
    fontSize: 12,
    fontWeight: '600',
    color: '#B0E0E6',
    marginLeft: 'auto',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  trendingSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingTag: {
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  tagBlur: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  tagText: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  tabContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  tabContentText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
});

export default PicJerrScreen;