import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { moderateScale, verticalScale, scale } from "react-native-size-matters";

import SearchBar from "../components/SearchBar";
import MainCard from "../components/MainCard";
import UniverseGrid from "../components/UniverseGrid";
import PaginationDots from "../components/PaginationDots";



const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  
  const handleMainCardPress = () => {
    console.log("CydJerr Nation pressed!");
    // Navigation vers CydJerrNationScreen
    navigation.navigate("CydJerrNation");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "#FF6B9D" : "transparent"}
        translucent={Platform.OS === "android"}
      />

      {/* Fond dégradé principal */}
      <LinearGradient
        colors={[
          "#FF6B9D", // Rose
          "#C44569", // Rose-violet
          "#6C5CE7", // Violet
          "#74B9FF", // Bleu
          "#00CEC9", // Turquoise
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <View style={styles.safeArea}>
          {/* Barre de recherche */}
          <SearchBar />

          {/* Carte principale CydJerr Nation */}
          <MainCard onPress={handleMainCardPress} />

          {/* Zone de contenu défilable */}
          <View style={styles.contentArea}>
            <UniverseGrid navigation={navigation} />
          </View>
        </View>

        {/* Indicateurs de pagination - positionnés au-dessus de la bottom nav */}
        <View style={[styles.paginationContainer, { bottom: verticalScale(Platform.OS === "android" ? 115 : 105) }]}>
          <PaginationDots />
        </View>

        {/* Navigation bottom fixe */}
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FF6B9D", // Couleur de fallback pour la StatusBar
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: verticalScale(20), // Réduit l'espace car pagination est maintenant séparée
    paddingHorizontal: scale(Platform.OS === 'android' ? 16 : 20),
  },
  contentArea: {
    flex: 1,
    marginTop: verticalScale(10),
  },
  paginationContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    zIndex: 50, // Entre le contenu et la bottom nav
    paddingHorizontal: scale(20),
  },
});

export default HomeScreen;
