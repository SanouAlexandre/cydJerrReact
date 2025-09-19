import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Feather, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { commonUIStyles, UI_CONSTANTS } from '../styles/commonUIStyles';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const EvenJerrScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tous');

  // Données des catégories
  const categories = [
    { id: 1, name: 'Tous', emoji: '🎯' },
    { id: 2, name: 'Concerts', emoji: '🎵' },
    { id: 3, name: 'Sport', emoji: '⚽' },
    { id: 4, name: 'Tech', emoji: '💻' },
    { id: 5, name: 'Art', emoji: '🎨' },
    { id: 6, name: 'Food', emoji: '🍕' },
    { id: 7, name: 'Nature', emoji: '🌲' },
  ];

  // Données des événements tendances
  const trendingEvents = [
    {
      id: 1,
      title: 'Festival de Musique Électronique',
      date: '15 Sept 2024',
      location: 'Paris, France',
      price: '4500 Jerr',
      participants: 1250,
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 2,
      title: 'Conférence Tech Innovation',
      date: '22 Sept 2024',
      location: 'Lyon, France',
      price: '12000 Jerr',
      participants: 850,
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=300&h=300&fit=crop&crop=center',
    },
    {
      id: 3,
      title: 'Exposition Art Contemporain',
      date: '28 Sept 2024',
      location: 'Marseille, France',
      price: '2500 Jerr',
      participants: 420,
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300&h=300&fit=crop&crop=center',
    },
  ];

  const handleCategoryPress = (category) => {
    setSelectedCategory(category.name);
  };

  const handleEventPress = (event) => {
    // Navigation vers les détails de l'événement
    console.log('Événement sélectionné:', event.title);
  };

  const handleSearch = () => {
    console.log('Recherche:', searchText);
  };

  const renderCategoryButton = (category) => {
    const isSelected = selectedCategory === category.name;
    
    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryButton,
          isSelected && styles.selectedCategoryButton,
        ]}
        onPress={() => handleCategoryPress(category)}
      >
        {isSelected ? (
          <LinearGradient
            colors={['#FFD700', '#FFA500', '#FF8C00']}
            style={styles.categoryGradient}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={styles.selectedCategoryText}>{category.name}</Text>
          </LinearGradient>
        ) : (
          <BlurView blurAmount={20} blurType="light" style={styles.categoryBlur}>
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={styles.categoryText}>{category.name}</Text>
          </BlurView>
        )}
      </TouchableOpacity>
    );
  };

  const renderEventCard = (event) => {
    return (
      <TouchableOpacity
        key={event.id}
        style={styles.eventCard}
        onPress={() => handleEventPress(event)}
      >
        <Image source={{ uri: event.image }} style={styles.eventImage} />
        <View style={styles.eventContent}>
          <Text style={styles.eventTitle}>{event.title}</Text>
          <View style={styles.eventInfo}>
            <Text style={styles.eventDate}>{event.date}</Text>
            <Text style={styles.eventLocation}>{event.location}</Text>
          </View>
          <View style={styles.eventFooter}>
            <Text style={styles.eventPrice}>{event.price}</Text>
            <View style={styles.eventStats}>
              <Text style={styles.eventParticipants}>{event.participants} participants</Text>
              <View style={styles.ratingContainer}>
                <Feather name="star" size={14} color="#FFD700" />
                <Text style={styles.eventRating}>{event.rating}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient de fond */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#87CEEB']}
        style={styles.backgroundGradient}
      />

      {/* Header fixe */}
      <BlurView blurAmount={80} blurType="light" style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>EvenJerr</Text>
        
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={24} color="white" />
        </TouchableOpacity>
      </BlurView>

      {/* Contenu scrollable */}
      <ScrollView
        style={styles.scrollContent}
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Barre de recherche */}
        <BlurView blurAmount={20} blurType="light" style={styles.searchContainer}>
          <Feather name="search" size={20} color="white" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Que faire près de..."
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <LinearGradient
              colors={['#FFD700', '#FFA500']}
              style={styles.searchButtonGradient}
            >
              <Text style={styles.searchButtonText}>Chercher</Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>

        {/* Catégories scrollables */}
        <View style={styles.categoriesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map(renderCategoryButton)}
          </ScrollView>
        </View>

        {/* Carte géographique placeholder */}
        <View style={styles.mapSection}>
          <Text style={styles.sectionTitle}>Événements près de vous</Text>
          <BlurView blurAmount={20} blurType="light" style={styles.mapPlaceholder}>
            <MaterialCommunityIcons name="map" size={60} color="rgba(255, 255, 255, 0.6)" />
            <Text style={styles.mapPlaceholderText}>Carte interactive</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              Intégration react-native-maps à venir
            </Text>
          </BlurView>
        </View>

        {/* Événements tendances */}
        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Événements tendances</Text>
          <View style={styles.eventsGrid}>
            {trendingEvents.map(renderEventCard)}
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <LinearGradient
          colors={['#FFD700', '#FFA500', '#FF8C00']}
          style={styles.fabGradient}
        >
          <Feather name="plus" size={24} color="white" />
        </LinearGradient>
      </TouchableOpacity>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  backButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(255, 255, 255, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  filterButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 5,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: Platform.OS === 'ios' ? 120 : 100, // Espace pour TabNavigator
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  searchButton: {
    marginLeft: 12,
  },
  searchButtonGradient: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  searchButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  categoryButton: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  selectedCategoryButton: {
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  categoryGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  categoryBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  selectedCategoryText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  categoryText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  mapSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mapPlaceholder: {
    height: 200,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  eventsSection: {
    marginHorizontal: 20,
  },
  eventsGrid: {
    gap: 16,
  },
  eventCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: 'rgba(0, 0, 0, 0.3)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  eventImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  eventContent: {
    padding: 16,
  },
  eventTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  eventInfo: {
    marginBottom: 12,
  },
  eventDate: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  eventLocation: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  eventFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  eventPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  eventStats: {
    alignItems: 'flex-end',
  },
  eventParticipants: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventRating: {
    fontSize: 14,
    color: 'white',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  fab: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 120 : 100, // Au-dessus du TabNavigator
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default EvenJerrScreen;