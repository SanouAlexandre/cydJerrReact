import React, { useEffect, useRef } from 'react';
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
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSelector, useDispatch } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { setQuery } from '../redux/starJerrSlice';
import { starJerrStyles } from '../styles/starJerrStyles';
import { starJerrTokens } from '../utils/starJerrTokens';

const { width } = Dimensions.get('window');

// Composant Header
const SJHeader = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { height: SCREEN_HEIGHT } = Dimensions.get('window');
  
  const handleCreateToken = () => {
    navigation?.navigate('StarTokens');
  };

  // Calcul dynamique du padding top pour éviter les zones inaccessibles
  const dynamicPaddingTop = Platform.select({
    ios: Math.max(insets.top + 10, 50), // Minimum 50px pour iOS
    android: Math.max(insets.top + 15, 35), // Minimum 35px pour Android
  });

  // Ajustement pour les petits écrans (Samsung S20 et similaires)
  const adjustedPaddingTop = SCREEN_HEIGHT < 700 ? dynamicPaddingTop + 10 : dynamicPaddingTop;

  return (
    <View style={[starJerrStyles.header, { paddingTop: adjustedPaddingTop }]}>
      <View style={starJerrStyles.headerTop}>
        <TouchableOpacity
          style={starJerrStyles.backButton}
          onPress={() => navigation?.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Retour"
        >
          <Text style={{ color: starJerrTokens.colors.textWhite, fontSize: 20, fontWeight: 'bold' }}>‹</Text>
        </TouchableOpacity>
        
        <View style={starJerrStyles.headerCenter}>
          <View style={starJerrStyles.logoContainer}>
            <Text style={starJerrStyles.starIcon}>⭐</Text>
            <Text style={starJerrStyles.headerTitle}>StarJerr</Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={starJerrStyles.createTokenButton}
          onPress={handleCreateToken}
          accessibilityRole="button"
          accessibilityLabel="Créer un StarToken"
        >
          <Feather name="plus" size={20} color={starJerrTokens.colors.textWhite} />
          <Text style={starJerrStyles.createTokenText}>Token</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={starJerrStyles.headerSubtitle}>
        Tokenisation de célébrités • Échangez contre JERRCOIN
      </Text>
    </View>
  );
};

// Composant Market Stats
const SJMarketStats = () => {
  const metrics = useSelector(state => state.starJerr.metrics);
  
  const statsData = [
    { icon: 'trending-up', value: metrics.marketCap, label: 'Market Cap' },
    { icon: 'users', value: metrics.users, label: 'Habitants' },
    { icon: 'star', value: metrics.volume24h, label: 'Volume 24h' },
  ];
  
  return (
    <View style={starJerrStyles.statsContainer}>
      {statsData.map((stat, index) => (
        <View key={index} style={starJerrStyles.statCard}>
          <Feather name={stat.icon} size={20} color={starJerrTokens.colors.gold} />
          <Text style={starJerrStyles.statValue}>{stat.value}</Text>
          <Text style={starJerrStyles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};

// Composant Search Bar
const SJSearchBar = () => {
  const dispatch = useDispatch();
  const query = useSelector(state => state.starJerr.query);
  
  return (
    <View style={starJerrStyles.searchContainer}>
      <Feather 
        name="search" 
        size={20} 
        color={starJerrTokens.colors.textGray} 
        style={starJerrStyles.searchIcon}
      />
      <TextInput
        style={starJerrStyles.searchInput}
        placeholder="Rechercher une célébrité…"
        placeholderTextColor={starJerrTokens.colors.textGray}
        value={query}
        onChangeText={(text) => dispatch(setQuery(text))}
        accessibilityLabel="Rechercher une célébrité"
      />
    </View>
  );
};

// Composant Category Grid
const SJCategoryGrid = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories, query } = useSelector(state => state.starJerr);
  
  // Filtrage des catégories
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(query.toLowerCase())
  );
  
  const CategoryItem = ({ item, navigation }) => {
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
    
    const handlePress = () => {
      console.log('open category', item.id);
      navigation?.navigate('CategoryDetails', { category: item });
    };
    
    return (
      <Animated.View style={[starJerrStyles.categoryCard, { transform: [{ scale: scaleAnim }] }]}>
        <TouchableOpacity
          onPress={handlePress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          accessibilityRole="button"
          accessibilityLabel={`Catégorie ${item.name}, ${item.count} célébrités`}
          style={starJerrStyles.categoryContent}
        >
          <Text style={starJerrStyles.categoryEmoji}>{item.emoji}</Text>
          <Text style={starJerrStyles.categoryName}>{item.name}</Text>
          <Text style={starJerrStyles.categoryCount}>{item.count} célébrités</Text>
          
          {item.hasTokens && (
            <View style={starJerrStyles.tokenBadge}>
              <Text style={starJerrStyles.tokenBadgeText}>StarTokens disponibles</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };
  
  return (
    <View style={starJerrStyles.gridContainer}>
      <Text style={starJerrStyles.sectionTitle}>Catégories de célébrités</Text>
      <FlatList
        data={filteredCategories}
        renderItem={({ item }) => <CategoryItem item={item} navigation={navigation} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={starJerrStyles.gridRow}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={starJerrStyles.gridContent}
      />
    </View>
  );
};

// Composant principal StarJerr
const StarJerrScreen = ({ navigation }) => {
  // Animations d'entrée
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(30)).current;
  
  useEffect(() => {
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
  }, []);
  
  return (
    <LinearGradient
      colors={[starJerrTokens.colors.bgStart, starJerrTokens.colors.bgEnd]}
      style={starJerrStyles.container}
    >
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={starJerrStyles.safeArea}>
        <Animated.View 
          style={[
            starJerrStyles.content,
            {
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
            },
          ]}
        >
          <SJHeader navigation={navigation} />
          <SJMarketStats />
          <SJSearchBar />
          <SJCategoryGrid navigation={navigation} />
        </Animated.View>
      </SafeAreaView>
    </LinearGradient>
  );
};

export default StarJerrScreen;