import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  SafeAreaView,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const DoctoJerrScreen = ({ navigation }) => {
  const [searchDoctor, setSearchDoctor] = useState('');
  const [location, setLocation] = useState('');

  // Données simulées pour les spécialités
  const specialties = [
    { id: 1, name: 'Généraliste', icon: 'stethoscope', count: 156 },
    { id: 2, name: 'Cardiologue', icon: 'heart-pulse', count: 42 },
    { id: 3, name: 'Dermatologue', icon: 'face-woman', count: 38 },
    { id: 4, name: 'Pédiatre', icon: 'baby-face', count: 67 },
    { id: 5, name: 'Dentiste', icon: 'tooth', count: 89 },
    { id: 6, name: 'Ophtalmologue', icon: 'eye', count: 23 },
  ];

  // Données simulées pour les médecins
  const doctors = [
    {
      id: 1,
      name: 'Dr. Aminata Traoré',
      specialty: 'Généraliste',
      distance: '0.8 km',
      rating: 4.8,
      nextAvailable: 'Aujourd\'hui 14h30',
      price: 2500, // en Jerr
      photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Dr. Mamadou Diallo',
      specialty: 'Cardiologue',
      distance: '1.2 km',
      rating: 4.9,
      nextAvailable: 'Demain 9h00',
      price: 4500,
      photo: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Dr. Fatoumata Keita',
      specialty: 'Pédiatre',
      distance: '2.1 km',
      rating: 4.7,
      nextAvailable: 'Aujourd\'hui 16h15',
      price: 3200,
      photo: 'https://images.unsplash.com/photo-1594824804732-ca8db7536543?w=100&h=100&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Dr. Ibrahim Sangaré',
      specialty: 'Dermatologue',
      distance: '1.7 km',
      rating: 4.6,
      nextAvailable: 'Demain 11h30',
      price: 3800,
      photo: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=100&h=100&fit=crop&crop=face'
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <MaterialCommunityIcons
          key={i}
          name="star"
          size={12}
          color="#FFD700"
        />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <MaterialCommunityIcons
          key="half"
          name="star-half-full"
          size={12}
          color="#FFD700"
        />
      );
    }

    return stars;
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a1a2e', '#16213e', '#0f3460']}
        style={styles.gradient}
      >
        {/* Header fixe */}
        <BlurView blurAmount={20} blurType="light" style={styles.header}>
          <View style={styles.headerContent}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>DoctoJerr</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerAction}>
                <MaterialCommunityIcons name="cog" size={20} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerAction}>
                <MaterialCommunityIcons name="account-circle" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Section Héros */}
          <View style={styles.heroSection}>
            <Text style={styles.heroTitle}>Trouvez votre médecin</Text>
            
            {/* Champs de recherche */}
            <View style={styles.searchContainer}>
              <BlurView blurAmount={15} blurType="light" style={styles.searchField}>
                <MaterialCommunityIcons name="magnify" size={20} color="rgba(255,255,255,0.7)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher un médecin"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={searchDoctor}
                  onChangeText={setSearchDoctor}
                />
              </BlurView>
              
              <BlurView blurAmount={15} blurType="light" style={styles.searchField}>
                <MaterialCommunityIcons name="map-marker" size={20} color="rgba(255,255,255,0.7)" />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Localisation"
                  placeholderTextColor="rgba(255,255,255,0.5)"
                  value={location}
                  onChangeText={setLocation}
                />
              </BlurView>
            </View>

            {/* Boutons d'action rapide */}
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialCommunityIcons name="calendar-today" size={20} color="white" />
                <Text style={styles.quickActionText}>Aujourd'hui</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.quickActionButton}>
                <MaterialCommunityIcons name="video" size={20} color="white" />
                <Text style={styles.quickActionText}>Téléconsultation</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Spécialités populaires */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Spécialités populaires</Text>
            <View style={styles.specialtiesGrid}>
              {specialties.map((specialty) => (
                <TouchableOpacity
                  key={specialty.id}
                  style={styles.specialtyCard}
                  activeOpacity={0.8}
                >
                  <BlurView blurAmount={10} blurType="light" style={styles.specialtyCardContent}>
                    <MaterialCommunityIcons
                      name={specialty.icon}
                      size={32}
                      color="#4FC3F7"
                      style={styles.specialtyIcon}
                    />
                    <Text style={styles.specialtyName}>{specialty.name}</Text>
                    <Text style={styles.specialtyCount}>{specialty.count} médecins</Text>
                  </BlurView>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Médecins à proximité */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Médecins à proximité</Text>
            {doctors.map((doctor) => (
              <TouchableOpacity
                key={doctor.id}
                style={styles.doctorCard}
                activeOpacity={0.8}
              >
                <BlurView blurAmount={10} blurType="light" style={styles.doctorCardContent}>
                  <View style={styles.doctorPhotoContainer}>
                    <Image source={{ uri: doctor.photo }} style={styles.doctorPhoto} />
                  </View>
                  
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{doctor.name}</Text>
                    <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                    <View style={styles.doctorMeta}>
                      <Text style={styles.doctorDistance}>{doctor.distance}</Text>
                      <View style={styles.ratingContainer}>
                        {renderStars(doctor.rating)}
                        <Text style={styles.ratingText}>{doctor.rating}</Text>
                      </View>
                    </View>
                  </View>
                  
                  <View style={styles.doctorRight}>
                    <View style={styles.availabilityContainer}>
                      <Text style={styles.availabilityText}>{doctor.nextAvailable}</Text>
                    </View>
                    <Text style={styles.priceText}>{doctor.price.toLocaleString()} Jerr</Text>
                  </View>
                </BlurView>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Boutons flottants */}
        <View style={styles.floatingButtons}>
          <TouchableOpacity style={styles.floatingButton}>
            <BlurView blurAmount={20} blurType="light" style={styles.floatingButtonContent}>
              <MaterialCommunityIcons name="calendar-clock" size={24} color="white" />
              <Text style={styles.floatingButtonText}>Mes rendez-vous</Text>
            </BlurView>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.floatingButton}>
            <BlurView blurAmount={20} blurType="light" style={styles.floatingButtonContent}>
              <MaterialCommunityIcons name="wallet" size={24} color="white" />
              <Text style={styles.floatingButtonText}>Portefeuille santé</Text>
            </BlurView>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  header: {
    height: 60,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  headerContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAction: {
    marginLeft: 12,
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  heroSection: {
    padding: 20,
    paddingTop: 30,
  },
  heroTitle: {
    fontFamily: 'Poppins-Bold',
    fontSize: 24,
    color: 'white',
    marginBottom: 24,
    textAlign: 'center',
  },
  searchContainer: {
    marginBottom: 24,
  },
  searchField: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontFamily: 'Poppins-Regular',
    fontSize: 16,
    color: 'white',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    shadowColor: 'rgba(255,255,255,0.2)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  quickActionText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'white',
    marginLeft: 8,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: 'white',
    marginBottom: 16,
  },
  specialtiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specialtyCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  specialtyCardContent: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  specialtyIcon: {
    marginBottom: 8,
  },
  specialtyName: {
    fontFamily: 'Poppins-Medium',
    fontSize: 14,
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  specialtyCount: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    textAlign: 'center',
  },
  doctorCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  doctorCardContent: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
  },
  doctorPhotoContainer: {
    marginRight: 16,
  },
  doctorPhoto: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontFamily: 'Poppins-Bold',
    fontSize: 16,
    color: 'white',
    marginBottom: 4,
  },
  doctorSpecialty: {
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 6,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  doctorDistance: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontFamily: 'Poppins-Regular',
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    marginLeft: 4,
  },
  doctorRight: {
    alignItems: 'flex-end',
  },
  availabilityContainer: {
    backgroundColor: 'rgba(76, 175, 80, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.4)',
  },
  availabilityText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: '#4CAF50',
  },
  priceText: {
    fontFamily: 'Poppins-Bold',
    fontSize: 14,
    color: '#FFD700',
  },
  floatingButtons: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  floatingButton: {
    flex: 1,
    marginHorizontal: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  floatingButtonContent: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    borderRadius: 16,
  },
  floatingButtonText: {
    fontFamily: 'Poppins-Medium',
    fontSize: 12,
    color: 'white',
    marginTop: 4,
    textAlign: 'center',
  },
});

export default DoctoJerrScreen;