import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  TextInput,
  Animated,
  Dimensions,
  StatusBar,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Slider from '@react-native-community/slider';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

// Données mockées pour les actifs immobiliers
const mockAssets = [
  {
    id: 1,
    title: 'Appartement Haussmannien',
    address: '16ème arrondissement, Paris',
    price: 85000000, // en centimes d'euros, converti en Jerr
    surface: 120,
    rooms: 4,
    yield: 3.2,
    category: 'apartment',
    image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400',
    tokenized: true,
    energyRating: 'C',
  },
  {
    id: 2,
    title: 'Villa Moderne',
    address: 'Cannes, Alpes-Maritimes',
    price: 120000000,
    surface: 250,
    rooms: 6,
    yield: 2.8,
    category: 'house',
    image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=400',
    tokenized: false,
    energyRating: 'B',
  },
  {
    id: 3,
    title: 'Loft Industriel',
    address: 'Belleville, Paris',
    price: 45000000,
    surface: 85,
    rooms: 2,
    yield: 4.1,
    category: 'loft',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400',
    tokenized: true,
    energyRating: 'D',
  },
];

const categories = [
  { id: 'all', name: 'Tous', emoji: '🏘️' },
  { id: 'house', name: 'Maison', emoji: '🏠' },
  { id: 'apartment', name: 'Appartement', emoji: '🏢' },
  { id: 'loft', name: 'Loft', emoji: '🏭' },
  { id: 'commercial', name: 'Commercial', emoji: '🏪' },
];

const ImmoJerrScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState([0, 200000000]); // en Jerr
  const [surfaceRange, setSurfaceRange] = useState([0, 500]);
  const [onlyTokenized, setOnlyTokenized] = useState(false);
  const [assets, setAssets] = useState(mockAssets);
  
  const scaleAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);

  // Conversion euros vers Jerr (1 Jerr = 0,01€)
  const convertToJerr = (priceInCentimes) => {
    return Math.round(priceInCentimes / 100 / 0.01);
  };

  const formatJerr = (amount) => {
    return new Intl.NumberFormat('fr-FR').format(amount) + ' Jerr';
  };

  // Statistiques calculées
  const totalAssets = assets.length;
  const tokenizedAssets = assets.filter(asset => asset.tokenized).length;
  const tokenizedPercentage = totalAssets > 0 ? Math.round((tokenizedAssets / totalAssets) * 100) : 0;
  const totalValue = assets.reduce((sum, asset) => sum + convertToJerr(asset.price), 0);
  const averageYield = totalAssets > 0 ? (assets.reduce((sum, asset) => sum + (Number(asset.yield) || 0), 0) / totalAssets).toFixed(1) : 0;

  const filteredAssets = assets.filter(asset => {
    const matchesCategory = selectedCategory === 'all' || asset.category === selectedCategory;
    const matchesPrice = convertToJerr(asset.price) >= priceRange[0] && convertToJerr(asset.price) <= priceRange[1];
    const matchesSurface = asset.surface >= surfaceRange[0] && asset.surface <= surfaceRange[1];
    const matchesTokenized = !onlyTokenized || asset.tokenized;
    const matchesSearch = asset.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         asset.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesPrice && matchesSurface && matchesTokenized && matchesSearch;
  });

  const StatCard = ({ title, value, icon, iconType = 'Ionicons' }) => {
    const IconComponent = iconType === 'MaterialCommunityIcons' ? MaterialCommunityIcons : Ionicons;
    
    return (
      <BlurView blurAmount={20} blurType="light" style={styles.statCard}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.statCardGradient}
        >
          <IconComponent name={icon} size={24} color="#FFD700" style={styles.statIcon} />
          <Text style={styles.statValue}>{value}</Text>
          <Text style={styles.statTitle}>{title}</Text>
        </LinearGradient>
      </BlurView>
    );
  };

  const CategoryTab = ({ category, isActive, onPress }) => (
    <TouchableOpacity
      style={[styles.categoryTab, isActive && styles.categoryTabActive]}
      onPress={onPress}
    >
      {isActive && (
        <LinearGradient
          colors={['#FFD700', '#FFA500']}
          style={styles.categoryTabGradient}
        />
      )}
      <Text style={styles.categoryEmoji}>{category.emoji}</Text>
      <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
        {category.name}
      </Text>
    </TouchableOpacity>
  );

  const AssetCard = ({ asset }) => (
    <TouchableOpacity style={styles.assetCard}>
      <BlurView blurAmount={15} blurType="light" style={styles.assetCardBlur}>
        <Image source={{ uri: asset.image }} style={styles.assetImage} />
        <View style={styles.assetBadge}>
          <Text style={styles.assetBadgeText}>
            {categories.find(cat => cat.id === asset.category)?.emoji}
          </Text>
        </View>
        {asset.tokenized && (
          <View style={styles.tokenizedBadge}>
            <MaterialCommunityIcons name="bitcoin" size={12} color="#FFD700" />
          </View>
        )}
        
        <View style={styles.assetContent}>
          <Text style={styles.assetTitle}>{asset.title}</Text>
          <Text style={styles.assetAddress}>{asset.address}</Text>
          
          <View style={styles.assetDetails}>
            <Text style={styles.assetPrice}>{formatJerr(convertToJerr(asset.price))}</Text>
            <View style={styles.assetSpecs}>
              <Text style={styles.assetSpec}>{asset.surface}m²</Text>
              <Text style={styles.assetSpec}>{asset.rooms} pièces</Text>
              <Text style={styles.assetYield}>+{asset.yield}%</Text>
            </View>
          </View>
          
          <View style={styles.assetActions}>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="eye" size={16} color="#FFD700" />
              <Text style={styles.actionText}>Détails</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton}>
              <Ionicons name="heart-outline" size={16} color="#FFD700" />
              <Text style={styles.actionText}>Watchlist</Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const FiltersModal = () => (
    <Modal
      visible={showFilters}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setShowFilters(false)}
    >
      <View style={styles.modalOverlay}>
        <BlurView blurAmount={50} blurType="light" style={styles.modalContainer}>
          <LinearGradient
            colors={['rgba(15,28,63,0.95)', 'rgba(45,74,123,0.95)']}
            style={styles.modalContent}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Ionicons name="close" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalBody}>
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Prix (Jerr)</Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={200000000}
                    value={priceRange[1]}
                    onValueChange={(value) => setPriceRange([priceRange[0], value])}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    thumbStyle={styles.sliderThumb}
                  />
                  <Text style={styles.sliderValue}>
                    {formatJerr(priceRange[0])} - {formatJerr(priceRange[1])}
                  </Text>
                </View>
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Surface (m²)</Text>
                <View style={styles.sliderContainer}>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={500}
                    value={surfaceRange[1]}
                    onValueChange={(value) => setSurfaceRange([surfaceRange[0], value])}
                    minimumTrackTintColor="#FFD700"
                    maximumTrackTintColor="rgba(255,255,255,0.3)"
                    thumbStyle={styles.sliderThumb}
                  />
                  <Text style={styles.sliderValue}>
                    {surfaceRange[0]}m² - {surfaceRange[1]}m²
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity
                style={[styles.toggleButton, onlyTokenized && styles.toggleButtonActive]}
                onPress={() => setOnlyTokenized(!onlyTokenized)}
              >
                <MaterialCommunityIcons 
                  name={onlyTokenized ? "checkbox-marked" : "checkbox-blank-outline"} 
                  size={20} 
                  color={onlyTokenized ? "#FFD700" : "#FFFFFF"} 
                />
                <Text style={[styles.toggleText, onlyTokenized && styles.toggleTextActive]}>
                  Uniquement les actifs tokenisés
                </Text>
              </TouchableOpacity>
            </ScrollView>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={() => {
                  setPriceRange([0, 200000000]);
                  setSurfaceRange([0, 500]);
                  setOnlyTokenized(false);
                }}
              >
                <Text style={styles.resetButtonText}>Reset</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.applyButton}
                onPress={() => setShowFilters(false)}
              >
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.applyButtonGradient}
                >
                  <Text style={styles.applyButtonText}>Appliquer</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </BlurView>
      </View>
    </Modal>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#0F1C3F', '#2D4A7B', '#1A365D']}
        style={styles.background}
      >
        {/* Header fixe */}
        <BlurView blurAmount={20} blurType="light" style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>ImmoJerr</Text>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerAction}
              onPress={() => setShowFilters(true)}
            >
              <Ionicons name="options" size={20} color="#FFD700" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerAction}>
              <Ionicons name="add" size={20} color="#FFD700" />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Contenu scrollable */}
        <Animated.ScrollView 
          style={[styles.scrollContent, { opacity: fadeAnim }]}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContentContainer}
        >
          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <BlurView blurAmount={15} blurType="light" style={styles.searchBar}>
              <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Rechercher un bien..."
                placeholderTextColor="rgba(255,255,255,0.6)"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </BlurView>
          </View>

          {/* Stats Section */}
          <View style={styles.statsSection}>
            <View style={styles.statsGrid}>
              <StatCard 
                title="Total Actifs" 
                value={totalAssets.toString()} 
                icon="business" 
              />
              <StatCard 
                title="Tokenisés" 
                value={`${tokenizedPercentage}%`} 
                icon="bitcoin" 
                iconType="MaterialCommunityIcons"
              />
              <StatCard 
                title="Valeur Totale" 
                value={formatJerr(totalValue)} 
                icon="trending-up" 
              />
              <StatCard 
                title="Rendement Moy." 
                value={`${averageYield}%`} 
                icon="analytics" 
              />
            </View>
          </View>

          {/* Category Tabs */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <CategoryTab
                key={category.id}
                category={category}
                isActive={selectedCategory === category.id}
                onPress={() => setSelectedCategory(category.id)}
              />
            ))}
          </ScrollView>

          {/* Assets List */}
          <View style={styles.assetsContainer}>
            {filteredAssets.length > 0 ? (
              filteredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))
            ) : (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="home-search" size={64} color="rgba(255,255,255,0.3)" />
                <Text style={styles.emptyStateText}>Aucun actif trouvé</Text>
                <Text style={styles.emptyStateSubtext}>Modifiez vos critères de recherche</Text>
              </View>
            )}
          </View>
        </Animated.ScrollView>
      </LinearGradient>

      <FiltersModal />
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
  scrollContent: {
    flex: 1,
    marginTop: 80,
  },
  scrollContentContainer: {
    paddingBottom: 100,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  headerAction: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    width: (width - 55) / 2,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
  },
  statCardGradient: {
    padding: 20,
    alignItems: 'center',
  },
  statIcon: {
    marginBottom: 10,
    textShadowColor: '#FFD700',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContent: {
    paddingHorizontal: 20,
    gap: 10,
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    position: 'relative',
    overflow: 'hidden',
  },
  categoryTabActive: {
    borderColor: '#FFD700',
  },
  categoryTabGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.7)',
  },
  categoryTextActive: {
    color: '#000000',
    fontFamily: 'Poppins-Bold',
  },
  assetsContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  assetCard: {
    marginBottom: 20,
    borderRadius: 20,
    overflow: 'hidden',
  },
  assetCardBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    overflow: 'hidden',
  },
  assetImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  assetBadge: {
    position: 'absolute',
    top: 15,
    left: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
  },
  assetBadgeText: {
    fontSize: 16,
  },
  tokenizedBadge: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: 'rgba(255,215,0,0.2)',
    padding: 8,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  assetContent: {
    padding: 20,
  },
  assetTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  assetAddress: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 15,
  },
  assetDetails: {
    marginBottom: 15,
  },
  assetPrice: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  assetSpecs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  assetSpec: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
  },
  assetYield: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#00FF88',
  },
  assetActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255,215,0,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,215,0,0.3)',
    flex: 0.48,
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
    color: '#FFD700',
    marginLeft: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    height: height * 0.7,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },
  modalContent: {
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  filterSection: {
    marginBottom: 30,
  },
  filterLabel: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  sliderContainer: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  slider: {
    width: '100%',
    height: 40,
  },
  sliderThumb: {
    backgroundColor: '#FFD700',
    width: 20,
    height: 20,
  },
  sliderValue: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    marginTop: 10,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  toggleButtonActive: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255,215,0,0.1)',
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 10,
  },
  toggleTextActive: {
    color: '#FFD700',
    fontFamily: 'Poppins-Medium',
  },
  modalActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 15,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: '#FFFFFF',
  },
  applyButton: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  applyButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#000000',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: 'rgba(255,255,255,0.6)',
    marginTop: 20,
  },
  emptyStateSubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255,255,255,0.4)',
    marginTop: 5,
  },
});

export default ImmoJerrScreen;