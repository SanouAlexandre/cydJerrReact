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

// Données mockées pour les véhicules disponibles
const mockVehicles = [
  {
    id: 1,
    name: 'BMW Série 3',
    type: 'Berline',
    year: 2023,
    category: 'Premium',
    price: 45000, // 450 Jerr/jour
    monthlyPrice: 1200000, // 12000 Jerr/mois
    available: true,
    fuel: 'Essence',
    seats: 5,
    location: 'Paris 15ème',
    rating: 4.8,
    image: '🚗',
    features: ['GPS', 'Climatisation', 'Bluetooth'],
  },
  {
    id: 2,
    name: 'Tesla Model 3',
    type: 'Électrique',
    year: 2024,
    category: 'Électrique',
    price: 55000, // 550 Jerr/jour
    monthlyPrice: 1500000, // 15000 Jerr/mois
    available: true,
    fuel: 'Électrique',
    seats: 5,
    location: 'Lyon 3ème',
    rating: 4.9,
    image: '⚡',
    features: ['Autopilot', 'Supercharge', 'Premium Audio'],
  },
  {
    id: 3,
    name: 'Yamaha MT-07',
    type: 'Moto',
    year: 2023,
    category: 'Sport',
    price: 25000, // 250 Jerr/jour
    monthlyPrice: 650000, // 6500 Jerr/mois
    available: false,
    fuel: 'Essence',
    seats: 2,
    location: 'Marseille',
    rating: 4.7,
    image: '🏍️',
    features: ['ABS', 'Traction Control', 'LED'],
  },
  {
    id: 4,
    name: 'Mercedes Sprinter',
    type: 'Utilitaire',
    year: 2022,
    category: 'Professionnel',
    price: 35000, // 350 Jerr/jour
    monthlyPrice: 900000, // 9000 Jerr/mois
    available: true,
    fuel: 'Diesel',
    seats: 3,
    location: 'Toulouse',
    rating: 4.6,
    image: '🚐',
    features: ['Grande capacité', 'GPS Pro', 'Caméra recul'],
  },
  {
    id: 5,
    name: 'Audi e-tron',
    type: 'SUV',
    year: 2024,
    category: 'Électrique',
    price: 65000, // 650 Jerr/jour
    monthlyPrice: 1800000, // 18000 Jerr/mois
    available: true,
    fuel: 'Électrique',
    seats: 7,
    location: 'Nice',
    rating: 4.8,
    image: '🚙',
    features: ['Quattro', 'Matrix LED', 'Bang & Olufsen'],
  },
];

// Données mockées pour les filtres
const filterCategories = [
  { id: 'all', name: 'Tous', active: true },
  { id: 'cars', name: 'Voitures', active: false },
  { id: 'motos', name: 'Motos', active: false },
  { id: 'trucks', name: 'Camions', active: false },
  { id: 'electric', name: 'Électrique', active: false },
  { id: 'available', name: 'Disponible', active: false },
];

const LeaseJerrScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [filters, setFilters] = useState(filterCategories);
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleFilterPress = (filterId) => {
    setActiveFilter(filterId);
    setFilters(filters.map(filter => ({
      ...filter,
      active: filter.id === filterId
    })));
  };

  const renderVehicleCard = ({ item, index }) => (
    <Animated.View
      style={[
        styles.vehicleCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0],
            }),
          }],
        },
      ]}
    >
      <BlurView blurAmount={20} blurType="light" style={styles.vehicleCardBlur}>
        <View style={styles.vehicleCardContent}>
          <View style={styles.vehicleHeader}>
            <Text style={styles.vehicleEmoji}>{item.image}</Text>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{item.name}</Text>
              <Text style={styles.vehicleType}>{item.type} • {item.year}</Text>
            </View>
            <View style={[
              styles.categoryBadge,
              { backgroundColor: item.category === 'Électrique' ? '#4ECDC4' : '#FFDE59' }
            ]}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>

          <View style={styles.vehicleDetails}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>À partir de</Text>
              <Text style={styles.priceValue}>{formatJerr(item.price)}/jour</Text>
              <Text style={styles.monthlyPrice}>ou {formatJerr(item.monthlyPrice)}/mois</Text>
            </View>
            
            <View style={[
              styles.availabilityBadge,
              { backgroundColor: item.available ? '#4ECDC4' : '#FF6B6B' }
            ]}>
              <Text style={styles.availabilityText}>
                {item.available ? 'Disponible' : 'Indisponible'}
              </Text>
            </View>
          </View>

          <View style={styles.vehicleMetadata}>
            <View style={styles.metadataItem}>
              <Ionicons name="car-outline" size={16} color="#FFFFFF80" />
              <Text style={styles.metadataText}>{item.fuel}</Text>
            </View>
            <View style={styles.metadataItem}>
              <Ionicons name="people-outline" size={16} color="#FFFFFF80" />
              <Text style={styles.metadataText}>{item.seats} places</Text>
            </View>
            <View style={styles.metadataItem}>
              <Ionicons name="location-outline" size={16} color="#FFFFFF80" />
              <Text style={styles.metadataText}>{item.location}</Text>
            </View>
          </View>

          <View style={styles.vehicleFooter}>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#FFDE59" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
            
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: item.available ? '#FFDE59' : '#666666' }
              ]}
              disabled={!item.available}
            >
              <Text style={[
                styles.actionButtonText,
                { color: item.available ? '#000000' : '#CCCCCC' }
              ]}>
                {item.available ? 'Réserver' : 'Indisponible'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </BlurView>
    </Animated.View>
  );

  const renderFilterPill = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.filterPill,
        item.active && styles.filterPillActive
      ]}
      onPress={() => handleFilterPress(item.id)}
    >
      <BlurView blurAmount={item.active ? 30 : 15} blurType="light" style={styles.filterPillBlur}>
        <Text style={[
          styles.filterPillText,
          item.active && styles.filterPillTextActive
        ]}>
          {item.name}
        </Text>
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460', '#533483']}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* Header fixe */}
      <Animated.View
        style={[
          styles.header,
          {
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, 100],
                outputRange: [0, -10],
                extrapolate: 'clamp',
              }),
            }],
          },
        ]}
      >
        <BlurView blurAmount={20} blurType="light" style={styles.headerBlur}>
          <View style={styles.headerContent}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <MaterialCommunityIcons name="truck" size={28} color="#FFDE59" />
              <View style={styles.headerTextContainer}>
                <Text style={styles.headerTitle}>LeaseJerr</Text>
                <Text style={styles.headerSubtitle}>Location & Leasing</Text>
              </View>
            </View>
            
            <TouchableOpacity style={styles.searchButton}>
              <BlurView blurAmount={15} blurType="light" style={styles.searchButtonBlur}>
                <Feather name="search" size={20} color="#FFFFFF" />
              </BlurView>
            </TouchableOpacity>
          </View>
        </BlurView>
      </Animated.View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        {/* Zone de recherche et filtres */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <BlurView blurAmount={15} blurType="light" style={styles.searchInputBlur}>
              <View style={styles.searchInputContainer}>
                <Feather name="search" size={20} color="#FFFFFF80" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un véhicule..."
                  placeholderTextColor="#FFFFFF60"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity style={styles.filterButton}>
                  <Feather name="filter" size={20} color="#FFFFFF80" />
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>

          {/* Filtres rapides */}
          <FlatList
            data={filters}
            renderItem={renderFilterPill}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filtersContainer}
          />
        </View>

        {/* Options rapides */}
        <View style={styles.quickOptionsSection}>
          <Text style={styles.sectionTitle}>Options rapides</Text>
          <View style={styles.quickOptionsGrid}>
            <TouchableOpacity style={styles.quickOptionCard}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={styles.quickOptionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <BlurView blurAmount={10} blurType="light" style={styles.quickOptionBlur}>
                  <Ionicons name="calendar-outline" size={32} color="#FFFFFF" />
                  <Text style={styles.quickOptionTitle}>Location courte</Text>
                  <Text style={styles.quickOptionSubtitle}>À la journée</Text>
                </BlurView>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickOptionCard}>
              <LinearGradient
                colors={['#11998e', '#38ef7d']}
                style={styles.quickOptionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <BlurView blurAmount={10} blurType="light" style={styles.quickOptionBlur}>
                  <MaterialCommunityIcons name="currency-usd" size={32} color="#FFFFFF" />
                  <Text style={styles.quickOptionTitle}>Leasing/LOA</Text>
                  <Text style={styles.quickOptionSubtitle}>Mensuel</Text>
                </BlurView>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Section statistiques */}
        <View style={styles.statsSection}>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <BlurView blurAmount={15} blurType="light" style={styles.statCardBlur}>
                <MaterialCommunityIcons name="car-multiple" size={32} color="#FFDE59" />
                <Text style={styles.statValue}>850+</Text>
                <Text style={styles.statLabel}>Véhicules</Text>
              </BlurView>
            </View>

            <View style={styles.statCard}>
              <BlurView blurAmount={15} blurType="light" style={styles.statCardBlur}>
                <Ionicons name="star" size={32} color="#FFDE59" />
                <Text style={styles.statValue}>4.7</Text>
                <Text style={styles.statLabel}>Note moyenne</Text>
              </BlurView>
            </View>

            <View style={styles.statCard}>
              <BlurView blurAmount={15} blurType="light" style={styles.statCardBlur}>
                <MaterialCommunityIcons name="clock-outline" size={32} color="#FFDE59" />
                <Text style={styles.statValue}>24h</Text>
                <Text style={styles.statLabel}>Service</Text>
              </BlurView>
            </View>
          </View>
        </View>

        {/* Liste des véhicules */}
        <View style={styles.vehiclesSection}>
          <Text style={styles.sectionTitle}>Véhicules disponibles</Text>
          <FlatList
            data={mockVehicles}
            renderItem={renderVehicleCard}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.vehiclesList}
          />
        </View>

        {/* Offre spéciale */}
        <View style={styles.specialOfferSection}>
          <TouchableOpacity style={styles.specialOfferCard}>
            <LinearGradient
              colors={['#667eea', '#764ba2', '#f093fb']}
              style={styles.specialOfferGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <BlurView blurAmount={10} blurType="light" style={styles.specialOfferBlur}>
                <Text style={styles.specialOfferTitle}>Offre spéciale leasing</Text>
                <Text style={styles.specialOfferDescription}>
                  -20% sur votre premier contrat de leasing longue durée
                </Text>
                <TouchableOpacity style={styles.specialOfferButton}>
                  <BlurView blurAmount={20} blurType="light" style={styles.specialOfferButtonBlur}>
                    <Text style={styles.specialOfferButtonText}>En savoir plus</Text>
                  </BlurView>
                </TouchableOpacity>
              </BlurView>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  headerBlur: {
    borderRadius: 0,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginLeft: 15,
  },
  headerTextContainer: {
    marginLeft: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? 120 : 100,
    paddingBottom: 100,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  searchContainer: {
    marginBottom: 15,
  },
  searchInputBlur: {
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  filterButton: {
    padding: 5,
  },
  filtersContainer: {
    paddingLeft: 20,
  },
  filterPill: {
    marginRight: 10,
    borderRadius: 20,
    overflow: 'hidden',
  },
  filterPillActive: {
    borderWidth: 1,
    borderColor: '#FFDE59',
  },
  filterPillBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  filterPillText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  filterPillTextActive: {
    color: '#FFDE59',
    fontWeight: '600',
  },
  quickOptionsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickOptionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickOptionCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    height: 120,
  },
  quickOptionGradient: {
    flex: 1,
  },
  quickOptionBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  quickOptionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  quickOptionSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statsSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
    height: 100,
  },
  statCardBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  vehiclesSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  vehiclesList: {
    paddingTop: 10,
  },
  vehicleCard: {
    marginBottom: 15,
    borderRadius: 20,
    overflow: 'hidden',
  },
  vehicleCardBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  vehicleCardContent: {
    padding: 20,
  },
  vehicleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  vehicleEmoji: {
    fontSize: 32,
    marginRight: 15,
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  vehicleType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  vehicleDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  priceContainer: {
    flex: 1,
  },
  priceLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  priceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFDE59',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  monthlyPrice: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  availabilityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  availabilityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  vehicleMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  metadataText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  vehicleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#FFFFFF',
    marginLeft: 5,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  actionButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  specialOfferSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  specialOfferCard: {
    borderRadius: 20,
    overflow: 'hidden',
    height: 150,
  },
  specialOfferGradient: {
    flex: 1,
  },
  specialOfferBlur: {
    flex: 1,
    padding: 25,
    justifyContent: 'center',
  },
  specialOfferTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  specialOfferDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  specialOfferButton: {
    alignSelf: 'flex-start',
    borderRadius: 20,
    overflow: 'hidden',
  },
  specialOfferButtonBlur: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 20,
  },
  specialOfferButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default LeaseJerrScreen;