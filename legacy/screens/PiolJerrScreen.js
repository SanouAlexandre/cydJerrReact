import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  StatusBar,
  Dimensions,
  SafeAreaView,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PiolJerrScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedDates, setSelectedDates] = useState('Dates');
  const [selectedGuests, setSelectedGuests] = useState('Invités');

  const trendingDestinations = [
    {
      id: 1,
      name: 'Paris',
      price: '€89/nuit',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 2,
      name: 'Tokyo',
      price: '€125/nuit',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 3,
      name: 'New York',
      price: '€156/nuit',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=300&h=200&fit=crop&crop=center'
    },
    {
      id: 4,
      name: 'Bali',
      price: '€67/nuit',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=300&h=200&fit=crop&crop=center'
    }
  ];

  const uniqueExperiences = [
    {
      id: 1,
      title: 'Cours de cuisine locale',
      host: 'Marie',
      rating: 4.9,
      duration: '3h',
      price: '€45',
      image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&h=150&fit=crop&crop=center'
    },
    {
      id: 2,
      title: 'Visite guidée privée',
      host: 'Jean',
      rating: 4.8,
      duration: '2h',
      price: '€35',
      image: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=200&h=150&fit=crop&crop=center'
    },
    {
      id: 3,
      title: 'Atelier artisanal',
      host: 'Sophie',
      rating: 4.7,
      duration: '4h',
      price: '€60',
      image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=200&h=150&fit=crop&crop=center'
    },
    {
      id: 4,
      title: 'Randonnée nature',
      host: 'Paul',
      rating: 4.9,
      duration: '6h',
      price: '€25',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=200&h=150&fit=crop&crop=center'
    }
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={i} name="star" size={12} color="#FFD700" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={12} color="#FFD700" />
      );
    }

    return stars;
  };

  const renderDestinationCard = (destination) => (
    <TouchableOpacity key={destination.id} style={styles.destinationCard} activeOpacity={0.8}>
      <Image source={{ uri: destination.image }} style={styles.destinationImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.7)']}
        style={styles.destinationOverlay}
      >
        <View style={styles.destinationInfo}>
          <Text style={styles.destinationName}>{destination.name}</Text>
          <View style={styles.destinationMeta}>
            <View style={styles.ratingContainer}>
              {renderStars(destination.rating)}
              <Text style={styles.ratingText}>{destination.rating}</Text>
            </View>
            <Text style={styles.destinationPrice}>{destination.price}</Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderExperienceCard = (experience) => (
    <TouchableOpacity key={experience.id} style={styles.experienceCard} activeOpacity={0.8}>
      <Image source={{ uri: experience.image }} style={styles.experienceImage} />
      <View style={styles.experienceInfo}>
        <Text style={styles.experienceTitle} numberOfLines={2}>{experience.title}</Text>
        <Text style={styles.experienceHost}>Avec {experience.host}</Text>
        <View style={styles.experienceMeta}>
          <View style={styles.ratingContainer}>
            {renderStars(experience.rating)}
            <Text style={styles.ratingText}>{experience.rating}</Text>
          </View>
          <Text style={styles.experienceDuration}>{experience.duration}</Text>
        </View>
        <Text style={styles.experiencePrice}>{experience.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#1a237e', '#3949ab', '#5c6bc0', '#7986cb']}
        style={styles.gradientBackground}
      >
        {/* Header */}
        <BlurView blurAmount={30} blurType="light" style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            
            <Text style={styles.headerTitle}>PiolJerr</Text>
            
            <TouchableOpacity style={styles.filterButton}>
              <Ionicons name="filter" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </BlurView>

        <ScrollView 
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <LinearGradient
              colors={['#7b1fa2', '#3f51b5']}
              style={styles.heroGradient}
            >
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>Trouvez votre lieu idéal</Text>
                <Text style={styles.heroSubtitle}>Hébergements uniques et expériences authentiques</Text>
              </View>
            </LinearGradient>
          </View>

          {/* Search Bar */}
          <BlurView blurAmount={20} blurType="light" style={styles.searchContainer}>
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#FFFFFF" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Où allez-vous ?"
                placeholderTextColor="rgba(255,255,255,0.7)"
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            
            <View style={styles.filtersRow}>
              <TouchableOpacity style={styles.filterItem}>
                <Ionicons name="calendar-outline" size={18} color="#FFFFFF" />
                <Text style={styles.filterText}>{selectedDates}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.filterItem}>
                <Ionicons name="people-outline" size={18} color="#FFFFFF" />
                <Text style={styles.filterText}>{selectedGuests}</Text>
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity style={styles.exploreButton} activeOpacity={0.8}>
              <LinearGradient
                colors={['#FFD700', '#FFA500']}
                style={styles.exploreGradient}
              >
                <Text style={styles.exploreText}>Explorer les logements</Text>
              </LinearGradient>
            </TouchableOpacity>
          </BlurView>

          {/* Trending Destinations */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Destinations tendances</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destinationsContainer}
            >
              {trendingDestinations.map(renderDestinationCard)}
            </ScrollView>
          </View>

          {/* Unique Experiences */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Expériences uniques</Text>
            <View style={styles.experiencesGrid}>
              {uniqueExperiences.map(renderExperienceCard)}
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.quickActionsGrid}>
              <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
                <BlurView blurAmount={20} blurType="light" style={styles.quickActionBlur}>
                  <Ionicons name="calendar" size={32} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Mes voyages</Text>
                </BlurView>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionCard} activeOpacity={0.8}>
                <BlurView blurAmount={20} blurType="light" style={styles.quickActionBlur}>
                  <Ionicons name="heart" size={32} color="#FFFFFF" />
                  <Text style={styles.quickActionText}>Devenir hôte</Text>
                </BlurView>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <TouchableOpacity style={styles.fab} activeOpacity={0.8}>
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.fabGradient}
          >
            <Ionicons name="card" size={28} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(255, 215, 0, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    height: 200,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    overflow: 'hidden',
  },
  heroGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  searchContainer: {
    margin: 16,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    flex: 0.48,
  },
  filterText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    marginLeft: 8,
  },
  exploreButton: {
    borderRadius: 15,
    overflow: 'hidden',
  },
  exploreGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  exploreText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  destinationsContainer: {
    paddingRight: 16,
  },
  destinationCard: {
    width: 200,
    height: 150,
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 12,
  },
  destinationImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  destinationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    justifyContent: 'flex-end',
    padding: 12,
  },
  destinationInfo: {
    alignItems: 'flex-start',
  },
  destinationName: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  destinationMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    marginLeft: 4,
  },
  destinationPrice: {
    color: '#FFD700',
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
  },
  experiencesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  experienceCard: {
    width: (width - 48) / 2,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  experienceImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  experienceInfo: {
    padding: 12,
  },
  experienceTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  experienceHost: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  experienceMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  experienceDuration: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  experiencePrice: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    flex: 0.48,
    height: 120,
    borderRadius: 15,
    overflow: 'hidden',
  },
  quickActionBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  quickActionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginTop: 8,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PiolJerrScreen;