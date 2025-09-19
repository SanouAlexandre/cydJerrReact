import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Platform,
  FlatList,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons, MaterialIcons } from 'react-native-vector-icons';
import { useFonts } from 'expo-font';

const { width, height } = Dimensions.get('window');
const isTablet = width > 768;

const NewsJerrScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    'Poppins-Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Poppins-Bold': require('../assets/fonts/Poppins-Bold.ttf'),
  });

  const [activeCategory, setActiveCategory] = useState('À la Une');
  const [showActionSheet, setShowActionSheet] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  const categories = [
    'À la Une',
    'Monde',
    'Business',
    'Tech',
    'Sport',
    'Culture',
    'Santé',
    'Science'
  ];

  const newsArticles = [
    {
      id: 1,
      title: 'Innovation technologique : L\'IA révolutionne l\'industrie',
      excerpt: 'Les dernières avancées en intelligence artificielle transforment radicalement notre façon de travailler...',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop',
      category: 'Tech',
      time: '2h',
      author: 'TechExpert'
    },
    {
      id: 2,
      title: 'Économie mondiale : Nouvelles perspectives pour 2024',
      excerpt: 'Les analystes prévoient une croissance stable malgré les défis géopolitiques actuels...',
      image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop',
      category: 'Business',
      time: '4h',
      author: 'EcoAnalyst'
    },
    {
      id: 3,
      title: 'Sport : Championnat mondial de football',
      excerpt: 'Les équipes se préparent pour la compétition la plus attendue de l\'année...',
      image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=250&fit=crop',
      category: 'Sport',
      time: '6h',
      author: 'SportNews'
    },
    {
      id: 4,
      title: 'Découverte scientifique majeure en astronomie',
      excerpt: 'Une nouvelle exoplanète potentiellement habitable découverte à 22 années-lumière...',
      image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=250&fit=crop',
      category: 'Science',
      time: '8h',
      author: 'SpaceExplorer'
    }
  ];

  const trendingTopics = [
    { id: 1, topic: '#Innovation2024', count: '12.5K' },
    { id: 2, topic: '#TechTrends', count: '8.9K' },
    { id: 3, topic: '#GlobalEconomy', count: '6.2K' },
    { id: 4, topic: '#ClimateAction', count: '4.8K' },
    { id: 5, topic: '#DigitalTransform', count: '3.1K' }
  ];

  const topNewsers = [
    { id: 1, name: 'Alex Chen', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', followers: '125K' },
    { id: 2, name: 'Sarah Kim', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face', followers: '98K' },
    { id: 3, name: 'Marcus Johnson', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face', followers: '87K' },
    { id: 4, name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', followers: '76K' }
  ];

  const toggleActionSheet = () => {
    if (showActionSheet) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        })
      ]).start(() => setShowActionSheet(false));
    } else {
      setShowActionSheet(true);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();
    }
  };

  const renderNewsCard = ({ item }) => (
    <TouchableOpacity style={styles.newsCard} activeOpacity={0.8}>
      <BlurView blurAmount={20} blurType="light" style={styles.newsCardBlur}>
        <Image source={{ uri: item.image }} style={styles.newsImage} />
        <View style={styles.newsContent}>
          <View style={styles.newsHeader}>
            <Text style={styles.newsCategory}>{item.category}</Text>
            <Text style={styles.newsTime}>{item.time}</Text>
          </View>
          <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
          <Text style={styles.newsExcerpt} numberOfLines={3}>{item.excerpt}</Text>
          <View style={styles.newsFooter}>
            <Text style={styles.newsAuthor}>Par {item.author}</Text>
            <View style={styles.newsActions}>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="heart-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="share-outline" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </BlurView>
    </TouchableOpacity>
  );

  const renderTrendingWidget = () => (
    <View style={styles.widget}>
      <BlurView blurAmount={20} blurType="light" style={styles.widgetBlur}>
        <Text style={styles.widgetTitle}>🔥 Tendances</Text>
        {trendingTopics.map((item) => (
          <TouchableOpacity key={item.id} style={styles.trendingItem}>
            <Text style={styles.trendingTopic}>{item.topic}</Text>
            <Text style={styles.trendingCount}>{item.count}</Text>
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );

  const renderTopNewsersWidget = () => (
    <View style={styles.widget}>
      <BlurView blurAmount={20} blurType="light" style={styles.widgetBlur}>
        <Text style={styles.widgetTitle}>⭐ Top Newsers</Text>
        {topNewsers.map((item) => (
          <TouchableOpacity key={item.id} style={styles.newserItem}>
            <Image source={{ uri: item.avatar }} style={styles.newserAvatar} />
            <View style={styles.newserInfo}>
              <Text style={styles.newserName}>{item.name}</Text>
              <Text style={styles.newserFollowers}>{item.followers} followers</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Suivre</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </BlurView>
    </View>
  );

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      <LinearGradient
        colors={['#0F1C3F', '#2D4A7B', '#1A365D']}
        style={styles.background}
      >
        {/* Header */}
        <BlurView blurAmount={30} blurType="light" style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>NewsJerr</Text>
            <TouchableOpacity style={styles.menuButton}>
              <Ionicons name="menu" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </BlurView>

        {/* Categories Tabs */}
        <View style={styles.categoriesContainer}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryTab,
                  activeCategory === category && styles.activeCategoryTab
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={[
                  styles.categoryText,
                  activeCategory === category && styles.activeCategoryText
                ]}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Main Content */}
        <View style={styles.mainContent}>
          {isTablet ? (
            // Desktop/Tablet Layout
            <View style={styles.desktopLayout}>
              <View style={styles.feedColumn}>
                <FlatList
                  data={newsArticles}
                  renderItem={renderNewsCard}
                  keyExtractor={(item) => item.id.toString()}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.feedContent}
                />
              </View>
              <View style={styles.widgetsColumn}>
                {renderTrendingWidget()}
                {renderTopNewsersWidget()}
              </View>
            </View>
          ) : (
            // Mobile Layout
            <ScrollView 
              style={styles.mobileLayout}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              <FlatList
                data={newsArticles}
                renderItem={renderNewsCard}
                keyExtractor={(item) => item.id.toString()}
                scrollEnabled={false}
                contentContainerStyle={styles.feedContent}
              />
              
              {activeCategory === 'À la Une' && (
                <View style={styles.mobileWidgets}>
                  {renderTrendingWidget()}
                  {renderTopNewsersWidget()}
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* Live News FAB */}
        <TouchableOpacity 
          style={styles.fab}
          onPress={toggleActionSheet}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#FFD700', '#FFA500']}
            style={styles.fabGradient}
          >
            <MaterialIcons name="live-tv" size={24} color="#FFFFFF" />
          </LinearGradient>
        </TouchableOpacity>

        {/* Action Sheet */}
        {showActionSheet && (
          <Animated.View 
            style={[
              styles.actionSheetOverlay,
              { opacity: fadeAnim }
            ]}
          >
            <TouchableOpacity 
              style={styles.actionSheetBackground}
              onPress={toggleActionSheet}
            />
            <Animated.View 
              style={[
                styles.actionSheet,
                {
                  transform: [{ scale: scaleAnim }]
                }
              ]}
            >
              <BlurView blurAmount={40} blurType="light" style={styles.actionSheetBlur}>
                <Text style={styles.actionSheetTitle}>Actualités Live</Text>
                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="radio" size={20} color="#FFD700" />
                  <Text style={styles.actionText}>Écouter Live Radio</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="videocam" size={20} color="#FFD700" />
                  <Text style={styles.actionText}>Regarder Live TV</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="notifications" size={20} color="#FFD700" />
                  <Text style={styles.actionText}>Alertes Breaking News</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionItem}>
                  <Ionicons name="add-circle" size={20} color="#FFD700" />
                  <Text style={styles.actionText}>Créer une News</Text>
                </TouchableOpacity>
              </BlurView>
            </Animated.View>
          </Animated.View>
        )}
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
    paddingTop: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight + 10,
    paddingBottom: 15,
    paddingHorizontal: 16,
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
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  menuButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  categoriesContainer: {
    paddingVertical: 12,
  },
  categoriesContent: {
    paddingHorizontal: 16,
  },
  categoryTab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeCategoryTab: {
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderColor: '#FFD700',
  },
  categoryText: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  activeCategoryText: {
    color: '#FFD700',
    fontFamily: 'Poppins-Bold',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  desktopLayout: {
    flexDirection: 'row',
    flex: 1,
  },
  feedColumn: {
    flex: 2,
    marginRight: 16,
  },
  widgetsColumn: {
    flex: 1,
  },
  mobileLayout: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  feedContent: {
    paddingBottom: 20,
  },
  newsCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  newsCardBlur: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
  },
  newsImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  newsContent: {
    padding: 16,
  },
  newsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  newsCategory: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
    textTransform: 'uppercase',
  },
  newsTime: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  newsTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 24,
  },
  newsExcerpt: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
    marginBottom: 12,
  },
  newsFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  newsAuthor: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  newsActions: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 12,
    padding: 4,
  },
  mobileWidgets: {
    marginTop: 20,
  },
  widget: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  widgetBlur: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  widgetTitle: {
    fontSize: 16,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  trendingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  trendingTopic: {
    fontSize: 14,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
  },
  trendingCount: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: '#FFD700',
  },
  newserItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  newserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  newserInfo: {
    flex: 1,
  },
  newserName: {
    fontSize: 14,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
  },
  newserFollowers: {
    fontSize: 12,
    fontFamily: 'Poppins-Regular',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  followButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.2)',
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  followButtonText: {
    fontSize: 12,
    fontFamily: 'Poppins-Bold',
    color: '#FFD700',
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSheetBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  actionSheet: {
    width: width * 0.8,
    maxWidth: 300,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 16,
  },
  actionSheetBlur: {
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionSheetTitle: {
    fontSize: 18,
    fontFamily: 'Poppins-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  actionText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    color: '#FFFFFF',
    marginLeft: 12,
  },
});

export default NewsJerrScreen;