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
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Feather, MaterialCommunityIcons, Ionicons } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Utilitaires de conversion Jerr
const eurosToJerr = (euroPrice) => {
  return Math.round(euroPrice / 0.01);
};

const formatJerr = (jerrAmount) => {
  return `${jerrAmount.toLocaleString()} Jerr`;
};

const ShopJerrScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [cartItems, setCartItems] = useState(0);
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 45, seconds: 30 });
  const [favorites, setFavorites] = useState(new Set());
  
  // Animations
  const flameAnimation = useRef(new Animated.Value(1)).current;
  const viewersAnimation = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Données mock pour les flash deals
  const flashDeals = [
    {
      id: 1,
      title: 'iPhone 15 Pro',
      vendor: 'Apple Store',
      originalPrice: 1199,
      currentPrice: 899,
      stock: 75,
      maxStock: 100,
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=80&h=80&fit=crop&crop=center',
    },
    {
      id: 2,
      title: 'MacBook Air M3',
      vendor: 'Tech World',
      originalPrice: 1299,
      currentPrice: 999,
      stock: 45,
      maxStock: 80,
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=80&h=80&fit=crop&crop=center',
    },
    {
      id: 3,
      title: 'AirPods Pro 2',
      vendor: 'Audio Plus',
      originalPrice: 279,
      currentPrice: 199,
      stock: 90,
      maxStock: 120,
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=80&h=80&fit=crop&crop=center',
    },
  ];

  // Données mock pour les nouveautés
  const newProducts = [
    {
      id: 1,
      title: 'Smart Watch Ultra',
      vendor: 'TechCorp',
      price: 399,
      rating: 4.8,
      viewers: 127,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200&h=250&fit=crop&crop=center',
    },
    {
      id: 2,
      title: 'Wireless Headphones',
      vendor: 'SoundMax',
      price: 149,
      rating: 4.6,
      viewers: 89,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=250&fit=crop&crop=center',
    },
    {
      id: 3,
      title: 'Gaming Keyboard',
      vendor: 'GameTech',
      price: 129,
      rating: 4.9,
      viewers: 156,
      image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=200&h=250&fit=crop&crop=center',
    },
    {
      id: 4,
      title: 'Smartphone Case',
      vendor: 'ProtectPlus',
      price: 29,
      rating: 4.4,
      viewers: 203,
      image: 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=200&h=250&fit=crop&crop=center',
    },
  ];

  // Données mock pour les recommandations
  const recommendations = [
    {
      id: 1,
      title: 'Tablet Pro 12.9',
      vendor: 'TabletCorp',
      price: 799,
      reason: 'Basé sur vos achats récents',
      reasonIcon: 'shopping-bag',
      viewers: 45,
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=80&h=80&fit=crop&crop=center',
    },
    {
      id: 2,
      title: 'Bluetooth Speaker',
      vendor: 'AudioMax',
      price: 89,
      reason: 'Populaire dans votre région',
      reasonIcon: 'map-pin',
      viewers: 78,
      image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=80&h=80&fit=crop&crop=center',
    },
  ];

  useEffect(() => {
    // Animation de la flamme
    const flameLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(flameAnimation, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(flameAnimation, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    flameLoop.start();

    // Animation des points viewers
    const viewersLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(viewersAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(viewersAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    viewersLoop.start();

    // Compteur de temps
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => {
      flameLoop.stop();
      viewersLoop.stop();
      clearInterval(timer);
    };
  }, []);

  const handleSearch = () => {
    console.log('Recherche:', searchText);
  };

  const handleAddToCart = (product) => {
    setCartItems(prev => prev + 1);
    Alert.alert('Ajouté au panier', `${product.title} ajouté avec succès!`);
  };

  const handleFavorite = (productId) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  const handleQRScan = () => {
    Alert.alert('Scanner QR', 'Fonctionnalité de scan QR à implémenter');
  };

  const animatePress = (callback) => {
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
    callback && callback();
  };

  const renderFlashDealCard = (deal) => {
    const originalPriceJerr = eurosToJerr(deal.originalPrice);
    const currentPriceJerr = eurosToJerr(deal.currentPrice);
    const discount = Math.round(100 - (deal.currentPrice / deal.originalPrice) * 100);
    const stockPercentage = (deal.stock / deal.maxStock) * 100;

    return (
      <TouchableOpacity
        key={deal.id}
        style={styles.flashDealCard}
        onPress={() => animatePress(() => handleAddToCart(deal))}
      >
        <BlurView blurAmount={20} blurType="light" style={styles.dealCardBlur}>
          <Image source={{ uri: deal.image }} style={styles.dealImage} />
          <View style={styles.dealBadge}>
            <Text style={styles.dealBadgeText}>-{discount}%</Text>
          </View>
          <View style={styles.dealContent}>
            <Text style={styles.dealTitle} numberOfLines={2}>{deal.title}</Text>
            <Text style={styles.dealVendor}>{deal.vendor}</Text>
            <View style={styles.dealPrices}>
              <Text style={styles.dealCurrentPrice}>{formatJerr(currentPriceJerr)}</Text>
              <Text style={styles.dealOriginalPrice}>{formatJerr(originalPriceJerr)}</Text>
            </View>
            <View style={styles.stockContainer}>
              <View style={styles.stockBar}>
                <View style={[styles.stockFill, { width: `${stockPercentage}%` }]} />
              </View>
              <Text style={styles.stockText}>{deal.stock} restants</Text>
            </View>
            <TouchableOpacity style={styles.dealButton}>
              <LinearGradient
                colors={['#FFDE59', '#FFB800']}
                style={styles.dealButtonGradient}
              >
                <Text style={styles.dealButtonText}>Acheter</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderNewProductCard = (product) => {
    const priceJerr = eurosToJerr(product.price);
    const isFavorite = favorites.has(product.id);

    return (
      <TouchableOpacity
        key={product.id}
        style={styles.newProductCard}
        onPress={() => animatePress()}
      >
        <BlurView blurAmount={15} blurType="light" style={styles.productCardBlur}>
          <View style={styles.productImageContainer}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <View style={styles.newBadge}>
              <Text style={styles.newBadgeText}>NEW</Text>
            </View>
            <TouchableOpacity
              style={styles.favoriteButton}
              onPress={() => handleFavorite(product.id)}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={20}
                color={isFavorite ? '#FF6B6B' : 'white'}
              />
            </TouchableOpacity>
            <View style={styles.viewersIndicator}>
              <Animated.View style={[styles.viewersDot, { opacity: viewersAnimation }]} />
              <Text style={styles.viewersText}>{product.viewers}</Text>
            </View>
          </View>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>{product.title}</Text>
            <Text style={styles.productVendor}>{product.vendor}</Text>
            <View style={styles.productRating}>
              {[...Array(5)].map((_, i) => (
                <Ionicons
                  key={i}
                  name="star"
                  size={12}
                  color={i < Math.floor(product.rating) ? '#FFDE59' : '#666'}
                />
              ))}
              <Text style={styles.ratingText}>{product.rating}</Text>
            </View>
            <Text style={styles.productPrice}>{formatJerr(priceJerr)}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(product)}
            >
              <LinearGradient
                colors={['#FFDE59', '#FFB800']}
                style={styles.addButtonGradient}
              >
                <Ionicons name="add" size={16} color="#0F1C3F" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  const renderRecommendationCard = (item) => {
    const priceJerr = eurosToJerr(item.price);

    return (
      <TouchableOpacity
        key={item.id}
        style={styles.recommendationCard}
        onPress={() => animatePress()}
      >
        <BlurView blurAmount={15} blurType="light" style={styles.recoCardBlur}>
          <Image source={{ uri: item.image }} style={styles.recoImage} />
          <View style={styles.recoContent}>
            <Text style={styles.recoTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.recoVendor}>{item.vendor}</Text>
            <View style={styles.recoReason}>
              <Feather name={item.reasonIcon} size={12} color="#FFDE59" />
              <Text style={styles.recoReasonText}>{item.reason}</Text>
            </View>
            <View style={styles.recoViewers}>
              <Animated.View style={[styles.viewersDot, { opacity: viewersAnimation }]} />
              <Text style={styles.recoViewersText}>{item.viewers} personnes regardent</Text>
            </View>
          </View>
          <View style={styles.recoActions}>
            <Text style={styles.recoPrice}>{formatJerr(priceJerr)}</Text>
            <TouchableOpacity
              style={styles.recoButton}
              onPress={() => handleAddToCart(item)}
            >
              <LinearGradient
                colors={['#FFDE59', '#FFB800']}
                style={styles.recoButtonGradient}
              >
                <Text style={styles.recoButtonText}>+</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Gradient de fond */}
      <LinearGradient
        colors={['#0F1C3F', '#1A2751']}
        style={styles.backgroundGradient}
      />

      {/* Header sticky */}
      <BlurView blurAmount={80} blurType="light" style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>ShopJerr</Text>
          
          <TouchableOpacity style={styles.cartButton}>
            <Feather name="shopping-cart" size={24} color="white" />
            {cartItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartItems}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
        <View style={styles.headerBorder} />
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
            placeholder="Rechercher produits…"
            placeholderTextColor="rgba(255, 255, 255, 0.6)"
            value={searchText}
            onChangeText={setSearchText}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <LinearGradient
              colors={['#FFDE59', '#FFB800']}
              style={styles.searchButtonGradient}
            >
              <Text style={styles.searchButtonText}>Chercher</Text>
            </LinearGradient>
          </TouchableOpacity>
        </BlurView>

        {/* Section Hero Vidéo */}
        <View style={styles.heroSection}>
          <BlurView blurAmount={15} blurType="light" style={styles.heroContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop&crop=center' }}
              style={styles.heroImage}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.heroOverlay}
            >
              <TouchableOpacity style={styles.playButton}>
                <BlurView blurAmount={30} blurType="light" style={styles.playButtonBlur}>
                  <Feather name="play" size={24} color="white" />
                </BlurView>
              </TouchableOpacity>
              <View style={styles.heroContent}>
                <Text style={styles.heroTitle}>Collection Hiver 2025</Text>
                <Text style={styles.heroSubtitle}>Découvrez les dernières tendances tech</Text>
                <TouchableOpacity style={styles.heroCTA}>
                  <LinearGradient
                    colors={['#FFDE59', '#FFB800']}
                    style={styles.heroCTAGradient}
                  >
                    <Text style={styles.heroCTAText}>Découvrir maintenant</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </BlurView>
        </View>

        {/* Section Flash Deals */}
        <View style={styles.flashDealsSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <Animated.View style={{ transform: [{ scale: flameAnimation }] }}>
                <MaterialCommunityIcons name="fire" size={24} color="#FF6B6B" />
              </Animated.View>
              <Text style={styles.sectionTitle}>Flash Deals</Text>
            </View>
            <View style={styles.timerContainer}>
              <Text style={styles.timerText}>
                {String(timeLeft.hours).padStart(2, '0')}:
                {String(timeLeft.minutes).padStart(2, '0')}:
                {String(timeLeft.seconds).padStart(2, '0')}
              </Text>
            </View>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.flashDealsContainer}
          >
            {flashDeals.map(renderFlashDealCard)}
          </ScrollView>
        </View>

        {/* Section Nouveautés */}
        <View style={styles.newProductsSection}>
          <Text style={styles.sectionTitle}>✨ Nouveautés</Text>
          <View style={styles.newProductsGrid}>
            {newProducts.map(renderNewProductCard)}
          </View>
        </View>

        {/* Section Recommandations */}
        <View style={styles.recommendationsSection}>
          <View style={styles.recoHeader}>
            <Text style={styles.sectionTitle}>Recommandé pour toi</Text>
            <BlurView blurAmount={20} blurType="light" style={styles.weatherWidget}>
              <Feather name="sun" size={16} color="#FFDE59" />
              <Text style={styles.weatherText}>22°C</Text>
            </BlurView>
          </View>
          <View style={styles.recommendationsContainer}>
            {recommendations.map(renderRecommendationCard)}
            <BlurView blurAmount={15} blurType="light" style={styles.algoCard}>
              <View style={styles.algoCardBorder}>
                <Text style={styles.algoTitle}>Comment ça marche ?</Text>
                <Text style={styles.algoText}>
                  Nos recommandations sont basées sur vos achats, votre localisation et les tendances actuelles.
                </Text>
              </View>
            </BlurView>
          </View>
        </View>
      </ScrollView>

      {/* FAB QR Scanner */}
      <TouchableOpacity style={styles.qrFab} onPress={handleQRScan}>
        <LinearGradient
          colors={['#FFDE59', '#FFB800']}
          style={styles.qrFabGradient}
        >
          <MaterialCommunityIcons name="qrcode-scan" size={24} color="#0F1C3F" />
        </LinearGradient>
      </TouchableOpacity>

      {/* Panier flottant conditionnel */}
      {cartItems > 0 && (
        <TouchableOpacity style={styles.floatingCart}>
          <BlurView blurAmount={30} blurType="light" style={styles.floatingCartBlur}>
            <Feather name="shopping-cart" size={20} color="white" />
            <Text style={styles.floatingCartText}>{cartItems} articles</Text>
            <Text style={styles.floatingCartPrice}>Voir le panier</Text>
          </BlurView>
        </TouchableOpacity>
      )}
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
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
    paddingBottom: 16,
    paddingHorizontal: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerBorder: {
    height: 1,
    backgroundColor: 'rgba(255, 222, 89, 0.2)',
    marginTop: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#FF6B6B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingBottom: 100,
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
    color: '#0F1C3F',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  heroSection: {
    marginHorizontal: 20,
    marginBottom: 24,
    height: screenHeight * 0.3,
  },
  heroContainer: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  heroOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 20,
  },
  playButtonBlur: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  heroSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  heroCTA: {
    borderRadius: 25,
  },
  heroCTAGradient: {
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  heroCTAText: {
    color: '#0F1C3F',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  flashDealsSection: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  timerContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  timerText: {
    color: '#FFDE59',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
  flashDealsContainer: {
    paddingHorizontal: 20,
  },
  flashDealCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  dealCardBlur: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  dealImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    margin: 12,
  },
  dealBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  dealBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  dealContent: {
    padding: 12,
    paddingTop: 0,
  },
  dealTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  dealVendor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  dealPrices: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealCurrentPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE59',
    marginRight: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  dealOriginalPrice: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textDecorationLine: 'line-through',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  stockContainer: {
    marginBottom: 12,
  },
  stockBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 2,
    marginBottom: 4,
  },
  stockFill: {
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  stockText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  dealButton: {
    borderRadius: 12,
  },
  dealButtonGradient: {
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  dealButtonText: {
    color: '#0F1C3F',
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  newProductsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  newProductsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  newProductCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  productCardBlur: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  productImageContainer: {
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  newBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#FFDE59',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  newBadgeText: {
    color: '#0F1C3F',
    fontSize: 10,
    fontWeight: 'bold',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewersIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  viewersDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4CAF50',
    marginRight: 4,
  },
  viewersText: {
    color: 'white',
    fontSize: 10,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  productVendor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingText: {
    color: 'white',
    fontSize: 12,
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE59',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  addButton: {
    alignSelf: 'flex-end',
    borderRadius: 12,
  },
  addButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recommendationsSection: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  recoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  weatherWidget: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  weatherText: {
    color: 'white',
    fontSize: 14,
    marginLeft: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  recommendationsContainer: {
    gap: 12,
  },
  recommendationCard: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  recoCardBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  recoImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  recoContent: {
    flex: 1,
  },
  recoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  recoVendor: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  recoReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  recoReasonText: {
    fontSize: 12,
    color: '#FFDE59',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  recoViewers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recoViewersText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  recoActions: {
    alignItems: 'flex-end',
  },
  recoPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE59',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  recoButton: {
    borderRadius: 12,
  },
  recoButtonGradient: {
    width: 32,
    height: 32,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recoButtonText: {
    color: '#0F1C3F',
    fontSize: 18,
    fontWeight: 'bold',
  },
  algoCard: {
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 8,
  },
  algoCardBorder: {
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 2,
    borderColor: '#FFDE59',
    borderRadius: 16,
  },
  algoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFDE59',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  algoText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Regular' : 'Poppins-Regular',
  },
  qrFab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 8,
  },
  qrFabGradient: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingCart: {
    position: 'absolute',
    bottom: 100,
    left: 20,
    right: 20,
    borderRadius: 16,
    overflow: 'hidden',
  },
  floatingCartBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  floatingCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
  floatingCartPrice: {
    color: '#FFDE59',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: Platform.OS === 'ios' ? 'Poppins-Bold' : 'Poppins-Bold',
  },
});

export default ShopJerrScreen;