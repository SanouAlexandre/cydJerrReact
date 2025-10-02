import React, { useState, useRef } from 'react';
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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import {
  setSearchQuery,
  setActiveCategory,
  installApp,
  uninstallApp
} from '../redux/appjerrSlice';
import { formatJerr } from '../utils/price';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const AppJerrScreen = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const {
    categories,
    searchQuery,
    featuredApp,
    secondaryApps,
    allApps,
    installedApps
  } = useSelector(state => state.appjerr);
  
  const [scaleAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef(null);
  const categoriesScrollRef = useRef(null);

  const activeCategory = categories.find(cat => cat.active);
  
  // Filtrer les apps selon la catégorie et la recherche
  const getFilteredApps = () => {
    let apps = [...allApps];
    
    if (activeCategory?.name !== 'Tous') {
      apps = apps.filter(app => app.category === activeCategory.name);
    }
    
    if (searchQuery.trim()) {
      apps = apps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.developer.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return apps;
  };

  const handleInstallPress = (appId) => {
    const isInstalled = installedApps.includes(appId);
    
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    
    if (isInstalled) {
      dispatch(uninstallApp(appId));
    } else {
      dispatch(installApp(appId));
    }
  };

  const handleCategoryPress = (categoryId) => {
    dispatch(setActiveCategory(categoryId));
  };

  const AppJerrStoreHeader = () => (
    <View style={styles.header}>
      <View style={styles.headerContent}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>AppJerr Store</Text>
        
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>
    </View>
  );

  const SearchBar = () => (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une app..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={(text) => dispatch(setSearchQuery(text))}
        />
      </View>
    </View>
  );

  const StudioButton = () => (
    <TouchableOpacity style={styles.studioButton}>
      <LinearGradient
        colors={['#667EEA', '#764BA2']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.studioGradient}
      >
        <MaterialCommunityIcons name="code-tags" size={20} color="white" />
        <Text style={styles.studioText}>Studio AppJerr</Text>
        <Ionicons name="arrow-forward" size={16} color="white" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const CategoriesSection = () => (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Catégories</Text>
      <ScrollView 
        ref={categoriesScrollRef}
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesScroll}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryButton,
              category.active && styles.activeCategoryButton
            ]}
            onPress={() => handleCategoryPress(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text style={[
              styles.categoryText,
              category.active && styles.activeCategoryText
            ]}>
              {category.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const FeaturedAppCard = ({ app }) => (
    <View style={styles.featuredCard}>
      <BlurView blurAmount={10} blurType="light" style={styles.featuredBlur}>
        <View style={styles.featuredContent}>
          <View style={styles.featuredLeft}>
            <View style={styles.appIconLarge}>
              <Text style={styles.appIconTextLarge}>{app.icon}</Text>
            </View>
            <View style={styles.featuredInfo}>
              <Text style={styles.featuredAppName}>{app.name}</Text>
              <Text style={styles.featuredDeveloper}>{app.developer}</Text>
              <View style={styles.featuredMetrics}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{app.rating}</Text>
                </View>
                <Text style={styles.downloadsText}>{app.downloads} téléchargements</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.installButtonLarge}
            onPress={() => handleInstallPress(app.id)}
          >
            <LinearGradient
              colors={['#667EEA', '#764BA2']}
              style={styles.installGradient}
            >
              <Text style={styles.installButtonText}>
                {installedApps.includes(app.id) ? 'Installé' : app.price === 0 ? 'Installer' : formatJerr(app.price)}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  const SecondaryAppCard = ({ app }) => (
    <View style={styles.secondaryCard}>
      <BlurView blurAmount={8} blurType="light" style={styles.secondaryBlur}>
        <View style={styles.secondaryContent}>
          <View style={styles.appIcon}>
            <Text style={styles.appIconText}>{app.icon}</Text>
          </View>
          <View style={styles.secondaryInfo}>
            <Text style={styles.secondaryAppName}>{app.name}</Text>
            <Text style={styles.secondaryDeveloper}>{app.developer}</Text>
            <View style={styles.secondaryMetrics}>
              <Ionicons name="star" size={12} color="#FFD700" />
              <Text style={styles.secondaryRating}>{app.rating}</Text>
            </View>
          </View>
          <TouchableOpacity 
            style={styles.installButtonSmall}
            onPress={() => handleInstallPress(app.id)}
          >
            <Text style={styles.installButtonSmallText}>
              {installedApps.includes(app.id) ? '✓' : 'Installer'}
            </Text>
          </TouchableOpacity>
        </View>
      </BlurView>
    </View>
  );

  const SelectionSection = () => (
    <View style={styles.selectionSection}>
      <View style={styles.selectionHeader}>
        <MaterialCommunityIcons name="trending-up" size={20} color="#10B981" />
        <Text style={styles.selectionTitle}>Sélection AppJerr</Text>
      </View>
      
      <FeaturedAppCard app={featuredApp} />
      
      <View style={styles.secondaryAppsContainer}>
        {secondaryApps.map((app) => (
          <SecondaryAppCard key={app.id} app={app} />
        ))}
      </View>
    </View>
  );

  const AllAppsSection = () => {
    const filteredApps = getFilteredApps();
    const sectionTitle = activeCategory?.name === 'Tous' ? 'Toutes les applications' : activeCategory?.name;
    
    return (
      <View style={styles.allAppsSection}>
        <Text style={styles.sectionTitle}>{sectionTitle}</Text>
        {filteredApps.map((app) => (
          <View key={app.id} style={styles.appListItem}>
            <BlurView blurAmount={8} blurType="light" style={styles.appListBlur}>
              <View style={styles.appListContent}>
                <View style={styles.appIcon}>
                  <Text style={styles.appIconText}>{app.icon}</Text>
                </View>
                <View style={styles.appListInfo}>
                  <Text style={styles.appListName}>{app.name}</Text>
                  <Text style={styles.appListDeveloper}>{app.developer}</Text>
                  <Text style={styles.appListDescription} numberOfLines={2}>
                    {app.description}
                  </Text>
                  <View style={styles.appListMetrics}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={12} color="#FFD700" />
                      <Text style={styles.appListRating}>{app.rating}</Text>
                    </View>
                    <Text style={styles.appListDownloads}>{app.downloads}</Text>
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.installButtonList}
                  onPress={() => handleInstallPress(app.id)}
                >
                  <LinearGradient
                    colors={installedApps.includes(app.id) ? ['#10B981', '#059669'] : ['#3B82F6', '#1D4ED8']}
                    style={styles.installListGradient}
                  >
                    <Text style={styles.installListText}>
                      {installedApps.includes(app.id) ? 'Installé' : app.price === 0 ? 'Installer' : formatJerr(app.price)}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </BlurView>
          </View>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
      
      {/* Arrière-plan avec dégradé et cercles décoratifs */}
      <LinearGradient
        colors={['#F3F4F6', '#F9FAFB', '#DBEAFE']}
        style={styles.backgroundGradient}
      />
      
      {/* Cercles décoratifs flous */}
      <View style={[styles.decorativeCircle, styles.blueCircle]} />
      <View style={[styles.decorativeCircle, styles.greenCircle]} />
      <View style={[styles.decorativeCircle, styles.purpleCircle]} />
      
      {/* Motif de grille */}
      <View style={styles.gridPattern} />
      
      <AppJerrStoreHeader />
      
      <ScrollView 
        ref={scrollViewRef}
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <SearchBar />
        <StudioButton />
        <CategoriesSection />
        <SelectionSection />
        <AllAppsSection />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.1,
  },
  blueCircle: {
    width: 200,
    height: 200,
    backgroundColor: '#3B82F6',
    top: -50,
    right: -50,
  },
  greenCircle: {
    width: 150,
    height: 150,
    backgroundColor: '#10B981',
    bottom: 100,
    left: -30,
  },
  purpleCircle: {
    width: 180,
    height: 180,
    backgroundColor: '#8B5CF6',
    top: '40%',
    right: '30%',
  },
  gridPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.08,
    backgroundColor: 'transparent',
    backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)',
    backgroundSize: '20px 20px',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1A1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  studioButton: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  studioGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
  },
  studioText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginHorizontal: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  categoriesSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
    marginHorizontal: 20,
    marginBottom: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
    textShadowColor: 'rgba(30, 64, 175, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  categoriesScroll: {
    paddingLeft: 20,
  },
  categoriesContainer: {
    paddingRight: 20,
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activeCategoryButton: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  activeCategoryText: {
    color: 'white',
  },
  selectionSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  selectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#065F46',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  featuredCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  featuredBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  featuredContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  featuredLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appIconLarge: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  appIconTextLarge: {
    fontSize: 32,
  },
  featuredInfo: {
    flex: 1,
  },
  featuredAppName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  featuredDeveloper: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  featuredMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  ratingText: {
    fontSize: 14,
    color: '#1A1A1A',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  downloadsText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  installButtonLarge: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  installGradient: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  installButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  secondaryAppsContainer: {
    gap: 12,
  },
  secondaryCard: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  appIconText: {
    fontSize: 24,
  },
  secondaryInfo: {
    flex: 1,
  },
  secondaryAppName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
  secondaryDeveloper: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  secondaryMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondaryRating: {
    fontSize: 12,
    color: '#1A1A1A',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  installButtonSmall: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  installButtonSmallText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  allAppsSection: {
    marginHorizontal: 20,
    marginBottom: 32,
  },
  appListItem: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  appListBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  appListContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  appListInfo: {
    flex: 1,
    marginLeft: 12,
  },
  appListName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 2,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  appListDeveloper: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  appListDescription: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 6,
    lineHeight: 16,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  appListMetrics: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  appListRating: {
    fontSize: 12,
    color: '#1A1A1A',
    marginLeft: 4,
    marginRight: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  },
  appListDownloads: {
    fontSize: 10,
    color: '#6B7280',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  installButtonList: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  installListGradient: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  installListText: {
    fontSize: 12,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  },
});

export default AppJerrScreen;