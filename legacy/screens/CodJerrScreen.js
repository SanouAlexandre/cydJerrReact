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
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import { Ionicons, MaterialCommunityIcons, Feather } from 'react-native-vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { formatJerr } from '../utils/price';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// Données mockées pour les projets récents
const mockRecentProjects = [
  {
    id: 1,
    name: 'E-commerce React Native',
    description: 'Application mobile complète avec paiement intégré et gestion des stocks',
    price: 250000, // 2500 Jerr
    duration: '3-4 mois',
    technologies: ['React Native', 'Node.js', 'MongoDB', 'Stripe'],
    client: 'TechStart SAS',
    rating: 4.9,
    location: 'Paris, France',
    proposals: 12,
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=300',
  },
  {
    id: 2,
    name: 'Dashboard Analytics IA',
    description: 'Interface web avec intelligence artificielle pour analyse de données en temps réel',
    price: 180000, // 1800 Jerr
    duration: '2-3 mois',
    technologies: ['React', 'Python', 'TensorFlow', 'D3.js'],
    client: 'DataCorp',
    rating: 4.8,
    location: 'Lyon, France',
    proposals: 8,
    date: '2024-01-12',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=300',
  },
  {
    id: 3,
    name: 'API Blockchain DeFi',
    description: 'Développement d\'API pour plateforme de finance décentralisée avec smart contracts',
    price: 320000, // 3200 Jerr
    duration: '4-5 mois',
    technologies: ['Solidity', 'Web3.js', 'Node.js', 'PostgreSQL'],
    client: 'CryptoFinance',
    rating: 4.7,
    location: 'Marseille, France',
    proposals: 15,
    date: '2024-01-10',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=300',
  },
];

// Données mockées pour les top développeurs
const mockTopDevelopers = [
  {
    id: 1,
    name: 'Alexandre Martin',
    specialty: 'Full-Stack React/Node.js',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    rating: 4.9,
    projects: 47,
    location: 'Paris',
    skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
  },
  {
    id: 2,
    name: 'Sophie Dubois',
    specialty: 'Mobile React Native',
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
    rating: 4.8,
    projects: 32,
    location: 'Lyon',
    skills: ['React Native', 'Flutter', 'Firebase', 'GraphQL'],
  },
  {
    id: 3,
    name: 'Thomas Leroy',
    specialty: 'Blockchain & Smart Contracts',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    rating: 4.9,
    projects: 28,
    location: 'Marseille',
    skills: ['Solidity', 'Web3', 'Ethereum', 'DeFi'],
  },
  {
    id: 4,
    name: 'Emma Rousseau',
    specialty: 'IA & Machine Learning',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    rating: 4.7,
    projects: 35,
    location: 'Toulouse',
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Data Science'],
  },
];

// Tags de filtres
const filterTags = ['Tous', 'React', 'Node.js', 'Mobile', 'IA', 'Blockchain'];

const CodJerrScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('Tous');
  const [scaleAnim] = useState(new Animated.Value(1));
  const scrollViewRef = useRef(null);

  const handleBackPress = () => {
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
    navigation.goBack();
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBackPress}
        activeOpacity={0.7}
      >
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </Animated.View>
      </TouchableOpacity>
      
      <View style={styles.headerCenter}>
        <View style={styles.titleContainer}>
          <MaterialCommunityIcons name="code-tags" size={28} color="#FFDE59" />
          <Text style={styles.headerTitle}>CodJerr</Text>
        </View>
        <Text style={styles.headerSubtitle}>Développeurs & Projets</Text>
      </View>
      
      <TouchableOpacity style={styles.searchButton}>
        <BlurView blurAmount={20} blurType="light" style={styles.searchButtonBlur}>
          <Feather name="search" size={20} color="white" />
        </BlurView>
      </TouchableOpacity>
    </View>
  );

  const renderSearchAndFilters = () => (
    <View style={styles.searchSection}>
      <BlurView blurAmount={15} blurType="light" style={styles.searchBar}>
        <Feather name="search" size={18} color="rgba(255,255,255,0.7)" />
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un projet ou développeur..."
          placeholderTextColor="rgba(255,255,255,0.7)"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity style={styles.filterButton}>
          <Feather name="filter" size={18} color="white" />
        </TouchableOpacity>
      </BlurView>
      
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tagsContainer}
        contentContainerStyle={styles.tagsContent}
      >
        {filterTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[
              styles.tag,
              activeFilter === tag && styles.activeTag
            ]}
            onPress={() => setActiveFilter(tag)}
          >
            <BlurView blurAmount={activeFilter === tag ? 25 : 15} blurType="light" style={styles.tagBlur}>
              <Text style={[
                styles.tagText,
                activeFilter === tag && styles.activeTagText
              ]}>
                {tag}
              </Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const renderQuickStats = () => (
    <View style={styles.statsSection}>
      <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
        <MaterialCommunityIcons name="code-braces" size={24} color="#FFDE59" />
        <Text style={styles.statNumber}>247</Text>
        <Text style={styles.statLabel}>Projets actifs</Text>
      </BlurView>
      
      <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
        <MaterialCommunityIcons name="account-group" size={24} color="#FFDE59" />
        <Text style={styles.statNumber}>1.2K</Text>
        <Text style={styles.statLabel}>Développeurs</Text>
      </BlurView>
      
      <BlurView blurAmount={15} blurType="light" style={styles.statCard}>
        <MaterialCommunityIcons name="star" size={24} color="#FFDE59" />
        <Text style={styles.statNumber}>4.8</Text>
        <Text style={styles.statLabel}>Note moyenne</Text>
      </BlurView>
    </View>
  );

  const renderProjectCard = ({ item }) => (
    <BlurView blurAmount={15} blurType="light" style={styles.projectCard}>
      <Image source={{ uri: item.image }} style={styles.projectImage} />
      <View style={styles.projectContent}>
        <Text style={styles.projectName}>{item.name}</Text>
        <Text style={styles.projectDescription}>{item.description}</Text>
        
        <View style={styles.projectPrice}>
          <Text style={styles.priceText}>{formatJerr(item.price)}</Text>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.techContainer}
        >
          {item.technologies.map((tech, index) => (
            <View key={index} style={styles.techBadge}>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </ScrollView>
        
        <View style={styles.projectFooter}>
          <View style={styles.clientInfo}>
            <Text style={styles.clientName}>{item.client}</Text>
            <View style={styles.ratingContainer}>
              <MaterialCommunityIcons name="star" size={14} color="#FFDE59" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          
          <View style={styles.projectMeta}>
            <Text style={styles.metaText}>{item.location}</Text>
            <Text style={styles.metaText}>{item.proposals} propositions</Text>
            <Text style={styles.metaText}>{item.date}</Text>
          </View>
        </View>
      </View>
    </BlurView>
  );

  const renderRecentProjects = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="code-tags" size={20} color="#FFDE59" />
        <Text style={styles.sectionTitle}>Projets récents</Text>
      </View>
      
      <FlatList
        data={mockRecentProjects}
        renderItem={renderProjectCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  const renderDeveloperCard = ({ item }) => (
    <BlurView blurAmount={15} blurType="light" style={styles.developerCard}>
      <LinearGradient
        colors={['#8B5CF6', '#06B6D4']}
        style={styles.avatarContainer}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
      </LinearGradient>
      
      <View style={styles.developerInfo}>
        <Text style={styles.developerName}>{item.name}</Text>
        <Text style={styles.developerSpecialty}>{item.specialty}</Text>
        
        <View style={styles.developerStats}>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="star" size={16} color="#FFDE59" />
            <Text style={styles.statValue}>{item.rating}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="briefcase" size={16} color="#4ECDC4" />
            <Text style={styles.statValue}>{item.projects}</Text>
          </View>
          <View style={styles.statItem}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#8B5CF6" />
            <Text style={styles.statValue}>{item.location}</Text>
          </View>
        </View>
        
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.skillsContainer}
        >
          {item.skills.map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </BlurView>
  );

  const renderTopDevelopers = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <MaterialCommunityIcons name="star" size={20} color="#FFDE59" />
        <Text style={styles.sectionTitle}>Top développeurs</Text>
      </View>
      
      <FlatList
        data={mockTopDevelopers}
        renderItem={renderDeveloperCard}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      <LinearGradient
        colors={['#8B5CF6', '#3B82F6', '#06B6D4']}
        style={styles.gradient}
      >
        {renderHeader()}
        
        <ScrollView
          ref={scrollViewRef}
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {renderSearchAndFilters()}
          {renderQuickStats()}
          {renderRecentProjects()}
          {renderTopDevelopers()}
        </ScrollView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a2e',
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  searchButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  searchButtonBlur: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  filterButton: {
    padding: 4,
  },
  tagsContainer: {
    marginBottom: 8,
  },
  tagsContent: {
    paddingRight: 20,
  },
  tag: {
    marginRight: 12,
    borderRadius: 20,
    overflow: 'hidden',
  },
  tagBlur: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  activeTag: {
    // Style actif géré par BlurView intensity
  },
  tagText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  activeTagText: {
    color: 'white',
    fontWeight: '600',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 24,
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  projectCard: {
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  projectContent: {
    padding: 16,
  },
  projectName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  projectDescription: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 20,
    marginBottom: 12,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  projectPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFDE59',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  durationText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.7)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  techContainer: {
    marginBottom: 12,
  },
  techBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  techText: {
    fontSize: 12,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  projectFooter: {
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 12,
  },
  clientInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clientName: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  projectMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.6)',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  developerCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    padding: 2,
    marginRight: 16,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 28,
  },
  developerInfo: {
    flex: 1,
  },
  developerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  developerSpecialty: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 8,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  developerStats: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  statValue: {
    fontSize: 12,
    color: 'white',
    marginLeft: 4,
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
  skillsContainer: {
    marginTop: 4,
  },
  skillBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  skillText: {
    fontSize: 10,
    color: 'white',
    fontFamily: Platform.OS === 'ios' ? 'System' : 'Roboto',
  },
});

export default CodJerrScreen;