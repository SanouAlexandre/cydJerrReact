import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import * as Location from 'expo-location';
import { formatJerr, eurToJerr } from '../utils/price';
// import MapView, { Marker } from 'react-native-maps'; // Removed due to native module requirements

const { width, height } = Dimensions.get('window');

const VagoJerrScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [isDriverMode, setIsDriverMode] = useState(false);
  const [pulseAnim] = useState(new Animated.Value(0));
  const [userLocation, setUserLocation] = useState(null);
  const [locationAccuracy, setLocationAccuracy] = useState(null);
  const [rideEstimate, setRideEstimate] = useState(null);

  // Animation du point pulsant
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // Géolocalisation
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'L\'accès à la localisation est nécessaire pour VagoJerr');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocationAccuracy(location.coords.accuracy);
      
      // Simuler une estimation de course
      calculateRideEstimate(location.coords.latitude, location.coords.longitude);
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      // Utiliser une position par défaut (Paris)
      setUserLocation({ latitude: 48.8566, longitude: 2.3522 });
    }
  };

  const calculateRideEstimate = (lat, lng) => {
    // Simulation d'estimation basée sur la distance et le trafic
    const basePrice = Math.random() * 15 + 5; // Entre 5€ et 20€
    const jerrPrice = eurToJerr(basePrice);
    const estimatedTime = Math.floor(Math.random() * 10) + 3; // Entre 3 et 13 min
    
    setRideEstimate({
      price: jerrPrice,
      time: estimatedTime,
      distance: (Math.random() * 8 + 1).toFixed(1), // Entre 1 et 9 km
    });
  };

  const recentDestinations = [
    { id: 1, name: 'Maison', address: '123 Rue de la Paix, Paris' },
    { id: 2, name: 'Bureau', address: '45 Avenue des Champs-Élysées' },
    { id: 3, name: 'Gare du Nord', address: 'Place Napoléon III, Paris' },
    { id: 4, name: 'Aéroport CDG', address: 'Terminal 2E, Roissy' },
  ];

  const vehicleMarkers = [
    { id: 1, type: 'Standard', eta: 3, lat: userLocation?.latitude || 48.8566, lng: userLocation?.longitude || 2.3522, price: eurToJerr(8.5) },
    { id: 2, type: 'Comfort', eta: 5, lat: (userLocation?.latitude || 48.8566) + 0.004, lng: (userLocation?.longitude || 2.3522) - 0.015, price: eurToJerr(12.0) },
    { id: 3, type: 'XL', eta: 7, lat: (userLocation?.latitude || 48.8566) - 0.002, lng: (userLocation?.longitude || 2.3522) + 0.008, price: eurToJerr(15.5) },
  ];

  const StatusBarComponent = () => (
    <View style={styles.statusBar}>
      <Text style={styles.statusTime}>14:32</Text>
      <View style={styles.statusRight}>
        <Ionicons name="cellular" size={16} color="#FFFFFF" />
        <Ionicons name="wifi" size={16} color="#FFFFFF" style={{ marginHorizontal: 4 }} />
        <Ionicons name="battery-full" size={16} color="#FFFFFF" />
      </View>
    </View>
  );

  const HeaderComponent = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.header}>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>VagoJerr</Text>
      
      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="person-circle" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Ionicons name="settings" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </BlurView>
  );

  const DriverToggle = () => (
    <TouchableOpacity
      style={[styles.driverToggle, isDriverMode && styles.driverToggleActive]}
      onPress={() => setIsDriverMode(!isDriverMode)}
    >
      <Ionicons 
        name="car" 
        size={20} 
        color={isDriverMode ? "#0F1C3F" : "#FFFFFF"} 
      />
      <Text style={[styles.driverText, isDriverMode && styles.driverTextActive]}>
        Conducteur
      </Text>
    </TouchableOpacity>
  );

  const MapComponent = () => (
    <View style={styles.mapContainer}>
      <LinearGradient
        colors={['#0F1C3F', '#1A365D', '#2D4A7B']}
        style={styles.map}
      >
        {/* Simulation de carte avec grille */}
        <View style={styles.mapGrid}>
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={i} style={styles.gridLine} />
          ))}
        </View>
        
        {/* Marqueurs de véhicules simulés */}
        {vehicleMarkers.map((vehicle, index) => (
          <TouchableOpacity
            key={vehicle.id}
            style={[
              styles.vehicleMarkerSim,
              {
                top: `${30 + index * 15}%`,
                left: `${20 + index * 20}%`,
              }
            ]}
            onPress={() => Alert.alert(
              `${vehicle.type}`,
              `ETA: ${vehicle.eta}min\nPrix: ${formatJerr(vehicle.price)}\nDistance: ${(Math.random() * 3 + 0.5).toFixed(1)}km`
            )}
          >
            <MaterialCommunityIcons name="car" size={20} color="#FFDE59" />
            <Text style={styles.etaText}>{vehicle.eta}min</Text>
            <Text style={styles.priceText}>{formatJerr(vehicle.price)}</Text>
          </TouchableOpacity>
        ))}
        
        {/* Point utilisateur simulé */}
        <View style={styles.userLocationSim}>
          <Animated.View style={[
            styles.userPulse,
            {
              opacity: pulseAnim,
              transform: [{
                scale: pulseAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 1.5]
                })
              }]
            }
          ]} />
          <View style={styles.userDot} />
          {locationAccuracy && (
            <Text style={styles.accuracyText}>
              Précision: {Math.round(locationAccuracy)}m
            </Text>
          )}
        </View>
        
        {/* Overlay de routes simulées */}
        <View style={styles.roadOverlay}>
          <View style={styles.road} />
          <View style={[styles.road, styles.roadVertical]} />
        </View>
      </LinearGradient>
    </View>
  );

  const VehicleIndicator = () => (
    <BlurView blurAmount={15} blurType="light" style={styles.vehicleIndicator}>
      <View style={styles.indicatorContent}>
        <Animated.View style={[
          styles.pulsePoint,
          {
            opacity: pulseAnim,
            transform: [{
              scale: pulseAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.2]
              })
            }]
          }
        ]} />
        <Text style={styles.vehicleText}>3 véhicules proches</Text>
        <Text style={styles.etaSmallText}>3 min</Text>
        {rideEstimate && (
          <Text style={styles.estimateText}>
            ~{formatJerr(rideEstimate.price)}
          </Text>
        )}
      </View>
    </BlurView>
  );

  const ActionButtons = () => (
    <View style={styles.actionSection}>
      <TouchableOpacity 
        style={styles.searchButton}
        onPress={() => Alert.alert('Destination', 'Sélection de destination à implémenter')}
      >
        <Ionicons name="search" size={20} color="#FFDE59" />
        <Text style={styles.searchText}>Où allez-vous ?</Text>
        {rideEstimate && (
          <Text style={styles.estimatePreview}>
            ~{formatJerr(rideEstimate.price)}
          </Text>
        )}
      </TouchableOpacity>
      
      <View style={styles.buttonRow}>
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CapiJerr')} // Historique des transactions
        >
          <Ionicons name="time" size={20} color="#FFFFFF" />
          <Text style={styles.actionButtonText}>Historique</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => navigation.navigate('CapiJerr')} // Wallet JERR
        >
          <Text style={styles.jerrIcon}>J</Text>
          <Text style={styles.actionButtonText}>Wallet</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const RecentDestinations = () => (
    <BlurView blurAmount={15} blurType="light" style={styles.recentSection}>
      <View style={styles.sectionHeader}>
        <Ionicons name="time" size={20} color="#FFDE59" />
        <Text style={styles.sectionTitle}>Destinations récentes</Text>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {recentDestinations.map((destination) => (
          <TouchableOpacity key={destination.id} style={styles.destinationItem}>
            <View style={styles.destinationIcon}>
              <Ionicons name="location" size={16} color="#FFDE59" />
            </View>
            <View style={styles.destinationText}>
              <Text style={styles.destinationName}>{destination.name}</Text>
              <Text style={styles.destinationAddress}>{destination.address}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.6)" />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BlurView>
  );

  return (
    <LinearGradient
      colors={['#0F1C3F', '#2D4A7B', '#1A365D']}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <StatusBarComponent />
      <HeaderComponent />
      <DriverToggle />
      
      <MapComponent />
      
      <VehicleIndicator />
      <ActionButtons />
      <RecentDestinations />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 24,
    left: 0,
    right: 0,
    height: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1000,
  },
  statusTime: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  statusRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 68 : (StatusBar.currentHeight || 24) + 24,
    left: 0,
    right: 0,
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    zIndex: 999,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.2)',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 20,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    padding: 8,
    marginLeft: 8,
  },
  driverToggle: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 140 : (StatusBar.currentHeight || 24) + 96,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    backgroundColor: 'rgba(255,255,255,0.1)',
    zIndex: 998,
  },
  driverToggleActive: {
    backgroundColor: '#FFDE59',
    borderColor: '#FFDE59',
  },
  driverText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  driverTextActive: {
    color: '#0F1C3F',
  },
  mapContainer: {
    flex: 1,
    marginTop: Platform.OS === 'ios' ? 200 : (StatusBar.currentHeight || 24) + 156,
    overflow: 'hidden',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  mapOverlay: {
    flex: 1,
    position: 'relative',
  },
  vehicleMarker: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)'
  },
  etaText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 10,
    marginTop: 2,
  },
  priceText: {
    color: '#FFDE59',
    fontFamily: 'Poppins-Bold',
    fontSize: 8,
    marginTop: 1,
  },
  accuracyText: {
    position: 'absolute',
    top: 35,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Poppins-Regular',
    fontSize: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  mapGrid: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridLine: {
    width: '5%',
    height: '5%',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  vehicleMarkerSim: {
    position: 'absolute',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  userLocationSim: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -15,
    marginLeft: -15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  roadOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  road: {
    position: 'absolute',
    backgroundColor: 'rgba(45, 74, 123, 0.8)',
    height: 4,
    width: '80%',
    top: '50%',
    left: '10%',
  },
  roadVertical: {
    width: 4,
    height: '80%',
    top: '10%',
    left: '50%',
  },
  userPulse: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(255, 222, 89, 0.3)',
  },
  userDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#FFDE59',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  vehicleIndicator: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 220 : (StatusBar.currentHeight || 24) + 176,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  indicatorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  pulsePoint: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00FF88',
    marginRight: 12,
  },
  vehicleText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    flex: 1,
  },
  etaSmallText: {
    color: '#FFDE59',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  estimateText: {
    color: '#00FF88',
    fontFamily: 'Poppins-Bold',
    fontSize: 12,
    marginLeft: 8,
  },
  actionSection: {
    position: 'absolute',
    bottom: 320,
    left: 20,
    right: 20,
  },
  searchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    marginLeft: 12,
    flex: 1,
  },
  estimatePreview: {
    color: '#00FF88',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    marginRight: 8,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 16,
    borderRadius: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  jerrIcon: {
    color: '#FFDE59',
    fontFamily: 'Poppins-Bold',
    fontSize: 18,
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  recentSection: {
    position: 'absolute',
    bottom: 40,
    left: 20,
    right: 20,
    maxHeight: 240,
    borderRadius: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    marginLeft: 12,
  },
  destinationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  destinationIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  destinationText: {
    flex: 1,
  },
  destinationName: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  destinationAddress: {
    color: 'rgba(255,255,255,0.7)',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginTop: 2,
  },
});

export default VagoJerrScreen;