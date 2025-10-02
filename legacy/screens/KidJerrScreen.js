import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Image,
  Platform,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { BlurView } from '@react-native-community/blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { commonUIStyles, UI_CONSTANTS } from '../styles/commonUIStyles';

const { width, height } = Dimensions.get('window');

const KidJerrScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('Accueil');

  const tabs = [
    { name: 'Accueil', icon: '🏠' },
    { name: 'Projets', icon: '🎯' },
    { name: 'Équipe', icon: '👥' },
    { name: 'Partenaires', icon: '🤝' },
    { name: 'Faire un don', icon: '💝' },
  ];

  const stats = [
    { icon: '❤️', value: '12,450', label: 'Enfants aidés' },
    { icon: '🎯', value: '850,000 Jerr', label: 'Fonds collectés' },
    { icon: '👥', value: '2,340', label: 'Bénévoles' },
    { icon: '🌍', value: '45', label: 'Pays' },
  ];

  const urgentProjects = [
    {
      id: 1,
      title: 'École primaire au Mali',
      description: 'Construction d\'une école pour 200 enfants',
      progress: 75,
      target: '50,000 Jerr',
      raised: '37,500 Jerr',
      image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
    {
      id: 2,
      title: 'Cantine scolaire Sénégal',
      description: 'Repas quotidiens pour 150 enfants',
      progress: 45,
      target: '25,000 Jerr',
      raised: '11,250 Jerr',
      image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    },
  ];

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>ONG KidJerr</Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderTabNavigation = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.tabContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.tab,
              activeTab === tab.name && styles.activeTab,
            ]}
            onPress={() => setActiveTab(tab.name)}
          >
            <Text style={styles.tabIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.tabText,
                activeTab === tab.name && styles.activeTabText,
              ]}
            >
              {tab.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BlurView>
  );

  const renderHeroSection = () => (
    <LinearGradient
      colors={['rgba(255, 222, 89, 0.2)', 'rgba(15, 28, 63, 0.2)']}
      style={styles.heroCard}
    >
      <Text style={styles.heroIcon}>💛</Text>
      <Text style={styles.heroTitle}>Ensemble pour l'avenir des enfants</Text>
      <Text style={styles.heroSlogan}>
        Chaque don compte, chaque enfant mérite un avenir meilleur
      </Text>
      <TouchableOpacity style={styles.ctaButton}>
        <LinearGradient
          colors={['#FFDE59', '#FF6B6B']}
          style={styles.ctaGradient}
        >
          <Text style={styles.ctaText}>Faire un don maintenant</Text>
        </LinearGradient>
      </TouchableOpacity>
    </LinearGradient>
  );

  const renderStats = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsGrid}>
        {stats.map((stat, index) => (
          <TouchableOpacity key={index} style={styles.statCard}>
            <BlurView blurAmount={10} blurType="light" style={styles.statBlur}>
              <Text style={styles.statIcon}>{stat.icon}</Text>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </BlurView>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderMissionStatement = () => (
    <BlurView blurAmount={10} blurType="light" style={styles.missionCard}>
      <View style={styles.missionHeader}>
        <Text style={styles.missionIcon}>🎯</Text>
        <Text style={styles.missionTitle}>Notre Mission</Text>
      </View>
      <Text style={styles.missionText}>
        Offrir aux enfants défavorisés l'accès à l'éducation, à la santé et à un
        environnement sûr pour grandir et s'épanouir. Nous croyons que chaque
        enfant mérite les mêmes chances de réussir dans la vie.
      </Text>
    </BlurView>
  );

  const renderUrgentProjects = () => (
    <View style={styles.urgentSection}>
      <View style={styles.urgentHeader}>
        <View style={styles.urgentTitleContainer}>
          <Text style={styles.urgentIcon}>⏰</Text>
          <Text style={styles.urgentTitle}>Projets urgents</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.seeAllLink}>Voir tous</Text>
        </TouchableOpacity>
      </View>
      
      {urgentProjects.map((project) => (
        <BlurView key={project.id} blurAmount={10} style={styles.projectCard}>
          <Image source={{ uri: project.image }} style={styles.projectImage} />
          <View style={styles.projectContent}>
            <Text style={styles.projectTitle}>{project.title}</Text>
            <Text style={styles.projectDescription}>{project.description}</Text>
            
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <LinearGradient
                  colors={['#FFDE59', '#FF6B6B']}
                  style={[styles.progressFill, { width: `${project.progress}%` }]}
                />
              </View>
              <Text style={styles.progressText}>{project.progress}%</Text>
            </View>
            
            <View style={styles.projectAmounts}>
              <Text style={styles.raisedAmount}>{project.raised} collectés</Text>
              <Text style={styles.targetAmount}>sur {project.target}</Text>
            </View>
            
            <View style={styles.projectButtons}>
              <TouchableOpacity style={styles.detailsButton}>
                <Text style={styles.detailsButtonText}>Voir détails</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.donateButton}>
                <LinearGradient
                  colors={['#FFDE59', '#FF6B6B']}
                  style={styles.donateGradient}
                >
                  <Text style={styles.donateButtonText}>Faire un don</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      ))}
    </View>
  );

  // Rendu du header glassmorphique
  const renderGlassHeader = () => (
    <BlurView blurAmount={20} blurType="light" style={styles.glassHeader}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.7}
      >
        <Ionicons name="arrow-back" size={24} color="white" />
      </TouchableOpacity>
      
      <Text style={styles.headerTitle}>ONG KidJerr</Text>
      
      <TouchableOpacity
        style={styles.headerButton}
        activeOpacity={0.7}
      >
        <Ionicons name="heart" size={24} color="white" />
      </TouchableOpacity>
    </BlurView>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'Accueil':
        return (
          <>
            {renderHeroSection()}
            {renderStats()}
            {renderMissionStatement()}
            {renderUrgentProjects()}
          </>
        );
      case 'Projets':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Tous nos projets</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Équipe':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Notre équipe</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Partenaires':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Nos partenaires</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      case 'Faire un don':
        return (
          <View style={styles.tabContent}>
            <Text style={styles.tabContentTitle}>Faire un don</Text>
            <Text style={styles.tabContentText}>Section en développement...</Text>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#0F1C3F', '#2D4A7B', '#1A365D']}
        style={styles.gradient}
      >
        {renderGlassHeader()}
        {renderTabNavigation()}
        <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: Platform.OS === 'ios' ? 120 : 100 }]}
        showsVerticalScrollIndicator={false}
      >
          {renderContent()}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  glassHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  headerButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  backButton: {
    width: 44, // Taille accessible
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
    textShadowColor: 'rgba(255, 222, 89, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerSpacer: {
    width: 44, // Correspondance avec la taille des boutons
  },
  tabContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    overflow: 'hidden',
  },
  tabScrollContent: {
    paddingHorizontal: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  tabIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  tabText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  activeTabText: {
    color: 'white',
    fontWeight: 'bold',
    textShadowColor: 'rgba(255, 222, 89, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  heroCard: {
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    marginVertical: 16,
  },
  heroIcon: {
    fontSize: 64,
    marginBottom: 16,
    textShadowColor: 'rgba(255, 222, 89, 0.8)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 12,
    fontFamily: 'Poppins-Bold',
  },
  heroSlogan: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
    fontFamily: 'Poppins-Regular',
  },
  ctaButton: {
    borderRadius: 25,
    overflow: 'hidden',
  },
  ctaGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  ctaText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  statsContainer: {
    marginVertical: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  statBlur: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    alignItems: 'center',
  },
  statIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  missionCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 20,
    marginVertical: 16,
  },
  missionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  missionIcon: {
    fontSize: 24,
    marginRight: 12,
    color: '#FFDE59',
  },
  missionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  missionText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 22,
    fontFamily: 'Poppins-Regular',
  },
  urgentSection: {
    marginVertical: 16,
  },
  urgentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  urgentTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  urgentIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#FF6B6B',
  },
  urgentTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  seeAllLink: {
    fontSize: 14,
    color: '#FFDE59',
    fontFamily: 'Poppins-Regular',
  },
  projectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
  },
  projectImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  projectContent: {
    padding: 16,
  },
  projectTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  projectDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    marginRight: 12,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  projectAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  raisedAmount: {
    fontSize: 14,
    color: '#FFDE59',
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  targetAmount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    fontFamily: 'Poppins-Regular',
  },
  projectButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailsButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    paddingVertical: 12,
    marginRight: 8,
    alignItems: 'center',
  },
  detailsButtonText: {
    fontSize: 14,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  donateButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
    marginLeft: 8,
  },
  donateGradient: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  donateButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'Poppins-Bold',
  },
  tabContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  tabContentTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 16,
    fontFamily: 'Poppins-Bold',
  },
  tabContentText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});

export default KidJerrScreen;