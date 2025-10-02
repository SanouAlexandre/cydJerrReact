import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Feather, Ionicons } from 'react-native-vector-icons';
import { starJerrStyles } from '../styles/starJerrStyles';
import { starJerrTokens } from '../utils/starJerrTokens';
import starJerrService from '../services/starJerrService';
import { getCelebrityImage } from '../utils/celebrityImages';

const CategoryDetailsScreen = ({ route, navigation }) => {
  const { category } = route.params;
  const [stars, setStars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const shimmerAnimation = new Animated.Value(0);

  useEffect(() => {
    loadCategoryStars();
    
    // Animation shimmer pour l'effet futuriste
    const shimmerLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnimation, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    shimmerLoop.start();
    
    return () => shimmerLoop.stop();
  }, [category]);

  const loadCategoryStars = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔍 CategoryDetails - Début du chargement pour:', category.name);
      
      // Mapper les noms de catégories vers les clés du backend
      const categoryMapping = {
        'Footballeurs': 'footballeurs',
        'Acteurs': 'acteurs',
        'Musiciens': 'musiciens',
        'Pilotes MotoGP': 'pilotes-motogp',
        'Arts Martiaux': 'arts-martiaux',
        'Réalisateurs': 'realisateurs',
        'Écrivains': 'ecrivains',
        'Chefs Cuisiniers': 'chefs-cuisiniers'
      };
      
      const backendCategory = categoryMapping[category.name] || category.name.toLowerCase();
      console.log('🔍 CategoryDetails - Catégorie backend:', backendCategory);
      
      const data = await starJerrService.getStarsByCategory(backendCategory);
      
      // Vérifier que data est un tableau
      if (!Array.isArray(data)) {
        console.error('Les données reçues ne sont pas un tableau:', data);
        setStars([]);
        return;
      }
      
      // Filtrer par spécialité si nécessaire
      let filteredData = data;
      
      if (category.name === 'Footballeurs') {
        filteredData = data.filter(star => {
          // Vérifier dans les subcategories (tous les footballeurs ont subcategories: ['Football'])
          const hasFootballSubcategory = star.subcategories && star.subcategories.includes('Football');
          // Vérifier dans les specialties (optionnel)
          const hasFootballSpecialty = star.specialties && star.specialties.includes('Football');
          return hasFootballSubcategory || hasFootballSpecialty;
        });
      } else if (category.name === 'Pilotes MotoGP') {
        filteredData = data.filter(star => 
          star.specialties && star.specialties.includes('MotoGP')
        );
      } else if (category.name === 'Arts Martiaux') {
        filteredData = data.filter(star => 
          star.specialties && star.specialties.some(spec => 
            ['Karaté', 'Judo', 'Taekwondo', 'Boxe', 'MMA'].includes(spec)
          )
        );
      }
      
      setStars(filteredData);
    } catch (err) {
      console.error('Erreur lors du chargement des stars:', err);
      setError('Erreur lors du chargement des célébrités');
    } finally {
      setLoading(false);
    }
  };

  const handleStarPress = (star) => {
    navigation.navigate('StarDetails', { star });
  };

  const renderStarItem = ({ item }) => {
    const fullName = `${item.firstName} ${item.lastName}`;
    const localImage = getCelebrityImage(item.firstName, item.lastName, item.stageName);
    const imageUri = item.profileImage?.url || item.profileImage || item.images?.profile;
    
    const shimmerOpacity = shimmerAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.8],
    });
    
    return (
      <TouchableOpacity
        style={starJerrStyles.starCard}
        onPress={() => handleStarPress(item)}
        accessibilityRole="button"
        accessibilityLabel={`Célébrité ${fullName}`}
      >
        {/* Effet shimmer de fond */}
        <Animated.View
          style={[
            {
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: shimmerOpacity,
              borderRadius: starJerrTokens.radius.r16,
            }
          ]}
        >
          <LinearGradient
            colors={['transparent', starJerrTokens.colors.shimmer, 'transparent']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, borderRadius: starJerrTokens.radius.r16 }}
          />
        </Animated.View>
        
        <View style={starJerrStyles.starImageContainer}>
          {localImage ? (
            <Image
              source={localImage}
              style={starJerrStyles.starImage}
              resizeMode="cover"
            />
          ) : imageUri ? (
            <Image
              source={{ uri: imageUri }}
              style={starJerrStyles.starImage}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={starJerrTokens.gradients.glass}
              style={starJerrStyles.starImagePlaceholder}
            >
              <Feather name="user" size={40} color={starJerrTokens.colors.textMuted} />
            </LinearGradient>
          )}
          
          {item.isVerified && (
            <View style={starJerrStyles.verifiedBadge}>
              <Feather name="check" size={12} color={starJerrTokens.colors.textWhite} />
            </View>
          )}
        </View>
        
        <LinearGradient
          colors={starJerrTokens.gradients.card}
          style={starJerrStyles.starInfo}
        >
          <Text style={starJerrStyles.starName} numberOfLines={1}>
            {fullName}
          </Text>
          
          {item.nationality && (
            <Text style={starJerrStyles.starNationality} numberOfLines={1}>
              {item.nationality}
            </Text>
          )}
          
          {item.specialties && item.specialties.length > 0 && (
            <Text style={starJerrStyles.starSpecialty} numberOfLines={1}>
              {item.specialties[0]}
            </Text>
          )}
          
          {item.starTokens && item.starTokens.currentPrice && (
            <View style={starJerrStyles.tokenPriceContainer}>
              <Text style={starJerrStyles.tokenPrice}>
                {item.starTokens.currentPrice} JERR
              </Text>
              <View style={starJerrStyles.tokenAvailableBadge}>
                <Text style={starJerrStyles.tokenAvailableText}>Token</Text>
              </View>
            </View>
          )}
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <LinearGradient
      colors={starJerrTokens.gradients.overlay}
      style={starJerrStyles.categoryHeader}
    >
      <TouchableOpacity
        style={[starJerrStyles.backButton, { zIndex: 1000 }]}
        onPress={() => {
          console.log('Bouton retour pressé');
          navigation.goBack();
        }}
        accessibilityRole="button"
        accessibilityLabel="Retour"
        activeOpacity={0.7}
      >
        <Text style={{ color: starJerrTokens.colors.textWhite, fontSize: 24, fontWeight: 'bold' }}>‹</Text>
      </TouchableOpacity>
      
      <View style={starJerrStyles.categoryHeaderContent}>
        <Text style={starJerrStyles.categoryHeaderEmoji}>{category.emoji}</Text>
        <Text style={starJerrStyles.categoryHeaderTitle}>{category.name}</Text>
        <Text style={starJerrStyles.categoryHeaderCount}>
          {stars.length} célébrité{stars.length > 1 ? 's' : ''}
        </Text>
      </View>
    </LinearGradient>
  );

  const renderEmptyState = () => (
    <View style={starJerrStyles.emptyStateContainer}>
      <Feather name="users" size={60} color={starJerrTokens.colors.textGray} />
      <Text style={starJerrStyles.emptyStateTitle}>
        Aucune célébrité trouvée
      </Text>
      <Text style={starJerrStyles.emptyStateSubtitle}>
        Cette catégorie ne contient pas encore de célébrités.
      </Text>
      <TouchableOpacity
        style={starJerrStyles.retryButton}
        onPress={loadCategoryStars}
      >
        <Text style={starJerrStyles.retryButtonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={starJerrStyles.errorStateContainer}>
      <Feather name="alert-circle" size={60} color={starJerrTokens.colors.error} />
      <Text style={starJerrStyles.errorStateTitle}>Erreur de chargement</Text>
      <Text style={starJerrStyles.errorStateSubtitle}>{error}</Text>
      <TouchableOpacity
        style={starJerrStyles.retryButton}
        onPress={loadCategoryStars}
      >
        <Text style={starJerrStyles.retryButtonText}>Réessayer</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={starJerrStyles.container}>
      <StatusBar barStyle="light-content" backgroundColor={starJerrTokens.colors.primary} />
      
      <LinearGradient
        colors={starJerrTokens.gradients.primary}
        locations={[0, 1]}
        style={starJerrStyles.gradient}
      >
        {renderHeader()}
        
        {loading ? (
          <View style={starJerrStyles.loadingContainer}>
            <ActivityIndicator size="large" color={starJerrTokens.colors.gold} />
            <Text style={starJerrStyles.loadingText}>Chargement des célébrités...</Text>
          </View>
        ) : error ? (
          renderErrorState()
        ) : stars.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={stars}
            renderItem={renderStarItem}
            keyExtractor={(item) => item._id || item.id}
            numColumns={2}
            columnWrapperStyle={starJerrStyles.starsGridRow}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={starJerrStyles.starsGridContent}
          />
        )}
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CategoryDetailsScreen;