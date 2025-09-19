import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Feather, MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useFonts } from 'expo-font';

// Import des actions Redux
import {
  fetchFundingHome,
  setSearchQuery,
  clearSearchQuery,
  toggleCategoryFilter,
  toggleLastChanceFilter,
  clearFilters,
  selectFundingStats,
  selectFundingCategories,
  selectVisibleFeatured,
  selectVisibleTrending,
  selectSearchQuery,
  selectFilters,
  selectFundingLoading,
  selectFundingError,
} from '../redux/fundingSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Composant Header glassmorphique
const FundingHeader = ({ searchQuery, onSearchChange, onFiltersPress }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const searchAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(searchAnimation, {
      toValue: searchFocused ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [searchFocused]);

  return (
    <BlurView blurAmount={30} blurType="light" style={styles.header}>
      <View style={styles.headerContent}>
        {/* Titre */}
        <Text style={styles.headerTitle}>FundingJerr</Text>
        
        {/* Boutons d'action */}
        <View style={styles.headerActions}>
          {/* Recherche */}
          <View style={styles.searchContainer}>
            <Animated.View
              style={[
                styles.searchInputContainer,
                {
                  transform: [{
                    scaleX: searchAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0.2, 1],
                    })
                  }]
                },
              ]}
            >
              <TouchableOpacity
                style={styles.searchButton}
                onPress={() => setSearchFocused(!searchFocused)}
              >
                <Feather name="search" size={20} color="white" />
              </TouchableOpacity>
              
              {searchFocused && (
                <TextInput
                  style={styles.searchInput}
                  placeholder="Rechercher des projets..."
                  placeholderTextColor="rgba(255, 255, 255, 0.6)"
                  value={searchQuery}
                  onChangeText={onSearchChange}
                  autoFocus
                  onBlur={() => {
                    if (!searchQuery) {
                      setSearchFocused(false);
                    }
                  }}
                />
              )}
            </Animated.View>
          </View>
          
          {/* Filtres */}
          <TouchableOpacity style={styles.filterButton} onPress={onFiltersPress}>
            <Feather name="filter" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </BlurView>
  );
};

// Composant Hero Stats
const HeroStats = ({ stats, loading }) => {
  const fadeAnim = useRef(new Animated.Value(1)).current;

  // Affichage direct sans condition de chargement
  return (
    <Animated.View style={[styles.heroStats, { opacity: fadeAnim }]}>
      <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
        <Text style={styles.statNumber}>{stats?.totalProjects || '1247'}</Text>
        <Text style={styles.statLabel}>Projets financés</Text>
      </BlurView>
      
      <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
        <Text style={styles.statNumber}>{stats?.totalRaised || '12.4M'}J</Text>
        <Text style={styles.statLabel}>Montant collecté</Text>
      </BlurView>
      
      <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
        <Text style={styles.statNumber}>{stats?.activeContributors?.toLocaleString() || '45,678'}</Text>
        <Text style={styles.statLabel}>Contributeurs actifs</Text>
      </BlurView>
    </Animated.View>
  );
};

// Composant Catégories horizontales
const CategoriesSection = ({ categories, selectedCategories, onCategoryPress, loading }) => {
  // Données par défaut si categories n'est pas disponible
  const defaultCategories = [
    { id: 1, name: 'Technologie', icon: '💻', count: 156 },
    { id: 2, name: 'Environnement', icon: '🌱', count: 89 },
    { id: 3, name: 'Social', icon: '🤝', count: 124 },
    { id: 4, name: 'Éducation', icon: '📚', count: 67 },
    { id: 5, name: 'Santé', icon: '🏥', count: 45 },
    { id: 6, name: 'Art & Culture', icon: '🎨', count: 78 },
  ];

  const displayCategories = categories && categories.length > 0 ? categories : defaultCategories;

  return (
    <View style={styles.categoriesSection}>
      <Text style={styles.sectionTitle}>Catégories populaires</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
        snapToInterval={120}
        decelerationRate="fast"
      >
        {displayCategories.map((category) => {
          const isSelected = selectedCategories?.includes(category.id) || false;
          return (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => onCategoryPress && onCategoryPress(category.id)}
            >
              <BlurView blurAmount={isSelected ? 25 : 15} blurType="light" style={[
                  styles.categoryCardBlur,
                  isSelected && styles.categoryCardSelected,
                ]}
              >
                <Text style={styles.categoryIcon}>{category.icon}</Text>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} projets</Text>
              </BlurView>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

// Composant Carte de Projet
const ProjectCard = ({ project, showStaffPick = false }) => {
  const progressPercentage = Math.min((project.raised / project.goal) * 100, 100);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
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
    
    Alert.alert('Projet sélectionné', `Détails de "${project.title}"`);
  };

  return (
    <Animated.View style={[styles.projectCard, { transform: [{ scale: scaleAnim }] }]}>
      <TouchableOpacity onPress={handlePress}>
        <BlurView blurAmount={20} blurType="light" style={styles.projectCardBlur}>
          {/* Image du projet */}
          <View style={styles.projectImageContainer}>
            <Image
              source={{ uri: project.image }}
              style={styles.projectImage}
              resizeMode="cover"
            />
            {showStaffPick && project.isStaffPick && (
              <View style={styles.staffPickBadge}>
                <LinearGradient
                  colors={['#FFD700', '#FFA500']}
                  style={styles.staffPickGradient}
                >
                  <Feather name="star" size={12} color="white" />
                  <Text style={styles.staffPickText}>Staff Pick</Text>
                </LinearGradient>
              </View>
            )}
          </View>
          
          {/* Contenu du projet */}
          <View style={styles.projectContent}>
            <Text style={styles.projectTitle} numberOfLines={2}>
              {project.title}
            </Text>
            <Text style={styles.projectDescription} numberOfLines={2}>
              {project.description}
            </Text>
            <Text style={styles.projectCreator}>par {project.creator}</Text>
            
            {/* Barre de progression */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#4F46E5', '#7C3AED']}
                  style={[
                    styles.progressFill,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progressPercentage.toFixed(0)}%
              </Text>
            </View>
            
            {/* Métriques */}
            <View style={styles.projectMetrics}>
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>
                  {(project.raised / 1000).toFixed(0)}K Jerr
                </Text>
                <Text style={styles.metricLabel}>collectés</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{project.contributors}</Text>
                <Text style={styles.metricLabel}>contributeurs</Text>
              </View>
              
              <View style={styles.metricItem}>
                <Text style={styles.metricValue}>{project.daysLeft}j</Text>
                <Text style={styles.metricLabel}>restants</Text>
              </View>
            </View>
          </View>
        </BlurView>
      </TouchableOpacity>
    </Animated.View>
  );
};

// Composant Actions Rapides
const QuickActions = () => {
  const scaleAnim1 = useRef(new Animated.Value(1)).current;
  const scaleAnim2 = useRef(new Animated.Value(1)).current;

  const animatePress = (scaleAnim, callback) => {
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
    ]).start(callback);
  };

  const handleCreateProject = () => {
    animatePress(scaleAnim1, () => {
      Alert.alert('Créer un projet', 'Fonctionnalité en développement');
    });
  };

  const handleLastChance = () => {
    animatePress(scaleAnim2, () => {
      Alert.alert('Dernière chance', 'Projets se terminant bientôt');
    });
  };

  return (
    <View style={styles.quickActions}>
      {/* Bouton principal */}
      <Animated.View style={[styles.primaryAction, { transform: [{ scale: scaleAnim1 }] }]}>
        <TouchableOpacity onPress={handleCreateProject}>
          <LinearGradient
            colors={['#4F46E5', '#7C3AED', '#EC4899']}
            style={styles.primaryActionGradient}
          >
            <Feather name="plus" size={20} color="white" />
            <Text style={styles.primaryActionText}>Créer un projet</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      
      {/* Bouton secondaire */}
      <Animated.View style={[styles.secondaryAction, { transform: [{ scale: scaleAnim2 }] }]}>
        <TouchableOpacity onPress={handleLastChance}>
          <BlurView blurAmount={15} blurType="light" style={styles.secondaryActionBlur}>
            <Feather name="clock" size={20} color="white" />
            <Text style={styles.secondaryActionText}>Dernière chance</Text>
          </BlurView>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

// Composant principal FundingJerrScreen
const FundingJerrScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  
  // Sélecteurs Redux
  const stats = useSelector(selectFundingStats);
  const categories = useSelector(selectFundingCategories);
  const featuredProjects = useSelector(selectVisibleFeatured);
  const trendingProjects = useSelector(selectVisibleTrending);
  const searchQuery = useSelector(selectSearchQuery);
  const filters = useSelector(selectFilters);
  const loading = useSelector(selectFundingLoading);
  const error = useSelector(selectFundingError);
  
  // État local
  const [showFilters, setShowFilters] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Chargement des polices
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Poppins-SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
  });

  // Chargement initial des données
  useEffect(() => {
    dispatch(fetchFundingHome());
    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [dispatch]);

  // Gestion de la recherche
  const handleSearchChange = (text) => {
    dispatch(setSearchQuery(text));
  };

  // Gestion des filtres
  const handleFiltersPress = () => {
    setShowFilters(!showFilters);
  };

  const handleCategoryPress = (categoryId) => {
    dispatch(toggleCategoryFilter(categoryId));
  };

  const handleLastChanceToggle = () => {
    dispatch(toggleLastChanceFilter());
  };

  // Suppression de la condition de chargement des polices pour affichage immédiat

  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient de fond */}
      <LinearGradient
        colors={['#8A2D6C', '#1D7CA6']}
        style={styles.backgroundGradient}
      />

      {/* Header fixe */}
      <FundingHeader
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onFiltersPress={handleFiltersPress}
      />

      {/* Contenu principal */}
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Hero Stats */}
        <HeroStats stats={stats} />

        {/* Catégories */}
        <CategoriesSection
          categories={categories}
          selectedCategories={filters.categories}
          onCategoryPress={handleCategoryPress}
        />

          {/* Projets mis en avant */}
          <View style={styles.projectsSection}>
            <Text style={styles.sectionTitle}>Projets Mis en Avant</Text>
            {loading ? (
              <View style={styles.projectsGrid}>
                {[1, 2].map((_, index) => (
                  <View key={index} style={styles.projectCardSkeleton}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonLine} />
                      <View style={styles.skeletonLineSmall} />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.projectsGrid}>
                {featuredProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showStaffPick={true}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Projets tendance */}
          <View style={styles.projectsSection}>
            <Text style={styles.sectionTitle}>Projets Tendance</Text>
            {loading ? (
              <View style={styles.projectsGrid}>
                {[1, 2, 3].map((_, index) => (
                  <View key={index} style={styles.projectCardSkeleton}>
                    <View style={styles.skeletonImage} />
                    <View style={styles.skeletonContent}>
                      <View style={styles.skeletonLine} />
                      <View style={styles.skeletonLineSmall} />
                    </View>
                  </View>
                ))}
              </View>
            ) : (
              <View style={styles.projectsGrid}>
                {trendingProjects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    showStaffPick={false}
                  />
                ))}
              </View>
            )}
          </View>

          {/* Actions rapides */}
          <QuickActions />

          {/* Espacement en bas */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      </Animated.View>

      {/* Panel de filtres */}
      {showFilters && (
        <BlurView blurAmount={30} blurType="light" style={styles.filtersOverlay}>
          <View style={styles.filtersPanel}>
            <View style={styles.filtersPanelHeader}>
              <Text style={styles.filtersPanelTitle}>Filtres</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Feather name="x" size={24} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.filterOption}>
              <TouchableOpacity
                style={[
                  styles.filterToggle,
                  filters.lastChance && styles.filterToggleActive,
                ]}
                onPress={handleLastChanceToggle}
              >
                <Text style={styles.filterToggleText}>Dernière chance</Text>
                {filters.lastChance && (
                  <Feather name="check" size={16} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      )}
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  backgroundGradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  
  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 0 : 20,
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    flex: 1,
  },
  
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  
  searchContainer: {
    position: 'relative',
  },
  
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    height: 40,
    width: 200,
    overflow: 'hidden',
  },
  
  searchButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  searchInput: {
    flex: 1,
    height: 40,
    paddingHorizontal: 10,
    color: 'white',
    fontFamily: 'Poppins-Regular',
    fontSize: 14,
  },
  
  filterButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
  },
  
  // Contenu principal
  content: {
    flex: 1,
  },
  
  scrollView: {
    flex: 1,
  },
  
  scrollContent: {
    paddingBottom: 100,
  },
  
  // Hero Stats
  heroStats: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    marginBottom: 4,
  },
  
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  
  // Sections
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  
  // Catégories
  categoriesSection: {
    marginVertical: 10,
  },
  
  categoriesContainer: {
    paddingHorizontal: 20,
    gap: 15,
  },
  
  categoryCard: {
    width: 100,
  },
  
  categoryCardBlur: {
    padding: 15,
    borderRadius: 16,
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  categoryCardSelected: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderColor: 'rgba(79, 70, 229, 0.5)',
  },
  
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  
  categoryName: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 4,
  },
  
  categoryCount: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
  
  // Projets
  projectsSection: {
    marginVertical: 15,
  },
  
  projectsGrid: {
    paddingHorizontal: 20,
    gap: 20,
  },
  
  projectCard: {
    marginBottom: 20,
  },
  
  projectCardBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  
  projectImageContainer: {
    position: 'relative',
    height: 200,
  },
  
  projectImage: {
    width: '100%',
    height: '100%',
  },
  
  staffPickBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  
  staffPickGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  
  staffPickText: {
    fontSize: 10,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  
  projectContent: {
    padding: 20,
  },
  
  projectTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 8,
    lineHeight: 24,
  },
  
  projectDescription: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
    lineHeight: 20,
  },
  
  projectCreator: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 15,
  },
  
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    gap: 10,
  },
  
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  
  progressText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    minWidth: 35,
  },
  
  projectMetrics: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  metricItem: {
    alignItems: 'center',
  },
  
  metricValue: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  
  metricLabel: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  
  // Actions rapides
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
  },
  
  primaryAction: {
    flex: 1,
  },
  
  primaryActionGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#4F46E5',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.4,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    }),
  },
  
  primaryActionText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  
  secondaryAction: {
    flex: 1,
  },
  
  secondaryActionBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    gap: 8,
  },
  
  secondaryActionText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  
  // Filtres
  filtersOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'flex-end',
  },
  
  filtersPanel: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    minHeight: 200,
  },
  
  filtersPanelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  
  filtersPanelTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
  },
  
  filterOption: {
    marginBottom: 15,
  },
  
  filterToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  filterToggleActive: {
    backgroundColor: 'rgba(79, 70, 229, 0.2)',
    borderColor: 'rgba(79, 70, 229, 0.5)',
  },
  
  filterToggleText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'white',
  },
  
  // Skeletons
  statCardSkeleton: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  
  categoryCardSkeleton: {
    width: 100,
    padding: 15,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
  },
  
  projectCardSkeleton: {
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    marginBottom: 20,
  },
  
  skeletonImage: {
    height: 200,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  skeletonContent: {
    padding: 20,
  },
  
  skeletonLine: {
    height: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    marginBottom: 8,
  },
  
  skeletonLineSmall: {
    height: 12,
    width: '60%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
  },
  
  skeletonCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 8,
  },
  
  bottomSpacer: {
    height: 50,
  },
});

export default FundingJerrScreen;