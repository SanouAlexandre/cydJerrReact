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
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { formatJerr } from '../utils/price';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Données mockées pour les annonces
const mockListings = [
  {
    id: 1,
    title: 'iPhone 14 Pro Max',
    price: 120000, // 1200 Jerr (1200€ / 100)
    location: 'Paris 15ème',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=300',
    isFavorite: false,
    isFeatured: true,
    condition: 'Comme neuf',
    seller: 'TechJerr',
  },
  {
    id: 2,
    title: 'MacBook Air M2',
    price: 150000, // 1500 Jerr
    location: 'Lyon 3ème',
    image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=300',
    isFavorite: true,
    isFeatured: true,
    condition: 'Excellent état',
    seller: 'AppleJerr',
  },
  {
    id: 3,
    title: 'Tesla Model 3',
    price: 4500000, // 45000 Jerr
    location: 'Marseille',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=300',
    isFavorite: false,
    isFeatured: false,
    condition: 'Très bon état',
    seller: 'AutoJerr',
  },
  {
    id: 4,
    title: 'Rolex Submariner',
    price: 800000, // 8000 Jerr
    location: 'Nice',
    image: 'https://images.unsplash.com/photo-1523170335258-f5c6c6bd6eaf?w=300',
    isFavorite: false,
    isFeatured: false,
    condition: 'Neuf',
    seller: 'LuxuryJerr',
  },
];

// Catégories populaires
const categories = [
  { id: 1, name: 'Électronique', icon: 'phone-portrait', emoji: '📱' },
  { id: 2, name: 'Mode', icon: 'shirt', emoji: '👕' },
  { id: 3, name: 'Maison', icon: 'home', emoji: '🏠' },
  { id: 4, name: 'Auto', icon: 'car', emoji: '🚗' },
  { id: 5, name: 'Sport', icon: 'football', emoji: '⚽' },
  { id: 6, name: 'Livres', icon: 'book', emoji: '📚' },
  { id: 7, name: 'Jeux', icon: 'game-controller', emoji: '🎮' },
  { id: 8, name: 'Beauté', icon: 'flower', emoji: '💄' },
  { id: 9, name: 'Bijoux', icon: 'diamond', emoji: '💎' },
  { id: 10, name: 'Art', icon: 'brush', emoji: '🎨' },
  { id: 11, name: 'Musique', icon: 'musical-notes', emoji: '🎵' },
  { id: 12, name: 'Jardin', icon: 'leaf', emoji: '🌱' },
  { id: 13, name: 'Enfants', icon: 'teddy-bear', emoji: '🧸' },
  { id: 14, name: 'Animaux', icon: 'paw', emoji: '🐾' },
  { id: 15, name: 'Services', icon: 'construct', emoji: '🔧' },
  { id: 16, name: 'Autres', icon: 'ellipsis-horizontal', emoji: '📦' },
];

const SmadJerrScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [favorites, setFavorites] = useState([2]); // IDs des favoris
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const toggleFavorite = (id) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(fav => fav !== id)
        : [...prev, id]
    );
  };

  // Header Component
  const SmadJerrHeader = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>SmadJerr</Text>
        
        <TouchableOpacity style={styles.createButton}>
          <LinearGradient
            colors={['#FFDE59', '#FFB347']}
            style={styles.createGradient}
          >
            <Ionicons name="add" size={20} color="#1A1A1A" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
      
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <BlurView blurAmount={15} blurType="light" style={styles.searchBar}>
          <Ionicons name="search" size={20} color="rgba(255,255,255,0.7)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher une annonce..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.filterButton}>
            <Feather name="filter" size={18} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </BlurView>
      </View>
    </BlurView>
  );

  // Section Héro avec statistiques
  const HeroSection = () => (
    <Animated.View 
      style={[
        styles.heroSection,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.heroTitle}>Marketplace Premium</Text>
      <Text style={styles.heroSubtitle}>Achetez et vendez en toute sécurité</Text>
      
      <View style={styles.statsContainer}>
        <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
          <MaterialCommunityIcons name="package-variant" size={24} color="#FFDE59" />
          <Text style={styles.statNumber}>2,847</Text>
          <Text style={styles.statLabel}>Annonces actives</Text>
        </BlurView>
        
        <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
          <MaterialCommunityIcons name="eye" size={24} color="#FFDE59" />
          <Text style={styles.statNumber}>156K</Text>
          <Text style={styles.statLabel}>Vues totales</Text>
        </BlurView>
        
        <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
          <MaterialCommunityIcons name="currency-btc" size={24} color="#FFDE59" />
          <Text style={styles.statNumber}>89</Text>
          <Text style={styles.statLabel}>Offres JERRCOIN</Text>
        </BlurView>
      </View>
    </Animated.View>
  );

  // Grille de catégories
  const CategoriesGrid = () => (
    <Animated.View 
      style={[
        styles.categoriesSection,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      <Text style={styles.sectionTitle}>Catégories populaires</Text>
      <View style={styles.categoriesGrid}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              selectedCategory === category.id && styles.activeCategoryButton,
            ]}
            onPress={() => setSelectedCategory(
              selectedCategory === category.id ? null : category.id
            )}
          >
            <BlurView blurAmount={12} blurType="light" style={styles.categoryBlur}>
              <Text style={styles.categoryEmoji}>{category.emoji}</Text>
              <Text style={[
                styles.categoryText,
                selectedCategory === category.id && styles.activeCategoryText,
              ]}>
                {category.name}
              </Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </Animated.View>
  );

  // Carte d'annonce
  const ListingCard = ({ item, featured = false }) => (
    <TouchableOpacity style={[styles.listingCard, featured && styles.featuredCard]}>
      <BlurView blurAmount={10} blurType="light" style={styles.listingBlur}>
        <Image source={{ uri: item.image }} style={styles.listingImage} />
        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => toggleFavorite(item.id)}
        >
          <Ionicons 
            name={favorites.includes(item.id) ? "heart" : "heart-outline"} 
            size={20} 
            color={favorites.includes(item.id) ? "#FF6B6B" : "white"} 
          />
        </TouchableOpacity>
        
        <View style={styles.listingContent}>
          <Text style={styles.listingTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.listingPrice}>{formatJerr(item.price)}</Text>
          <View style={styles.listingMeta}>
            <Ionicons name="location-outline" size={14} color="rgba(255,255,255,0.7)" />
            <Text style={styles.listingLocation}>{item.location}</Text>
          </View>
          <Text style={styles.listingCondition}>{item.condition}</Text>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  // Section des annonces en vedette
  const FeaturedListings = () => {
    const featuredItems = mockListings.filter(item => item.isFeatured);
    
    return (
      <View style={styles.listingsSection}>
        <Text style={styles.sectionTitle}>Annonces en vedette</Text>
        <FlatList
          data={featuredItems}
          renderItem={({ item }) => <ListingCard item={item} featured />}
          keyExtractor={(item) => item.id.toString()}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.featuredList}
        />
      </View>
    );
  };

  // Section des dernières annonces
  const RecentListings = () => (
    <View style={styles.listingsSection}>
      <Text style={styles.sectionTitle}>Dernières annonces</Text>
      <View style={styles.recentGrid}>
        {mockListings.map((item) => (
          <ListingCard key={item.id} item={item} />
        ))}
      </View>
    </View>
  );

  // Actions rapides
  const QuickActions = () => (
    <View style={styles.actionsSection}>
      <TouchableOpacity style={styles.primaryAction}>
        <LinearGradient
          colors={['#FFDE59', '#FFB347']}
          style={styles.actionGradient}
        >
          <MaterialCommunityIcons name="plus" size={24} color="#1A1A1A" />
          <Text style={styles.primaryActionText}>Vendre un article</Text>
        </LinearGradient>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryAction}>
        <BlurView blurAmount={15} blurType="light" style={styles.secondaryActionBlur}>
          <MaterialCommunityIcons name="bitcoin" size={20} color="#FFDE59" />
          <Text style={styles.secondaryActionText}>Offres Crypto</Text>
        </BlurView>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Dégradé de fond premium */}
      <LinearGradient
        colors={['#8A2D6C', '#723072', '#2D747E', '#1D7CA6']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      />
      
      <SmadJerrHeader />
      
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeroSection />
        <CategoriesGrid />
        <FeaturedListings />
        <RecentListings />
        <QuickActions />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  createButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  createGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchContainer: {
    marginTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  filterButton: {
    padding: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginBottom: 25,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    padding: 15,
    alignItems: 'center',
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: (screenWidth - 60) / 4,
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  activeCategoryButton: {
    transform: [{ scale: 1.05 }],
  },
  categoryBlur: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: 15,
  },
  categoryEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  activeCategoryText: {
    color: '#FFDE59',
    fontWeight: 'bold',
  },
  listingsSection: {
    marginBottom: 30,
  },
  featuredList: {
    paddingHorizontal: 20,
  },
  listingCard: {
    width: screenWidth * 0.7,
    marginRight: 15,
    borderRadius: 15,
    overflow: 'hidden',
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#FFDE59',
  },
  listingBlur: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  listingImage: {
    width: '100%',
    height: 150,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  favoriteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  listingContent: {
    padding: 15,
  },
  listingTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  listingPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFDE59',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  listingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  listingLocation: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  listingCondition: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  recentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  actionsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  primaryAction: {
    flex: 2,
    marginRight: 10,
    borderRadius: 15,
    overflow: 'hidden',
  },
  actionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 20,
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginLeft: 10,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  secondaryAction: {
    flex: 1,
    borderRadius: 15,
    overflow: 'hidden',
  },
  secondaryActionBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
});

export default SmadJerrScreen;