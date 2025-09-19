import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  Animated,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Feather, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { setQuery } from '../redux/starJerrSlice';
import { starJerrTokens } from '../utils/starJerrTokens';
import starJerrService from '../services/starJerrService';

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2;

// Données mock des célébrités
const mockCelebrities = {
  musique: [
    {
      id: 1,
      name: 'Beyoncé',
      category: 'Musique',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=B',
      tokenPrice: '2500J',
      marketCap: '125MJ',
      change24h: '+5.2%',
      hasToken: true,
      followers: '31.2M',
      verified: true,
    },
    {
      id: 2,
      name: 'Drake',
      category: 'Musique',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=D',
      tokenPrice: '1800J',
      marketCap: '90MJ',
      change24h: '-2.1%',
      hasToken: true,
      followers: '28.5M',
      verified: true,
    },
    {
      id: 3,
      name: 'Taylor Swift',
      category: 'Musique',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=T',
      tokenPrice: '3200J',
      marketCap: '160MJ',
      change24h: '+8.7%',
      hasToken: true,
      followers: '45.1M',
      verified: true,
    },
  ],
  cinema: [
    {
      id: 4,
      name: 'Leonardo DiCaprio',
      category: 'Cinéma',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=L',
      tokenPrice: '2800J',
      marketCap: '140MJ',
      change24h: '+3.4%',
      hasToken: true,
      followers: '19.8M',
      verified: true,
    },
    {
      id: 5,
      name: 'Margot Robbie',
      category: 'Cinéma',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=M',
      tokenPrice: '2100J',
      marketCap: '105MJ',
      change24h: '+1.9%',
      hasToken: true,
      followers: '15.3M',
      verified: true,
    },
  ],
  sport: [
    {
      id: 6,
      name: 'Cristiano Ronaldo',
      category: 'Sport',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=C',
      tokenPrice: '4500J',
      marketCap: '225MJ',
      change24h: '+12.3%',
      hasToken: true,
      followers: '62.1M',
      verified: true,
    },
    {
      id: 7,
      name: 'Serena Williams',
      category: 'Sport',
      image: 'https://via.placeholder.com/150x150/FFD700/000000?text=S',
      tokenPrice: '1900J',
      marketCap: '95MJ',
      change24h: '+4.1%',
      hasToken: true,
      followers: '13.7M',
      verified: true,
    },
  ],
};

const StarJerrCategoryScreen = ({ route, navigation }) => {
  const { categorySlug, categoryName, categoryEmoji } = route.params;
  const dispatch = useDispatch();
  const query = useSelector(state => state.starJerr.query);
  
  const [celebrities, setCelebrities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('marketCap'); // marketCap, price, change
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    const loadStars = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('🔍 Chargement des stars pour la catégorie:', categorySlug);
        
        // Utiliser l'API pour récupérer les vraies données
        const starsData = await starJerrService.getStarsByCategory(categorySlug);
        
        console.log('📦 Données reçues:', starsData);
        
        // Transformer les données de l'API au format attendu par l'interface
        const transformedData = starsData.map(star => ({
          id: star._id,
          name: star.stageName || `${star.firstName} ${star.lastName}`,
          category: star.category,
          image: star.profileImage?.url || `https://via.placeholder.com/150x150/FFD700/000000?text=${(star.firstName || 'S')[0]}`,
          tokenPrice: star.tokenInfo?.currentTokenPrice ? `${star.tokenInfo.currentTokenPrice}J` : '0J',
          marketCap: star.tokenInfo?.marketCap ? `${(star.tokenInfo.marketCap / 1000000).toFixed(1)}MJ` : '0MJ',
          change24h: star.tokenInfo?.priceChange24h || '+0.0%',
          hasToken: star.hasTokens || false,
          followers: star.stats?.totalFollowers ? `${(star.stats.totalFollowers / 1000000).toFixed(1)}M` : '0',
          verified: star.verified || false,
        }));
        
        setCelebrities(transformedData);
      } catch (error) {
        console.error('Erreur lors du chargement des stars:', error);
        setError('Erreur lors du chargement des stars: ' + error.message);
        
        // En cas d'erreur, utiliser les données mock pour la catégorie sport/footballeurs
        if (categorySlug === 'footballeurs') {
          const mockFootballers = [
            {
              id: 'mock-1',
              name: 'Mike Magnan',
              category: 'Sport',
              image: 'https://via.placeholder.com/150x150/FFD700/000000?text=MM',
              tokenPrice: '1500J',
              marketCap: '75MJ',
              change24h: '+3.2%',
              hasToken: true,
              followers: '2.1M',
              verified: true,
            },
            {
              id: 'mock-2',
              name: 'Kylian Mbappé',
              category: 'Sport',
              image: 'https://via.placeholder.com/150x150/FFD700/000000?text=KM',
              tokenPrice: '5200J',
              marketCap: '260MJ',
              change24h: '+8.7%',
              hasToken: true,
              followers: '15.3M',
              verified: true,
            },
            {
              id: 'mock-3',
              name: 'Lionel Messi',
              category: 'Sport',
              image: 'https://via.placeholder.com/150x150/FFD700/000000?text=LM',
              tokenPrice: '6800J',
              marketCap: '340MJ',
              change24h: '+12.1%',
              hasToken: true,
              followers: '18.7M',
              verified: true,
            },
            {
              id: 'mock-4',
              name: 'Cristiano Ronaldo',
              category: 'Sport',
              image: 'https://via.placeholder.com/150x150/FFD700/000000?text=CR',
              tokenPrice: '7200J',
              marketCap: '360MJ',
              change24h: '+15.3%',
              hasToken: true,
              followers: '22.1M',
              verified: true,
            },
          ];
          setCelebrities(mockFootballers);
        } else {
          // Pour les autres catégories, utiliser les données mock existantes
          const categoryData = mockCelebrities[categorySlug] || [];
          setCelebrities(categoryData);
        }
      } finally {
        setLoading(false);
      }
    };
    
    loadStars();
    
    // Animation d'entrée
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, [categorySlug]);
  
  // Filtrage et tri des célébrités
  const filteredAndSortedCelebrities = celebrities
    .filter(celebrity => 
      celebrity.name.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(b.tokenPrice) - parseInt(a.tokenPrice);
        case 'change':
          return parseFloat(b.change24h) - parseFloat(a.change24h);
        case 'marketCap':
        default:
          return parseInt(b.marketCap) - parseInt(a.marketCap);
      }
    });
  
  const handleCelebrityPress = (celebrity) => {
    Alert.alert(
      celebrity.name,
      `Token: ${celebrity.tokenPrice}\nMarket Cap: ${celebrity.marketCap}\nChange 24h: ${celebrity.change24h}`,
      [
        { text: 'Acheter Token', onPress: () => console.log('Acheter token') },
        { text: 'Voir Profil', onPress: () => console.log('Voir profil') },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };
  
  const renderCelebrityCard = ({ item }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    
    const handlePressIn = () => {
      Animated.spring(scaleAnim, {
        toValue: 0.98,
        useNativeDriver: true,
      }).start();
    };
    
    const handlePressOut = () => {
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    };
    
    const isPositiveChange = item.change24h.startsWith('+');
    
    return (
      <Animated.View style={[styles.celebrityCard, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={() => handleCelebrityPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.celebrityContent}
        >
          <LinearGradient
            colors={[starJerrTokens.colors.glassBg, 'rgba(15,28,63,0.02)']}
            style={styles.celebrityGradient}
          >
            {/* Image de la célébrité */}
            <View style={styles.celebrityImageContainer}>
              <Image source={{ uri: item.image }} style={styles.celebrityImage} />
              {item.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={starJerrTokens.colors.gold} />
                </View>
              )}
            </View>
            
            {/* Informations */}
            <Text style={styles.celebrityName} numberOfLines={1}>{item.name}</Text>
            <Text style={styles.celebrityFollowers}>{item.followers} followers</Text>
            
            {/* Token Info */}
            {item.hasToken && (
              <View style={styles.tokenInfo}>
                <View style={styles.tokenPrice}>
                  <Text style={styles.tokenPriceText}>{item.tokenPrice}</Text>
                </View>
                <Text style={[styles.change24h, { color: isPositiveChange ? '#4ECDC4' : '#FF6B6B' }]}>
                  {item.change24h}
                </Text>
              </View>
            )}
            
            {/* Market Cap */}
            <Text style={styles.marketCap}>Cap: {item.marketCap}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  const renderSortButton = (sortType, label) => (
    <TouchableOpacity
      style={[styles.sortButton, sortBy === sortType && styles.sortButtonActive]}
      onPress={() => setSortBy(sortType)}
    >
      <Text style={[styles.sortButtonText, sortBy === sortType && styles.sortButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
  if (loading) {
    return (
      <LinearGradient
        colors={[starJerrTokens.colors.bgStart, starJerrTokens.colors.bgEnd]}
        style={styles.container}
      >
        <StatusBar barStyle="light-content" />
        <SafeAreaView style={styles.safeArea}>
          <Text style={styles.loadingText}>Chargement des célébrités...</Text>
        </SafeAreaView>
      </LinearGradient>
    );
  }
  
  return (
    <LinearGradient
      colors={[starJerrTokens.colors.bgStart, starJerrTokens.colors.bgEnd]}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <Animated.View 
          style={[
            styles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTop}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="chevron-back" size={20} color={starJerrTokens.colors.textWhite} />
              </TouchableOpacity>
              
              <View style={styles.headerCenter}>
                <View style={styles.categoryHeader}>
                  <Text style={styles.categoryEmoji}>{categoryEmoji}</Text>
                  <Text style={styles.headerTitle}>{categoryName}</Text>
                </View>
              </View>
              
              <View style={styles.headerSpacer} />
            </View>
            
            <Text style={styles.headerSubtitle}>
              {filteredAndSortedCelebrities.length} célébrités disponibles
            </Text>
          </View>
          
          {/* Barre de recherche */}
          <View style={styles.searchContainer}>
            <Feather 
              name="search" 
              size={20} 
              color={starJerrTokens.colors.textGray} 
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher une célébrité…"
              placeholderTextColor={starJerrTokens.colors.textGray}
              value={query}
              onChangeText={(text) => dispatch(setQuery(text))}
            />
          </View>
          
          {/* Filtres de tri */}
          <View style={styles.sortContainer}>
            <Text style={styles.sortLabel}>Trier par:</Text>
            <View style={styles.sortButtons}>
              {renderSortButton('marketCap', 'Market Cap')}
              {renderSortButton('price', 'Prix')}
              {renderSortButton('change', 'Change 24h')}
            </View>
          </View>
          
          {/* Affichage d'erreur */}
          {error && (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={48} color={starJerrTokens.colors.error} />
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity 
                style={styles.retryButton}
                onPress={() => {
                  setError(null);
                  const loadStars = async () => {
                    try {
                      setLoading(true);
                      setError(null);
                      const starsData = await starJerrService.getStarsByCategory(categorySlug);
                      const transformedData = starsData.map(star => ({
                        id: star._id,
                        name: star.stageName || `${star.firstName} ${star.lastName}`,
                        category: star.category,
                        image: star.profileImage?.url || `https://via.placeholder.com/150x150/FFD700/000000?text=${(star.firstName || 'S')[0]}`,
                        tokenPrice: star.tokenInfo?.currentTokenPrice ? `${star.tokenInfo.currentTokenPrice}J` : '0J',
                        marketCap: star.tokenInfo?.marketCap ? `${(star.tokenInfo.marketCap / 1000000).toFixed(1)}MJ` : '0MJ',
                        change24h: star.tokenInfo?.priceChange24h || '+0.0%',
                        hasToken: star.hasTokens || false,
                        followers: star.stats?.totalFollowers ? `${(star.stats.totalFollowers / 1000000).toFixed(1)}M` : '0',
                        verified: star.verified || false,
                      }));
                      setCelebrities(transformedData);
                    } catch (error) {
                      setError('Erreur lors du chargement des stars: ' + error.message);
                      if (categorySlug === 'footballeurs') {
                        const mockFootballers = [
                          {
                            id: 'mock-1',
                            name: 'Mike Magnan',
                            category: 'Sport',
                            image: 'https://via.placeholder.com/150x150/FFD700/000000?text=MM',
                            tokenPrice: '1500J',
                            marketCap: '75MJ',
                            change24h: '+3.2%',
                            hasToken: true,
                            followers: '2.1M',
                            verified: true,
                          },
                          {
                            id: 'mock-2',
                            name: 'Kylian Mbappé',
                            category: 'Sport',
                            image: 'https://via.placeholder.com/150x150/FFD700/000000?text=KM',
                            tokenPrice: '5200J',
                            marketCap: '260MJ',
                            change24h: '+8.7%',
                            hasToken: true,
                            followers: '15.3M',
                            verified: true,
                          },
                          {
                            id: 'mock-3',
                            name: 'Lionel Messi',
                            category: 'Sport',
                            image: 'https://via.placeholder.com/150x150/FFD700/000000?text=LM',
                            tokenPrice: '6800J',
                            marketCap: '340MJ',
                            change24h: '+12.1%',
                            hasToken: true,
                            followers: '18.7M',
                            verified: true,
                          },
                          {
                            id: 'mock-4',
                            name: 'Cristiano Ronaldo',
                            category: 'Sport',
                            image: 'https://via.placeholder.com/150x150/FFD700/000000?text=CR',
                            tokenPrice: '7200J',
                            marketCap: '360MJ',
                            change24h: '+15.3%',
                            hasToken: true,
                            followers: '22.1M',
                            verified: true,
                          },
                        ];
                        setCelebrities(mockFootballers);
                      }
                    } finally {
                      setLoading(false);
                    }
                  };
                  loadStars();
                }}
              >
                <Text style={styles.retryButtonText}>Réessayer</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Liste des célébrités */}
          {!error && (
            <FlatList
              data={filteredAndSortedCelebrities}
              renderItem={renderCelebrityCard}
              keyExtractor={(item) => item.id.toString()}
              numColumns={2}
              columnWrapperStyle={styles.gridRow}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.gridContent}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <MaterialCommunityIcons name="star-off" size={64} color={starJerrTokens.colors.textGray} />
                  <Text style={styles.emptyText}>Aucune célébrité trouvée</Text>
                  <Text style={styles.emptySubtext}>Essayez de modifier votre recherche</Text>
                </View>
              }
            />
          )}
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = {
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: starJerrTokens.spacing.s16,
  },
  loadingText: {
    color: starJerrTokens.colors.textWhite,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 100,
  },
  
  // Header
  header: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    padding: starJerrTokens.spacing.s16,
    marginBottom: starJerrTokens.spacing.s16,
    ...starJerrTokens.shadows.shadowSoft,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: starJerrTokens.spacing.s8,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 32,
    marginRight: starJerrTokens.spacing.s8,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
  },
  headerSpacer: {
    width: 44,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
  },
  
  // Search
  searchContainer: {
    position: 'relative',
    marginBottom: starJerrTokens.spacing.s16,
  },
  searchIcon: {
    position: 'absolute',
    left: 12,
    top: 14,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    paddingVertical: 12,
    paddingLeft: 40,
    paddingRight: starJerrTokens.spacing.s16,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textWhite,
    ...starJerrTokens.shadows.shadowSoft,
  },
  
  // Sort
  sortContainer: {
    marginBottom: starJerrTokens.spacing.s16,
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: starJerrTokens.spacing.s8,
  },
  sortButtons: {
    flexDirection: 'row',
    gap: starJerrTokens.spacing.s8,
  },
  sortButton: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r8,
    paddingHorizontal: starJerrTokens.spacing.s12,
    paddingVertical: 6,
  },
  sortButtonActive: {
    backgroundColor: `${starJerrTokens.colors.gold}1A`,
    borderColor: starJerrTokens.colors.gold,
  },
  sortButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
  sortButtonTextActive: {
    color: starJerrTokens.colors.gold,
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Grid
  gridContent: {
    paddingBottom: 100,
  },
  gridRow: {
    justifyContent: 'space-between',
  },
  celebrityCard: {
    width: cardWidth,
    marginBottom: starJerrTokens.spacing.s16,
  },
  celebrityContent: {
    borderRadius: starJerrTokens.radius.r12,
    overflow: 'hidden',
  },
  celebrityGradient: {
    padding: starJerrTokens.spacing.s12,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    ...starJerrTokens.shadows.shadowSoft,
  },
  celebrityImageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: starJerrTokens.spacing.s8,
  },
  celebrityImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: starJerrTokens.colors.gold,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: starJerrTokens.colors.bgStart,
    borderRadius: 10,
    padding: 2,
  },
  celebrityName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    textAlign: 'center',
    marginBottom: 2,
  },
  celebrityFollowers: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
    marginBottom: starJerrTokens.spacing.s8,
  },
  tokenInfo: {
    alignItems: 'center',
    marginBottom: 4,
  },
  tokenPrice: {
    backgroundColor: `${starJerrTokens.colors.gold}1A`,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    borderRadius: starJerrTokens.radius.r8,
    paddingHorizontal: starJerrTokens.spacing.s8,
    paddingVertical: 2,
    marginBottom: 4,
  },
  tokenPriceText: {
    fontSize: 12,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.gold,
  },
  change24h: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
  },
  marketCap: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
  },
  
  // Empty state
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginTop: starJerrTokens.spacing.s16,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginTop: starJerrTokens.spacing.s8,
    textAlign: 'center',
  },
  
  // Error state
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: starJerrTokens.spacing.s24,
  },
  errorText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textWhite,
    marginTop: starJerrTokens.spacing.s16,
    textAlign: 'center',
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: starJerrTokens.colors.gold,
    borderRadius: starJerrTokens.radius.r12,
    paddingHorizontal: starJerrTokens.spacing.s24,
    paddingVertical: starJerrTokens.spacing.s12,
    marginTop: starJerrTokens.spacing.s24,
    ...starJerrTokens.shadows.shadowSoft,
  },
  retryButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.bgStart,
    textAlign: 'center',
  },
};

export default StarJerrCategoryScreen;