import React, { useEffect, useRef, memo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  Dimensions,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  loadBestSellers,
  loadNewCourses,
  loadRecommended,
  selectBestSellers,
  selectNewCourses,
  selectRecommended,
  selectCoursesStatus,
} from '../redux/coursesSlice';
import {
  setQuery,
  clearQuery,
  searchCourses,
  selectSearchQuery,
  selectSearchResults,
} from '../redux/searchSlice';
import { teachJerrStyles } from '../styles/teachjerr.styles';
import { formatJerr, applyPromo } from '../utils/price';
import { theme } from '../utils/theme';

const { width: screenWidth } = Dimensions.get('window');
const isTablet = screenWidth > 768;

// Composant CourseCard séparé pour respecter les règles des hooks
const CourseCard = memo(({ item, index, horizontal = false }) => {
  
  const pricing = applyPromo(item.basePriceJerr, item.promoPriceJerr);
  
  return (
    <View
      style={[
        horizontal ? teachJerrStyles.horizontalCard : teachJerrStyles.gridCard,
        {
          marginLeft: horizontal && index === 0 ? 20 : 0,
          marginRight: horizontal ? 15 : 0,
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        style={teachJerrStyles.cardTouchable}
      >
        <View style={teachJerrStyles.cardImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={teachJerrStyles.cardImage}
            accessibilityLabel={`Image du cours ${item.title}`}
          />
          {item.isBestSeller && (
            <View style={[teachJerrStyles.badge, teachJerrStyles.bestSellerBadge]}>
              <Text style={teachJerrStyles.badgeText}>📈 Best-Seller</Text>
            </View>
          )}
          {item.isNew && (
            <View style={[teachJerrStyles.badge, teachJerrStyles.newBadge]}>
              <Text style={teachJerrStyles.badgeText}>✨ Nouveau</Text>
            </View>
          )}
        </View>
        
        <View style={teachJerrStyles.cardContent}>
          <Text style={teachJerrStyles.cardTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={teachJerrStyles.cardTeacher} numberOfLines={1}>
            {item.teacher}
          </Text>
          
          <View style={teachJerrStyles.cardRating}>
            <View style={teachJerrStyles.starsContainer}>
              {[...Array(5)].map((_, i) => (
                <Text
                  key={i}
                  style={[
                    teachJerrStyles.star,
                    { opacity: i < Math.floor(item.rating) ? 1 : 0.3 },
                  ]}
                >
                  ⭐
                </Text>
              ))}
            </View>
            <Text style={teachJerrStyles.reviewsCount}>
              ({item.reviewsCount})
            </Text>
          </View>
          
          <View style={teachJerrStyles.cardMeta}>
            <Text style={teachJerrStyles.duration}>{item.duration}</Text>
            <Text style={teachJerrStyles.level}>{item.level}</Text>
          </View>
          
          <View style={teachJerrStyles.priceRow}>
            {pricing.original !== pricing.final && (
              <Text style={teachJerrStyles.originalPrice}>
                {formatJerr(pricing.original)}
              </Text>
            )}
            <Text style={teachJerrStyles.finalPrice}>
              {formatJerr(pricing.final)}
            </Text>
          </View>
          
          <Text style={teachJerrStyles.studentsCount}>
            {item.studentsCount} étudiants
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
});

const TeachJerrScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();
  
  // Redux state
  const bestSellers = useSelector(selectBestSellers);
  const newCourses = useSelector(selectNewCourses);
  const recommended = useSelector(selectRecommended);
  const coursesStatus = useSelector(selectCoursesStatus);
  const searchQuery = useSelector(selectSearchQuery);
  const searchResults = useSelector(selectSearchResults);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  
  useEffect(() => {
    // Load data on mount
    if (coursesStatus === 'idle') {
      dispatch(loadBestSellers());
      dispatch(loadNewCourses());
      dispatch(loadRecommended());
    }
    
    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [dispatch, coursesStatus]);
  
  const handleSearch = (text) => {
    dispatch(setQuery(text));
    if (text.length > 2) {
      dispatch(searchCourses(text));
    }
  };
  

  
  const renderCourseCard = ({ item, index, horizontal = false }) => {
    if (!item) return <View style={{ width: horizontal ? 280 : '48%', height: horizontal ? 200 : 180 }} />;
    
    return (
      <CourseCard 
        item={item} 
        index={index} 
        horizontal={horizontal}
      />
    );
  };
  
  const renderSection = (title, emoji, data, horizontal = false) => {
    const hasData = data && data.length > 0;
    
    return (
      <Animated.View
        style={[
          teachJerrStyles.section,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
            display: hasData ? 'flex' : 'none',
          },
        ]}
      >
        <View style={teachJerrStyles.sectionHeader}>
          <Text style={teachJerrStyles.sectionTitle}>
            {emoji} {title}
          </Text>
        </View>
        
        {horizontal ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={teachJerrStyles.horizontalList}
          >
            {Array.from({ length: Math.max(5, (data || []).length) }, (_, index) => {
              const item = (data || [])[index];
              return (
                <View key={item?.id || `horizontal-empty-${index}`} style={{ opacity: item ? 1 : 0 }}>
                  {renderCourseCard({ item, index, horizontal: true })}
                </View>
              );
            })}
          </ScrollView>
        ) : (
          <View style={[teachJerrStyles.grid, { paddingHorizontal: 20 }]}>
            {Array.from({ length: Math.max(6, (data || []).length) }, (_, index) => {
              const item = (data || [])[index];
              return (
                <View key={item?.id || `empty-${index}`} style={[teachJerrStyles.gridItem, { opacity: item ? 1 : 0 }]}>
                  {renderCourseCard({ item, index, horizontal: false })}
                </View>
              );
            })}
          </View>
        )}
      </Animated.View>
    );
  };
  
  return (
    <View style={teachJerrStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background Gradient */}
      <LinearGradient
        colors={[theme.colors.bgStart, theme.colors.bgMid, theme.colors.bgEnd]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={teachJerrStyles.backgroundGradient}
      />
      
      {/* Fixed Header */}
      <Animated.View
        style={[
          teachJerrStyles.header,
          {
            paddingTop: insets.top,
            opacity: fadeAnim,
          },
        ]}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={teachJerrStyles.headerGradient}
        />
        <View style={teachJerrStyles.headerContent}>
          <TouchableOpacity
            style={teachJerrStyles.headerButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
          
          <Text style={teachJerrStyles.headerTitle}>Découvrir</Text>
          
          <View style={teachJerrStyles.headerActions}>
            <TouchableOpacity style={teachJerrStyles.headerButton}>
              <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
            <TouchableOpacity style={teachJerrStyles.headerButton}>
              <Ionicons name="bookmark-outline" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
      
      <ScrollView
        style={teachJerrStyles.scrollView}
        contentContainerStyle={[
          teachJerrStyles.scrollContent,
          { paddingTop: 100 + insets.top },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Search Bar */}
        <Animated.View
          style={[
            teachJerrStyles.searchSection,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <View style={teachJerrStyles.searchContainer}>
            <LinearGradient
              colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
              style={teachJerrStyles.searchGradient}
            />
            <Ionicons
              name="search"
              size={20}
              color={theme.colors.textSecondary}
              style={teachJerrStyles.searchIcon}
            />
            <TextInput
              style={teachJerrStyles.searchInput}
              placeholder="Rechercher un cours, un instructeur…"
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={handleSearch}
            />
          </View>
        </Animated.View>
        
        {/* Promotional Banner */}
        <Animated.View
          style={[
            teachJerrStyles.promoBanner,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <LinearGradient
            colors={[theme.colors.gold, theme.colors.bgEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={teachJerrStyles.promoBannerGradient}
          >
            <View style={teachJerrStyles.promoBannerContent}>
              <Text style={teachJerrStyles.promoBannerEmoji}>🎉</Text>
              <Text style={teachJerrStyles.promoBannerTitle}>
                Offre spéciale de lancement !
              </Text>
              <Text style={teachJerrStyles.promoBannerSubtitle}>
                Jusqu'à -50% sur une sélection de cours premium
              </Text>
              <TouchableOpacity style={teachJerrStyles.promoCta}>
                <Text style={teachJerrStyles.promoCtaText}>Découvrir</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </Animated.View>
        
        {/* Search Results */}
        <Animated.View
          style={[
            teachJerrStyles.searchResults,
            { 
              opacity: fadeAnim,
              display: searchQuery.length > 2 && searchResults.length > 0 ? 'flex' : 'none'
            },
          ]}
        >
          <Text style={teachJerrStyles.searchResultsTitle}>
            🔍 Résultats pour "{searchQuery}"
          </Text>
          <View style={[teachJerrStyles.grid, { paddingHorizontal: 20 }]}>
             {Array.from({ length: 6 }, (_, index) => {
               const item = searchResults[index];
               return (
                 <View key={item?.id || `search-empty-${index}`} style={[teachJerrStyles.gridItem, { opacity: item ? 1 : 0 }]}>
                   {renderCourseCard({ item, index, horizontal: false })}
                 </View>
               );
             })}
           </View>
        </Animated.View>
        
        {/* Sections */}
        <View style={{ display: searchQuery.length <= 2 ? 'flex' : 'none' }}>
          {renderSection('Cours Best-Seller', '📈', bestSellers, true)}
          {renderSection('Nouveautés', '✨', newCourses, false)}
          {renderSection('Recommandé pour vous', '🎯', recommended, false)}
        </View>
        
        {/* Bottom Spacer */}
        <View style={teachJerrStyles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

export default TeachJerrScreen;