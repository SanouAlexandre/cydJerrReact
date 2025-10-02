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
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector, useDispatch } from 'react-redux';
import { setQuery } from '../redux/starJerrSlice';
import { starJerrTokens } from '../utils/starJerrTokens';

const { width } = Dimensions.get('window');
const cardWidth = width - 32;

// Données mock des résultats de recherche
const mockSearchResults = [
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
    description: 'Artiste internationale, icône de la musique pop et R&B',
  },
  {
    id: 2,
    name: 'Leonardo DiCaprio',
    category: 'Cinéma',
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=L',
    tokenPrice: '2800J',
    marketCap: '140MJ',
    change24h: '+3.4%',
    hasToken: true,
    followers: '19.8M',
    verified: true,
    description: 'Acteur oscarisé, militant écologiste',
  },
  {
    id: 3,
    name: 'Cristiano Ronaldo',
    category: 'Sport',
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=C',
    tokenPrice: '4500J',
    marketCap: '225MJ',
    change24h: '+12.3%',
    hasToken: true,
    followers: '62.1M',
    verified: true,
    description: 'Footballeur professionnel, légende du sport',
  },
  {
    id: 4,
    name: 'Taylor Swift',
    category: 'Musique',
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=T',
    tokenPrice: '3200J',
    marketCap: '160MJ',
    change24h: '+8.7%',
    hasToken: true,
    followers: '45.1M',
    verified: true,
    description: 'Auteure-compositrice-interprète, multiple Grammy winner',
  },
  {
    id: 5,
    name: 'Elon Musk',
    category: 'Tech',
    image: 'https://via.placeholder.com/150x150/FFD700/000000?text=E',
    tokenPrice: '5200J',
    marketCap: '260MJ',
    change24h: '+15.8%',
    hasToken: true,
    followers: '128.5M',
    verified: true,
    description: 'Entrepreneur, CEO de Tesla et SpaceX',
  },
];

const StarJerrSearchResultsScreen = ({ route, navigation }) => {
  const { searchQuery } = route.params || {};
  const dispatch = useDispatch();
  const query = useSelector(state => state.starJerr.query);
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('relevance'); // relevance, marketCap, price, change
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
    // Initialiser la recherche avec le paramètre passé
    if (searchQuery && searchQuery !== query) {
      dispatch(setQuery(searchQuery));
    }
  }, [searchQuery]);
  
  useEffect(() => {
    // Simulation de la recherche
    setLoading(true);
    setTimeout(() => {
      if (query.trim()) {
        const filteredResults = mockSearchResults.filter(celebrity =>
          celebrity.name.toLowerCase().includes(query.toLowerCase()) ||
          celebrity.category.toLowerCase().includes(query.toLowerCase()) ||
          celebrity.description.toLowerCase().includes(query.toLowerCase())
        );
        setResults(filteredResults);
      } else {
        setResults([]);
      }
      setLoading(false);
    }, 800);
    
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
  }, [query]);
  
  // Filtrage et tri des résultats
  const filteredAndSortedResults = results
    .filter(celebrity => 
      filterCategory === 'all' || celebrity.category.toLowerCase() === filterCategory.toLowerCase()
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return parseInt(b.tokenPrice) - parseInt(a.tokenPrice);
        case 'change':
          return parseFloat(b.change24h) - parseFloat(a.change24h);
        case 'marketCap':
          return parseInt(b.marketCap) - parseInt(a.marketCap);
        case 'relevance':
        default:
          // Tri par pertinence (score basé sur la correspondance du nom)
          const aScore = a.name.toLowerCase().indexOf(query.toLowerCase());
          const bScore = b.name.toLowerCase().indexOf(query.toLowerCase());
          if (aScore === -1 && bScore === -1) return 0;
          if (aScore === -1) return 1;
          if (bScore === -1) return -1;
          return aScore - bScore;
      }
    });
  
  const handleCelebrityPress = (celebrity) => {
    Alert.alert(
      celebrity.name,
      `${celebrity.description}\n\nToken: ${celebrity.tokenPrice}\nMarket Cap: ${celebrity.marketCap}\nChange 24h: ${celebrity.change24h}`,
      [
        { text: 'Acheter Token', onPress: () => console.log('Acheter token') },
        { text: 'Voir Profil', onPress: () => console.log('Voir profil') },
        { text: 'Annuler', style: 'cancel' },
      ]
    );
  };
  
  const renderResultCard = ({ item }) => {
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
      <Animated.View style={[styles.resultCard, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={() => handleCelebrityPress(item)}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          style={styles.resultContent}
        >
          <LinearGradient
            colors={[starJerrTokens.colors.glassBg, 'rgba(15,28,63,0.02)']}
            style={styles.resultGradient}
          >
            <View style={styles.resultLeft}>
              {/* Image de la célébrité */}
              <View style={styles.celebrityImageContainer}>
                <Image source={{ uri: item.image }} style={styles.celebrityImage} />
                {item.verified && (
                  <View style={styles.verifiedBadge}>
                    <Ionicons name="checkmark-circle" size={16} color={starJerrTokens.colors.gold} />
                  </View>
                )}
              </View>
              
              {/* Informations principales */}
              <View style={styles.celebrityInfo}>
                <Text style={styles.celebrityName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.celebrityCategory}>{item.category}</Text>
                <Text style={styles.celebrityDescription} numberOfLines={2}>{item.description}</Text>
                <Text style={styles.celebrityFollowers}>{item.followers} followers</Text>
              </View>
            </View>
            
            <View style={styles.resultRight}>
              {/* Token Info */}
              {item.hasToken && (
                <View style={styles.tokenInfo}>
                  <View style={styles.tokenPrice}>
                    <Text style={styles.tokenPriceText}>{item.tokenPrice}</Text>
                  </View>
                  <Text style={[styles.change24h, { color: isPositiveChange ? '#4ECDC4' : '#FF6B6B' }]}>
                    {item.change24h}
                  </Text>
                  <Text style={styles.marketCap}>Cap: {item.marketCap}</Text>
                </View>
              )}
              
              {/* Action Button */}
              <TouchableOpacity style={styles.actionButton}>
                <MaterialCommunityIcons name="star-plus" size={20} color={starJerrTokens.colors.gold} />
              </TouchableOpacity>
            </View>
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
  
  const renderFilterButton = (filterType, label) => (
    <TouchableOpacity
      style={[styles.filterButton, filterCategory === filterType && styles.filterButtonActive]}
      onPress={() => setFilterCategory(filterType)}
    >
      <Text style={[styles.filterButtonText, filterCategory === filterType && styles.filterButtonTextActive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
  
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
                <Text style={styles.headerTitle}>Résultats de recherche</Text>
              </View>
              
              <View style={styles.headerSpacer} />
            </View>
            
            {query && (
              <Text style={styles.headerSubtitle}>
                {loading ? 'Recherche en cours...' : `${filteredAndSortedResults.length} résultat(s) pour "${query}"`}
              </Text>
            )}
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
              autoFocus={!searchQuery}
            />
            {query.length > 0 && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={() => dispatch(setQuery(''))}
              >
                <Ionicons name="close-circle" size={20} color={starJerrTokens.colors.textGray} />
              </TouchableOpacity>
            )}
          </View>
          
          {/* Filtres */}
          {results.length > 0 && (
            <View style={styles.filtersContainer}>
              {/* Filtres par catégorie */}
              <View style={styles.filterSection}>
                <Text style={styles.filterLabel}>Catégorie:</Text>
                <View style={styles.filterButtons}>
                  {renderFilterButton('all', 'Toutes')}
                  {renderFilterButton('musique', 'Musique')}
                  {renderFilterButton('cinéma', 'Cinéma')}
                  {renderFilterButton('sport', 'Sport')}
                  {renderFilterButton('tech', 'Tech')}
                </View>
              </View>
              
              {/* Tri */}
              <View style={styles.sortSection}>
                <Text style={styles.sortLabel}>Trier par:</Text>
                <View style={styles.sortButtons}>
                  {renderSortButton('relevance', 'Pertinence')}
                  {renderSortButton('marketCap', 'Market Cap')}
                  {renderSortButton('price', 'Prix')}
                  {renderSortButton('change', 'Change 24h')}
                </View>
              </View>
            </View>
          )}
          
          {/* Résultats */}
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Recherche en cours...</Text>
            </View>
          ) : (
            <FlatList
              data={filteredAndSortedResults}
              renderItem={renderResultCard}
              keyExtractor={(item) => item.id.toString()}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={
                query.trim() ? (
                  <View style={styles.emptyState}>
                    <MaterialCommunityIcons name="star-off" size={64} color={starJerrTokens.colors.textGray} />
                    <Text style={styles.emptyText}>Aucun résultat trouvé</Text>
                    <Text style={styles.emptySubtext}>Essayez avec d'autres mots-clés</Text>
                  </View>
                ) : (
                  <View style={styles.emptyState}>
                    <Feather name="search" size={64} color={starJerrTokens.colors.textGray} />
                    <Text style={styles.emptyText}>Commencez votre recherche</Text>
                    <Text style={styles.emptySubtext}>Tapez le nom d'une célébrité ou d'une catégorie</Text>
                  </View>
                )
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
  headerTitle: {
    fontSize: 18,
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
    paddingRight: 40,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textWhite,
    ...starJerrTokens.shadows.shadowSoft,
  },
  clearButton: {
    position: 'absolute',
    right: 12,
    top: 14,
    zIndex: 1,
  },
  
  // Filters
  filtersContainer: {
    marginBottom: starJerrTokens.spacing.s16,
  },
  filterSection: {
    marginBottom: starJerrTokens.spacing.s12,
  },
  filterLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: starJerrTokens.spacing.s8,
  },
  filterButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: starJerrTokens.spacing.s8,
  },
  filterButton: {
    backgroundColor: starJerrTokens.colors.glassBg,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r8,
    paddingHorizontal: starJerrTokens.spacing.s12,
    paddingVertical: 6,
  },
  filterButtonActive: {
    backgroundColor: `${starJerrTokens.colors.gold}1A`,
    borderColor: starJerrTokens.colors.gold,
  },
  filterButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
  filterButtonTextActive: {
    color: starJerrTokens.colors.gold,
    fontFamily: 'Poppins-SemiBold',
  },
  
  // Sort
  sortSection: {
    marginBottom: starJerrTokens.spacing.s8,
  },
  sortLabel: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: starJerrTokens.spacing.s8,
  },
  sortButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  
  // Results
  listContent: {
    paddingBottom: 100,
  },
  resultCard: {
    width: cardWidth,
    marginBottom: starJerrTokens.spacing.s12,
  },
  resultContent: {
    borderRadius: starJerrTokens.radius.r12,
    overflow: 'hidden',
  },
  resultGradient: {
    flexDirection: 'row',
    padding: starJerrTokens.spacing.s12,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.borderGlass,
    borderRadius: starJerrTokens.radius.r12,
    ...starJerrTokens.shadows.shadowSoft,
  },
  resultLeft: {
    flex: 1,
    flexDirection: 'row',
  },
  celebrityImageContainer: {
    position: 'relative',
    marginRight: starJerrTokens.spacing.s12,
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
  celebrityInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  celebrityName: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: 2,
  },
  celebrityCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.gold,
    marginBottom: 4,
  },
  celebrityDescription: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginBottom: 4,
  },
  celebrityFollowers: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
  resultRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: starJerrTokens.spacing.s8,
  },
  tokenInfo: {
    alignItems: 'center',
  },
  tokenPrice: {
    backgroundColor: `${starJerrTokens.colors.gold}1A`,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    borderRadius: starJerrTokens.radius.r8,
    paddingHorizontal: starJerrTokens.spacing.s8,
    paddingVertical: 4,
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
    marginBottom: 2,
  },
  marketCap: {
    fontSize: 10,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    textAlign: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: `${starJerrTokens.colors.gold}1A`,
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: starJerrTokens.spacing.s8,
  },
  
  // Loading
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: starJerrTokens.colors.textWhite,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
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
};

export default StarJerrSearchResultsScreen;