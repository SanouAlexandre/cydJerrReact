import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Dimensions,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Feather, Ionicons, MaterialCommunityIcons } from 'react-native-vector-icons';
import { starJerrStyles } from '../styles/starJerrStyles';
import { starJerrTokens } from '../utils/starJerrTokens';
import starJerrService from '../services/starJerrService';
import { getCelebrityImage } from '../utils/celebrityImages';

const { width, height } = Dimensions.get('window');

const StarDetailsScreen = ({ route, navigation }) => {
  const { star } = route.params;
  const [loading, setLoading] = useState(false);
  const [tokenData, setTokenData] = useState(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadTokenData();
  }, [star]);

  const loadTokenData = async () => {
    try {
      setLoading(true);
      
      // Vérifier si la star a des tokens
      if (star.hasTokens && star.tokenInfo) {
        const tokenInfo = star.tokenInfo;
        setTokenData({
          currentPrice: tokenInfo.currentTokenPrice?.toFixed(2) || '1.00',
          totalTokens: (tokenInfo.totalTokensIssued || 100000000).toLocaleString(),
          marketCap: `${((tokenInfo.marketCap || 100000000) / 1000000).toFixed(1)}M`,
          change24h: '+2.5%', // Simulé pour l'instant
          volume24h: `${((tokenInfo.totalValueTraded || 0) / 1000000).toFixed(1)}M`,
          holders: '1,250', // Simulé pour l'instant
          totalTokensSold: (tokenInfo.totalTokensSold || 0).toLocaleString(),
          totalValueTraded: `${((tokenInfo.totalValueTraded || 0) / 1000000).toFixed(1)}M`
        });
      } else {
        // Utiliser les données de base de la star
        setTokenData({
          currentPrice: star.currentTokenPrice?.toFixed(2) || '1.00',
          totalTokens: (100000000).toLocaleString(), // 100M par défaut
          marketCap: `${((star.currentTokenPrice || 1) * 100000000 / 1000000).toFixed(1)}M`,
          change24h: '+2.5%',
          volume24h: `${((star.totalValueTraded || 0) / 1000000).toFixed(1)}M`,
          holders: '1,250',
          totalTokensSold: (star.totalTokensSold || 0).toLocaleString(),
          totalValueTraded: `${((star.totalValueTraded || 0) / 1000000).toFixed(1)}M`
        });
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données token:', error);
      // Données de fallback en cas d'erreur
      setTokenData({
        currentPrice: '1.00',
        totalTokens: '100,000,000',
        marketCap: '100M',
        change24h: '+2.5%',
        volume24h: '2.5M',
        holders: '1,250'
      });
      setLoading(false);
    }
  };

  const handleBuyTokens = () => {
    Alert.alert(
      'Acheter des tokens',
      `Voulez-vous acheter des tokens ${star.firstName} ${star.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Acheter', onPress: () => console.log('Achat de tokens') }
      ]
    );
  };

  const handleSellTokens = () => {
    Alert.alert(
      'Vendre des tokens',
      `Voulez-vous vendre des tokens ${star.firstName} ${star.lastName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Vendre', onPress: () => console.log('Vente de tokens') }
      ]
    );
  };

  const fullName = `${star.firstName} ${star.lastName}`;
  const localImage = getCelebrityImage(star.firstName, star.lastName, star.stageName);
  const imageUri = star.profileImage?.url || star.profileImage || star.images?.profile;

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: Math.max(insets.top, 20) + 10 }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        accessibilityRole="button"
        accessibilityLabel="Retour"
      >
        <Text style={{ color: starJerrTokens.colors.textWhite, fontSize: 24, fontWeight: 'bold' }}>‹</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.shareButton}>
        <Feather name="share" size={20} color={starJerrTokens.colors.textWhite} />
      </TouchableOpacity>
    </View>
  );

  const renderProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.profileImageContainer}>
        {localImage ? (
          <Image
            source={localImage}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.profileImage}
            resizeMode="cover"
          />
        ) : (
          <View style={styles.profileImagePlaceholder}>
            <Feather name="user" size={60} color={starJerrTokens.colors.textGray} />
          </View>
        )}
        
        {star.isVerified && (
          <View style={styles.verifiedBadge}>
            <Feather name="check" size={16} color={starJerrTokens.colors.textWhite} />
          </View>
        )}
      </View>
      
      <Text style={styles.starName}>{fullName}</Text>
      
      {star.stageName && star.stageName !== fullName && (
        <Text style={styles.stageName}>"{star.stageName}"</Text>
      )}
      
      <View style={styles.basicInfo}>
        {star.nationality && (
          <View style={styles.infoItem}>
            <Feather name="flag" size={16} color={starJerrTokens.colors.gold} />
            <Text style={styles.infoText}>{star.nationality}</Text>
          </View>
        )}
        
        {star.category && (
          <View style={styles.infoItem}>
            <Feather name="tag" size={16} color={starJerrTokens.colors.gold} />
            <Text style={styles.infoText}>{star.category}</Text>
          </View>
        )}
        
        {star.specialties && star.specialties.length > 0 && (
          <View style={styles.infoItem}>
            <Feather name="star" size={16} color={starJerrTokens.colors.gold} />
            <Text style={styles.infoText}>{star.specialties.join(', ')}</Text>
          </View>
        )}
      </View>
    </View>
  );

  const renderTokenSection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Informations Token</Text>
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={starJerrTokens.colors.gold} />
          <Text style={styles.loadingText}>Chargement des données token...</Text>
        </View>
      ) : tokenData ? (
        <View style={styles.tokenContainer}>
          <View style={styles.tokenHeader}>
            <View style={styles.tokenInfo}>
              <Text style={styles.tokenName}>{fullName.toUpperCase()} Token</Text>
              <Text style={styles.tokenSymbol}>({star.firstName?.substring(0, 3).toUpperCase()})</Text>
            </View>
            <View style={styles.tokenPrice}>
              <Text style={styles.priceValue}>{tokenData.currentPrice} JERR</Text>
              <Text style={[styles.priceChange, { color: tokenData.change24h.startsWith('+') ? '#4CAF50' : '#F44336' }]}>
                {tokenData.change24h}
              </Text>
            </View>
          </View>
          
          <View style={styles.tokenStats}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Tokens</Text>
                <Text style={styles.statValue}>{tokenData.totalTokens}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Market Cap</Text>
                <Text style={styles.statValue}>{tokenData.marketCap} JERR</Text>
              </View>
            </View>
            
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Volume 24h</Text>
                <Text style={styles.statValue}>{tokenData.volume24h} JERR</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Holders</Text>
                <Text style={styles.statValue}>{tokenData.holders}</Text>
              </View>
            </View>
          </View>
          
          <View style={styles.tokenActions}>
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyTokens}>
              <MaterialCommunityIcons name="trending-up" size={20} color={starJerrTokens.colors.textWhite} />
              <Text style={styles.buyButtonText}>Acheter</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sellButton} onPress={handleSellTokens}>
              <MaterialCommunityIcons name="trending-down" size={20} color={starJerrTokens.colors.textWhite} />
              <Text style={styles.sellButtonText}>Vendre</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.noTokenContainer}>
          <MaterialCommunityIcons name="currency-usd-circle" size={48} color={starJerrTokens.colors.textGray} />
          <Text style={styles.noTokenText}>Aucun token disponible</Text>
        </View>
      )}
    </View>
  );

  const renderBiographySection = () => (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Biographie</Text>
      <Text style={styles.biographyText}>
        {star.bio || star.biography || 'Aucune biographie disponible pour cette célébrité.'}
      </Text>
    </View>
  );

  const renderSocialMediaSection = () => {
    if (!star.socialMedia) return null;
    
    const socialPlatforms = Object.entries(star.socialMedia).filter(([key, value]) => value && value.url);
    
    if (socialPlatforms.length === 0) return null;
    
    return (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Réseaux Sociaux</Text>
        <View style={styles.socialContainer}>
          {socialPlatforms.map(([platform, data]) => (
            <TouchableOpacity key={platform} style={styles.socialItem}>
              <View style={styles.socialIcon}>
                <MaterialCommunityIcons 
                  name={platform === 'instagram' ? 'instagram' : platform === 'twitter' ? 'twitter' : platform === 'facebook' ? 'facebook' : 'web'} 
                  size={24} 
                  color={starJerrTokens.colors.gold} 
                />
              </View>
              <View style={styles.socialInfo}>
                <Text style={styles.socialPlatform}>{platform.charAt(0).toUpperCase() + platform.slice(1)}</Text>
                <Text style={styles.socialFollowers}>
                  {data.followers ? `${(data.followers / 1000000).toFixed(1)}M followers` : 'Voir le profil'}
                </Text>
              </View>
              <Feather name="external-link" size={16} color={starJerrTokens.colors.textGray} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={[starJerrTokens.colors.bgStart, starJerrTokens.colors.bgEnd]}
        style={styles.gradient}
      >
        {renderHeader()}
        
        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderProfileSection()}
          {renderTokenSection()}
          {renderBiographySection()}
          {renderSocialMediaSection()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: starJerrTokens.colors.bgStart,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: starJerrTokens.spacing.s16,
    paddingBottom: starJerrTokens.spacing.s12,
    position: 'relative',
    zIndex: 10,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${starJerrTokens.colors.textWhite}15`,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  shareButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: `${starJerrTokens.colors.textWhite}15`,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: starJerrTokens.spacing.s32,
  },
  profileSection: {
    alignItems: 'center',
    paddingHorizontal: starJerrTokens.spacing.s16,
    paddingVertical: starJerrTokens.spacing.s24,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: starJerrTokens.spacing.s16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: starJerrTokens.colors.gold,
  },
  profileImagePlaceholder: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: `${starJerrTokens.colors.textWhite}10`,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: starJerrTokens.colors.gold,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: starJerrTokens.colors.gold,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: starJerrTokens.colors.bgStart,
  },
  starName: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.textWhite,
    textAlign: 'center',
    marginBottom: starJerrTokens.spacing.s4,
  },
  stageName: {
    fontSize: 18,
    fontFamily: 'Poppins-Medium',
    color: starJerrTokens.colors.gold,
    textAlign: 'center',
    marginBottom: starJerrTokens.spacing.s16,
    fontStyle: 'italic',
  },
  basicInfo: {
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: starJerrTokens.spacing.s8,
  },
  infoText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginLeft: starJerrTokens.spacing.s8,
  },
  section: {
    marginHorizontal: starJerrTokens.spacing.s16,
    marginBottom: starJerrTokens.spacing.s24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
    marginBottom: starJerrTokens.spacing.s16,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: starJerrTokens.spacing.s32,
  },
  loadingText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginTop: starJerrTokens.spacing.s8,
  },
  tokenContainer: {
    backgroundColor: `${starJerrTokens.colors.textWhite}05`,
    borderRadius: starJerrTokens.radius.r16,
    padding: starJerrTokens.spacing.s16,
    borderWidth: 1,
    borderColor: `${starJerrTokens.colors.gold}30`,
  },
  tokenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: starJerrTokens.spacing.s16,
  },
  tokenInfo: {
    flex: 1,
  },
  tokenName: {
    fontSize: 18,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
  },
  tokenSymbol: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
  tokenPrice: {
    alignItems: 'flex-end',
  },
  priceValue: {
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
    color: starJerrTokens.colors.gold,
  },
  priceChange: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
  },
  tokenStats: {
    marginBottom: starJerrTokens.spacing.s16,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: starJerrTokens.spacing.s12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginBottom: starJerrTokens.spacing.s4,
  },
  statValue: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
  },
  tokenActions: {
    flexDirection: 'row',
    gap: starJerrTokens.spacing.s12,
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: starJerrTokens.colors.gold,
    paddingVertical: starJerrTokens.spacing.s12,
    borderRadius: starJerrTokens.radius.r8,
    gap: starJerrTokens.spacing.s8,
  },
  buyButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.textWhite,
  },
  sellButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: starJerrTokens.colors.gold,
    paddingVertical: starJerrTokens.spacing.s12,
    borderRadius: starJerrTokens.radius.r8,
    gap: starJerrTokens.spacing.s8,
  },
  sellButtonText: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: starJerrTokens.colors.gold,
  },
  noTokenContainer: {
    alignItems: 'center',
    paddingVertical: starJerrTokens.spacing.s32,
  },
  noTokenText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    marginTop: starJerrTokens.spacing.s8,
  },
  biographyText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
    lineHeight: 24,
  },
  socialContainer: {
    gap: starJerrTokens.spacing.s12,
  },
  socialItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${starJerrTokens.colors.textWhite}05`,
    padding: starJerrTokens.spacing.s12,
    borderRadius: starJerrTokens.radius.r8,
    borderWidth: 1,
    borderColor: `${starJerrTokens.colors.gold}20`,
  },
  socialIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${starJerrTokens.colors.gold}20`,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: starJerrTokens.spacing.s12,
  },
  socialInfo: {
    flex: 1,
  },
  socialPlatform: {
    fontSize: 16,
    fontFamily: 'Poppins-Medium',
    color: starJerrTokens.colors.textWhite,
  },
  socialFollowers: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: starJerrTokens.colors.textGray,
  },
};

export default StarDetailsScreen;