import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const CydJerrNationScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const [fontsLoaded, setFontsLoaded] = useState(true); // Set to true since we're removing font loading

  // Remove font loading since React Native handles fonts differently
  useEffect(() => {
    // Font loading is handled by React Native's font system
    // Custom fonts should be registered in react-native.config.js or android/ios configs
    setFontsLoaded(true);
  }, []);

  // Données des statistiques
  const statsData = [
    {
      icon: "account-group",
      value: "10,000+",
      label: "Utilisateurs",
      color: "#FFD700",
    },
    { icon: "earth", value: "50+", label: "Univers", color: "#4ECDC4" },
    { icon: "star", value: "4.9", label: "Note", color: "#FF6B9D" },
    {
      icon: "rocket-launch",
      value: "24/7",
      label: "Support",
      color: "#6C5CE7",
    },
  ];

  // Données des accès rapides
  const quickAccessData = [
    { name: "JoyJerr", icon: "camera", color: "#FF6B9D" },
    { name: "NewsJerr", icon: "newspaper", color: "#4ECDC4" },
    { name: "CapiJerr", icon: "chart-line", color: "#FFD700" },
    { name: "SagaJerr", icon: "account-group", color: "#6C5CE7" },
  ];

  // Composant Header
  const Header = () => (
    <View
      style={[styles.header, { paddingTop: Math.max(insets.top + 30, 70) }]}
    >
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
      </TouchableOpacity>

      <Text
        style={[
          styles.headerTitle,
          fontsLoaded && { fontFamily: "Poppins-Bold" },
        ]}
      >
        CydJerr Nation
      </Text>

      <View style={styles.headerRight} />
    </View>
  );

  // Composant Hero Section
  const HeroSection = () => (
    <View style={styles.heroContainer}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.15)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.heroCard}
      >
        <View style={styles.heroIconContainer}>
          <LinearGradient
            colors={["#FFD700", "#FFA500", "#FF8C00"]}
            style={styles.heroIconCircle}
          >
            <MaterialCommunityIcons name="earth" size={40} color="white" />
          </LinearGradient>
        </View>

        <Text
          style={[
            styles.heroTitle,
            fontsLoaded && { fontFamily: "Poppins-Bold" },
          ]}
        >
          Bienvenue dans la Nation
        </Text>

        <Text
          style={[
            styles.heroSubtitle,
            fontsLoaded && { fontFamily: "Poppins-Regular" },
          ]}
        >
          Votre écosystème digital personnel pour explorer tous les univers
          CydJerr
        </Text>
      </LinearGradient>
    </View>
  );

  // Composant Grille de Statistiques
  const StatsGrid = () => (
    <View style={styles.statsContainer}>
      <View style={styles.statsGrid}>
        {statsData.map((stat, index) => (
          <LinearGradient
            key={index}
            colors={["#0F1C3F", "#2D4A7B", "#1A365D"]}
            style={styles.statCard}
          >
            <View
              style={[
                styles.statIconContainer,
                { backgroundColor: `${stat.color}20` },
              ]}
            >
              <MaterialCommunityIcons
                name={stat.icon}
                size={32}
                color={stat.color}
                style={styles.statIcon}
              />
            </View>

            <Text
              style={[
                styles.statValue,
                fontsLoaded && { fontFamily: "Poppins-Bold" },
              ]}
            >
              {stat.value}
            </Text>

            <Text
              style={[
                styles.statLabel,
                fontsLoaded && { fontFamily: "Poppins-Regular" },
              ]}
            >
              {stat.label}
            </Text>
          </LinearGradient>
        ))}
      </View>
    </View>
  );

  // Composant Section À propos
  const AboutSection = () => (
    <View style={styles.aboutContainer}>
      <LinearGradient
        colors={["rgba(255, 255, 255, 0.1)", "rgba(255, 255, 255, 0.05)"]}
        style={styles.aboutCard}
      >
        <Text
          style={[
            styles.aboutTitle,
            fontsLoaded && { fontFamily: "Poppins-Bold" },
          ]}
        >
          À propos de CydJerr Nation
        </Text>

        <Text
          style={[
            styles.aboutText,
            fontsLoaded && { fontFamily: "Poppins-Regular" },
          ]}
        >
          CydJerr Nation est votre plateforme unifiée pour accéder à tous les
          univers digitaux. Découvrez des fonctionnalités innovantes,
          connectez-vous avec la communauté et explorez de nouveaux horizons
          technologiques.
        </Text>

        <Text
          style={[
            styles.aboutText,
            fontsLoaded && { fontFamily: "Poppins-Regular" },
          ]}
        >
          Rejoignez des milliers d'utilisateurs qui font déjà confiance à notre
          écosystème pour transformer leur expérience numérique quotidienne.
        </Text>
      </LinearGradient>
    </View>
  );

  // Composant Accès Rapide
  const QuickAccess = () => (
    <View style={styles.quickAccessContainer}>
      <View style={styles.quickAccessHeader}>
        <LinearGradient
          colors={["rgba(255, 215, 0, 0.2)", "rgba(255, 215, 0, 0.1)"]}
          style={styles.quickAccessBadge}
        >
          <Text
            style={[
              styles.quickAccessTitle,
              fontsLoaded && { fontFamily: "Poppins-Bold" },
            ]}
          >
            Accès rapide
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.quickAccessGrid}>
        {quickAccessData.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.quickAccessButton}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#FFD700", "#FFA500", "#FF8C00"]}
              style={styles.quickAccessGradient}
            >
              <MaterialCommunityIcons
                name={item.icon}
                size={24}
                color="white"
                style={styles.quickAccessIcon}
              />
              <Text
                style={[
                  styles.quickAccessText,
                  fontsLoaded && { fontFamily: "Poppins-Bold" },
                ]}
              >
                {item.name}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  if (!fontsLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#0F1C3F", "#2D4A7B", "#1A365D"]}
          style={styles.loadingGradient}
        >
          <MaterialCommunityIcons name="loading" size={48} color="white" />
          <Text style={styles.loadingText}>Chargement...</Text>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent={true}
      />

      <LinearGradient
        colors={["#0F1C3F", "#2D4A7B", "#1A365D"]}
        style={styles.backgroundGradient}
      >
        <View style={styles.safeArea}>
          <Header />

          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <HeroSection />
            <StatsGrid />
            <AboutSection />
            <QuickAccess />

            {/* Espace pour éviter le chevauchement avec la bottom nav */}
            <View style={styles.bottomSpacer} />
          </ScrollView>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  // Conteneur principal
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Platform.OS === "android" ? 16 : 20,
  },

  // Loading
  loadingContainer: {
    flex: 1,
  },
  loadingGradient: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    color: "white",
    fontSize: 16,
    marginTop: 16,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    backgroundColor: "transparent",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    textShadowColor: "#4ECDC4",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  headerRight: {
    width: 40,
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  bottomSpacer: {
    height: 80,
  },

  // Hero Section
  heroContainer: {
    marginBottom: 30,
  },
  heroCard: {
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "rgba(0, 0, 0, 0.3)",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
  },
  heroIconContainer: {
    marginBottom: 20,
  },
  heroIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#FFD700",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 12,
    elevation: 8,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
    marginBottom: 12,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
  },

  // Stats Grid
  statsContainer: {
    marginBottom: 30,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  statCard: {
    width: (screenWidth - 60) / 2,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  statIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  statIcon: {
    textShadowColor: "rgba(255, 255, 255, 0.3)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "rgba(255, 255, 255, 0.7)",
  },

  // About Section
  aboutContainer: {
    marginBottom: 30,
  },
  aboutCard: {
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  aboutTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 16,
  },
  aboutText: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    lineHeight: 22,
    marginBottom: 12,
  },

  // Quick Access
  quickAccessContainer: {
    marginBottom: 30,
  },
  quickAccessHeader: {
    alignItems: "center",
    marginBottom: 20,
  },
  quickAccessBadge: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  quickAccessTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  quickAccessGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  quickAccessButton: {
    width: (screenWidth - 60) / 2,
    marginBottom: 16,
    borderRadius: 12,
    overflow: "hidden",
  },
  quickAccessGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  quickAccessIcon: {
    marginRight: 8,
  },
  quickAccessText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
  },
});

export default CydJerrNationScreen;
