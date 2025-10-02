import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { clearJustRegistered } from '../redux/userSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    icon: 'rocket',
    title: 'Bienvenue dans JerrVerse',
    description: 'Découvrez un écosystème complet où chaque univers vous offre des services innovants et connectés.',
    gradient: ['#667eea', '#764ba2'],
  },
  {
    id: 2,
    icon: 'earth',
    title: 'Explorez les Univers',
    description: 'De CydJerr à LeaseJerr, naviguez entre les différents mondes et trouvez exactement ce dont vous avez besoin.',
    gradient: ['#f093fb', '#f5576c'],
  },
  {
    id: 3,
    icon: 'star',
    title: 'Commencez votre Aventure',
    description: 'Rejoignez la communauté JerrVerse et profitez d\'une expérience unique et personnalisée.',
    gradient: ['#4facfe', '#00f2fe'],
  },
];

const OnboardingScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const fontsLoaded = true;

  const goToNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleGetStarted = () => {
    // Réinitialiser justRegistered pour s'assurer qu'on va vers Login
    dispatch(clearJustRegistered());
    // Navigation directe vers l'écran de connexion
    navigation.navigate('Login');
  };

  const renderSlide = (item, index) => {
    return (
      <View
        style={[
          styles.slide,
          {
            opacity: index === currentIndex ? 1 : 0.8,
          },
        ]}
      >
        <LinearGradient
          colors={item.gradient}
          style={styles.slideGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <BlurView blurAmount={10} blurType="light" style={styles.slideBlur}>
            <View style={styles.slideContent}>
              {/* Illustration Icon */}
              <View style={styles.iconContainer}>
                <BlurView blurAmount={20} blurType="light" style={styles.iconBlur}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={80}
                    color="#FFFFFF"
                  />
                </BlurView>
              </View>

              {/* Title */}
              <Text style={styles.slideTitle}>{item.title}</Text>

              {/* Description */}
              <Text style={styles.slideDescription}>{item.description}</Text>

              {/* Get Started Button (only on last slide) */}
              {index === onboardingData.length - 1 && (
                <TouchableOpacity
                  style={styles.getStartedButton}
                  onPress={handleGetStarted}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={['#FFDE59', '#FFD700']}
                    style={styles.getStartedGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text style={styles.getStartedText}>Commencer</Text>
                    <Feather name="arrow-right" size={20} color="#000000" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </View>
          </BlurView>
        </LinearGradient>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.paginationContainer}>
        {onboardingData.map((_, index) => {
          return (
            <View
              key={index}
              style={[
                styles.paginationDot,
                {
                  width: index === currentIndex ? 24 : 8,
                  backgroundColor: index === currentIndex ? '#FFDE59' : '#FFFFFF60',
                  opacity: index === currentIndex ? 1 : 0.3,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  // Fonts loading check removed temporarily

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

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={handleGetStarted}
        activeOpacity={0.7}
      >
        <BlurView blurAmount={15} blurType="light" style={styles.skipButtonBlur}>
          <Text style={styles.skipButtonText}>Passer</Text>
        </BlurView>
      </TouchableOpacity>

      {/* Current Slide */}
      {onboardingData[currentIndex] && renderSlide(onboardingData[currentIndex], currentIndex)}

      {/* Pagination */}
      {renderPagination()}

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <TouchableOpacity
          style={[styles.navButton, styles.prevButton]}
          onPress={goToPrevious}
          activeOpacity={0.7}
        >
          <BlurView blurAmount={20} blurType="light" style={styles.navButtonBlur}>
            <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }}>‹</Text>
          </BlurView>
        </TouchableOpacity>
      )}

      {currentIndex < onboardingData.length - 1 && (
        <TouchableOpacity
          style={[styles.navButton, styles.nextButton]}
          onPress={goToNext}
          activeOpacity={0.7}
        >
          <BlurView blurAmount={20} blurType="light" style={styles.navButtonBlur}>
            <Text style={{ fontSize: 24, color: '#FFFFFF', fontWeight: 'bold' }}>›</Text>
          </BlurView>
        </TouchableOpacity>
      )}
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
  skipButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    right: 20,
    zIndex: 1000,
    borderRadius: 20,
    overflow: 'hidden',
  },
  skipButtonBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  skipButtonText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  slidesContainer: {
    flex: 1,
    flexDirection: 'row',
    width: screenWidth * onboardingData.length,
  },
  slideWrapper: {
    width: screenWidth,
    flex: 1,
  },
  slide: {
    flex: 1,
    margin: 20,
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  slideGradient: {
    flex: 1,
  },
  slideBlur: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  slideContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    marginBottom: 40,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 8,
  },
  iconBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  slideDescription: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
    fontWeight: '400',
    paddingHorizontal: 10,
  },
  getStartedButton: {
    borderRadius: 25,
    overflow: 'hidden',
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  getStartedGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  getStartedText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 10,
  },
  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 30,
    paddingBottom: Platform.OS === 'ios' ? 50 : 30,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  navButton: {
    position: 'absolute',
    top: '50%',
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    marginTop: -25,
  },
  prevButton: {
    left: 20,
  },
  nextButton: {
    right: 20,
  },
  navButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

export default OnboardingScreen;