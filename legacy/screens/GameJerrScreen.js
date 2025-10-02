import React, { useState, useRef, useEffect } from 'react';
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
  FlatList,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { formatJerr } from '../utils/price';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Données mockées pour les jeux populaires
const mockPopularGames = [
  {
    id: 1,
    title: 'Cyber Jerr 2077',
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300',
    price: 5999, // 59.99 Jerr
    players: '2.4M',
    isLive: true,
    rating: 4.8,
    genre: 'RPG',
  },
  {
    id: 2,
    title: 'JerrCraft Universe',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300',
    price: 2999, // 29.99 Jerr
    players: '15.7M',
    isLive: true,
    rating: 4.9,
    genre: 'Sandbox',
  },
  {
    id: 3,
    title: 'Battle Jerr Royale',
    image: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300',
    price: 0, // Gratuit
    players: '89.2M',
    isLive: true,
    rating: 4.6,
    genre: 'Battle Royale',
  },
  {
    id: 4,
    title: 'Jerr Racing Pro',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=300',
    price: 3999, // 39.99 Jerr
    players: '5.1M',
    isLive: false,
    rating: 4.7,
    genre: 'Racing',
  },
];

// Données mockées pour les streams en direct
const mockLiveStreams = [
  {
    id: 1,
    streamer: 'JerrGamer_Pro',
    game: 'Cyber Jerr 2077',
    viewers: 12547,
    duration: '3h 24m',
    thumbnail: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=300',
    isLive: true,
  },
  {
    id: 2,
    streamer: 'MegaJerr_Stream',
    game: 'JerrCraft Universe',
    viewers: 8932,
    duration: '1h 45m',
    thumbnail: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=300',
    isLive: true,
  },
  {
    id: 3,
    streamer: 'ProJerr_Gaming',
    game: 'Battle Jerr Royale',
    viewers: 25678,
    duration: '5h 12m',
    thumbnail: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=300',
    isLive: true,
  },
];

// Données mockées pour trending gaming
const mockTrendingTopics = [
  {
    id: 1,
    title: 'Nouveau DLC Cyber Jerr disponible',
    discussions: 1247,
    trend: 'up',
    category: 'News',
  },
  {
    id: 2,
    title: 'Tournoi JerrCraft Championship',
    discussions: 892,
    trend: 'up',
    category: 'Esports',
  },
  {
    id: 3,
    title: 'Mise à jour Battle Jerr saison 12',
    discussions: 2156,
    trend: 'hot',
    category: 'Updates',
  },
  {
    id: 4,
    title: 'Guide stratégie Jerr Racing Pro',
    discussions: 567,
    trend: 'up',
    category: 'Guides',
  },
];

const GameJerrScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Accueil');
  const [searchQuery, setSearchQuery] = useState('');
  const [scaleAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef(null);

  const tabs = ['Accueil', 'Jeux', 'Streams', 'Esports', 'Communauté'];

  const handleTabPress = (tab) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 75,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 75,
        useNativeDriver: true,
      }),
    ]).start();
    setActiveTab(tab);
  };

  const formatViewers = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const Header = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="chevron-back" size={24} color="white" />
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle}>GameJerr</Text>
      </View>
      
      <View style={styles.statusIcon}>
        <MaterialCommunityIcons name="gamepad-variant" size={20} color="#0F1C3F" />
      </View>
    </View>
  );

  const TabBar = () => (
    <View style={styles.tabBar}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContainer}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tab,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => handleTabPress(tab)}
          >
            <MaterialCommunityIcons
              name={
                tab === 'Accueil' ? 'home' :
                tab === 'Jeux' ? 'gamepad-variant' :
                tab === 'Streams' ? 'video' :
                tab === 'Esports' ? 'trophy' : 'account-group'
              }
              size={16}
              color={activeTab === tab ? '#0F1C3F' : 'white'}
            />
            <Text style={[
              styles.tabText,
              activeTab === tab && styles.activeTabText,
            ]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const HeroSection = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.heroSection}>
      <LinearGradient
        colors={['rgba(255, 222, 89, 0.1)', 'rgba(255, 222, 89, 0.05)']}
        style={styles.heroGradient}
      >
        <Text style={styles.heroTitle}>Bienvenue dans GameJerr</Text>
        <Text style={styles.heroSubtitle}>
          Découvrez, jouez et partagez vos jeux préférés
        </Text>
        
        <View style={styles.heroStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2.4M</Text>
            <Text style={styles.statLabel}>Joueurs actifs</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>15K</Text>
            <Text style={styles.statLabel}>Jeux disponibles</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>892</Text>
            <Text style={styles.statLabel}>Streams live</Text>
          </View>
        </View>
      </LinearGradient>
    </BlurView>
  );

  const PopularGamesCarousel = () => (
    <View style={styles.carouselSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="fire" size={20} color="#FFDE59" />
        <Text style={styles.sectionTitle}>Jeux Populaires</Text>
      </View>
      
      <FlatList
        data={mockPopularGames}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.carouselContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[
            styles.gameCard,
            { marginLeft: index === 0 ? 20 : 0 }
          ]}>
            <BlurView blurAmount={15} blurType="light" style={styles.gameCardBlur}>
              <Image source={{ uri: item.image }} style={styles.gameImage} />
              <View style={styles.gameInfo}>
                <Text style={styles.gameTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={styles.gameGenre}>{item.genre}</Text>
                
                <View style={styles.gameMetadata}>
                  <View style={styles.gamePlayers}>
                    <MaterialCommunityIcons name="account-group" size={12} color="#FFDE59" />
                    <Text style={styles.gamePlayersText}>{item.players}</Text>
                  </View>
                  {item.isLive && (
                    <View style={styles.liveBadge}>
                      <Text style={styles.liveText}>LIVE</Text>
                    </View>
                  )}
                </View>
                
                <View style={styles.gamePrice}>
                  <Text style={styles.priceText}>
                    {item.price === 0 ? 'Gratuit' : formatJerr(item.price)}
                  </Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const LiveStreamsCarousel = () => (
    <View style={styles.carouselSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="video" size={20} color="#FF4757" />
        <Text style={styles.sectionTitle}>Streams en Direct</Text>
      </View>
      
      <FlatList
        data={mockLiveStreams}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.carouselContainer}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[
            styles.streamCard,
            { marginLeft: index === 0 ? 20 : 0 }
          ]}>
            <BlurView blurAmount={15} blurType="light" style={styles.streamCardBlur}>
              <View style={styles.streamThumbnailContainer}>
                <Image source={{ uri: item.thumbnail }} style={styles.streamThumbnail} />
                <View style={styles.streamOverlay}>
                  <View style={styles.liveBadgeStream}>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveTextStream}>LIVE</Text>
                  </View>
                  <Text style={styles.streamDuration}>{item.duration}</Text>
                </View>
              </View>
              
              <View style={styles.streamInfo}>
                <Text style={styles.streamerName} numberOfLines={1}>{item.streamer}</Text>
                <Text style={styles.streamGame} numberOfLines={1}>{item.game}</Text>
                
                <View style={styles.streamViewers}>
                  <MaterialCommunityIcons name="eye" size={12} color="#FFDE59" />
                  <Text style={styles.viewersText}>{formatViewers(item.viewers)} viewers</Text>
                </View>
              </View>
            </BlurView>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  const TrendingSection = () => (
    <View style={styles.trendingSection}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="trending-up" size={20} color="#10B981" />
        <Text style={styles.sectionTitle}>Trending Gaming</Text>
      </View>
      
      {mockTrendingTopics.map((topic) => (
        <TouchableOpacity key={topic.id} style={styles.trendingItem}>
          <BlurView blurAmount={10} blurType="light" style={styles.trendingItemBlur}>
            <View style={styles.trendingContent}>
              <View style={styles.trendingLeft}>
                <Text style={styles.trendingTitle} numberOfLines={2}>{topic.title}</Text>
                <View style={styles.trendingMeta}>
                  <Text style={styles.trendingCategory}>{topic.category}</Text>
                  <Text style={styles.trendingDiscussions}>{topic.discussions} discussions</Text>
                </View>
              </View>
              
              <View style={styles.trendingRight}>
                <MaterialCommunityIcons
                  name={topic.trend === 'hot' ? 'fire' : 'trending-up'}
                  size={20}
                  color={topic.trend === 'hot' ? '#FF4757' : '#10B981'}
                />
              </View>
            </View>
          </BlurView>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Accueil':
        return (
          <>
            <HeroSection />
            <PopularGamesCarousel />
            <LiveStreamsCarousel />
            <TrendingSection />
          </>
        );
      case 'Jeux':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Bibliothèque de Jeux</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Streams':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Tous les Streams</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Esports':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Compétitions Esports</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Communauté':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Communauté GameJerr</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#8A2D6C', '#723072', '#2D747E', '#1D7CA6']}
        style={styles.background}
      >
        <Header />
        <TabBar />
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.content}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {renderContent()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  header: {
    height: 72,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 44 : StatusBar.currentHeight || 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textShadowColor: '#FFDE59',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 16,
    backgroundColor: '#FFDE59',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabScrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    height: 60,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeTab: {
    backgroundColor: '#FFDE59',
    transform: [{ scale: 1.05 }],
    shadowColor: '#FFDE59',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    marginLeft: 6,
  },
  activeTabText: {
    color: '#0F1C3F',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  heroSection: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  heroGradient: {
    padding: 24,
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 8,
    textShadowColor: '#FFDE59',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  heroSubtitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
  },
  heroStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: '#FFDE59',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginTop: 4,
  },
  carouselSection: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginLeft: 8,
  },
  carouselContainer: {
    paddingRight: 20,
  },
  gameCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  gameCardBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  gameImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  gameInfo: {
    padding: 12,
  },
  gameTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 4,
  },
  gameGenre: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 8,
  },
  gameMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  gamePlayers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gamePlayersText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#FFDE59',
    marginLeft: 4,
  },
  liveBadge: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  liveText: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  gamePrice: {
    alignItems: 'flex-start',
  },
  priceText: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFDE59',
  },
  streamCard: {
    width: 180,
    marginRight: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  streamCardBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 16,
    overflow: 'hidden',
  },
  streamThumbnailContainer: {
    position: 'relative',
  },
  streamThumbnail: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  streamOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  liveBadgeStream: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 71, 87, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    marginRight: 4,
  },
  liveTextStream: {
    fontSize: 10,
    fontFamily: 'Poppins-Bold',
    color: 'white',
  },
  streamDuration: {
    fontSize: 10,
    fontFamily: 'Poppins-Medium',
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 8,
  },
  streamInfo: {
    padding: 12,
  },
  streamerName: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 4,
  },
  streamGame: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 6,
  },
  streamViewers: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewersText: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: '#FFDE59',
    marginLeft: 4,
  },
  trendingSection: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  trendingItem: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  trendingItemBlur: {
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
  trendingContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  trendingLeft: {
    flex: 1,
  },
  trendingTitle: {
    fontSize: 14,
    fontFamily: 'Poppins-SemiBold',
    color: 'white',
    marginBottom: 6,
  },
  trendingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendingCategory: {
    fontSize: 11,
    fontFamily: 'Poppins-Medium',
    color: '#FFDE59',
    marginRight: 12,
  },
  trendingDiscussions: {
    fontSize: 11,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  trendingRight: {
    marginLeft: 12,
  },
  tabContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  tabContentTitle: {
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
  tabContentText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
});

export default GameJerrScreen;