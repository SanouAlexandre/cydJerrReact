import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import { useSelector, useDispatch } from "react-redux";
import { selectUniverse } from "../redux/universesSlice";
import { setCurrentPage } from "../redux/navigationSlice";

const { width: screenWidth } = Dimensions.get("window");

const UniverseGrid = ({ navigation }) => {
  const dispatch = useDispatch();
  const { mainUniverses, additionalUniverses, specializedUniverses } =
    useSelector((state) => state.universes);
  const { currentPage } = useSelector((state) => state.navigation);

  const handleUniversePress = (universe) => {
    dispatch(selectUniverse(universe));
    
    // Navigation spécifique pour JoyJerr
    if (universe.name === 'JoyJerr') {
      navigation.navigate('JoyJerr');
    }
    // Navigation spécifique pour SagaJerr
    else if (universe.name === 'SagaJerr') {
      navigation.navigate('SagaJerr');
    }
    // Navigation spécifique pour NewsJerr
    else if (universe.name === 'NewsJerr') {
      navigation.navigate('NewsJerr');
    }
    // Navigation spécifique pour SpeakJerr
    else if (universe.name === 'SpeakJerr') {
      navigation.navigate('SpeakJerr');
    }
    // Navigation spécifique pour ChabJerr
    else if (universe.name === 'ChabJerr') {
      navigation.navigate('ChabJerr');
    }
    // Navigation spécifique pour PiolJerr
    else if (universe.name === 'PiolJerr') {
      navigation.navigate('PiolJerr');
    }
    // Navigation spécifique pour EvenJerr
    else if (universe.name === 'EvenJerr') {
      navigation.navigate('EvenJerr');
    }
    // Navigation spécifique pour ShopJerr
    else if (universe.name === 'ShopJerr') {
      navigation.navigate('ShopJerr');
    }
    // Navigation spécifique pour CapiJerr
    else if (universe.name === 'CapiJerr') {
      navigation.navigate('CapiJerr');
    }
    // Navigation spécifique pour JobJerr
    else if (universe.name === 'JobJerr') {
      navigation.navigate('JobJerr');
    }
    // Navigation spécifique pour TeachJerr
    else if (universe.name === 'TeachJerr') {
      navigation.navigate('TeachJerr');
    }
    // Navigation spécifique pour StarJerr
    else if (universe.name === 'StarJerr') {
      navigation.navigate('StarJerr');
    }
    // Navigation spécifique pour FundingJerr
    else if (universe.name === 'FundingJerr') {
      navigation.navigate('FundingJerr');
    }
    // Navigation spécifique pour ONG KidJerr
    else if (universe.name === 'ONG KidJerr') {
      navigation.navigate('KidJerr');
    }
    // Navigation spécifique pour CloudJerr
    else if (universe.name === 'CloudJerr') {
      navigation.navigate('CloudJerr');
    }
    // Navigation spécifique pour DoctoJerr
    else if (universe.name === 'DoctoJerr') {
      navigation.navigate('DoctoJerr');
    }
    // Navigation spécifique pour AvoJerr
    else if (universe.name === 'AvoJerr') {
      navigation.navigate('AvoJerr');
    }
    // Navigation spécifique pour AssuJerr
    else if (universe.name === 'AssuJerr') {
      navigation.navigate('AssuJerr');
    }
    // Navigation spécifique pour DomJerr
    else if (universe.name === 'DomJerr') {
      navigation.navigate('DomJerr');
    }
    // Navigation spécifique pour VagoJerr
    else if (universe.name === 'VagoJerr') {
      navigation.navigate('VagoJerr');
    }
    // Navigation spécifique pour ImmoJerr
    else if (universe.name === 'ImmoJerr') {
      navigation.navigate('ImmoJerr');
    }
    // Navigation spécifique pour AppJerr
    else if (universe.name === 'AppJerr') {
      navigation.navigate('AppJerr');
    }
    // Navigation spécifique pour SmadJerr
    else if (universe.name === 'SmadJerr') {
      navigation.navigate('SmadJerr');
    }
    // Navigation spécifique pour GameJerr
    else if (universe.name === 'GameJerr') {
      navigation.navigate('GameJerr');
    }
    // Navigation spécifique pour PicJerr
    else if (universe.name === 'PicJerr') {
      navigation.navigate('PicJerr');
    }
    // Navigation spécifique pour CodJerr
    else if (universe.name === 'CodJerr') {
      navigation.navigate('CodJerr');
    }
    // Navigation spécifique pour LeaseJerr
    else if (universe.name === 'LeaseJerr') {
      navigation.navigate('LeaseJerr');
    }
    // Ajouter d'autres navigations ici si nécessaire
  };

  const handleScroll = (event) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const page = Math.round(offsetX / screenWidth);
    dispatch(setCurrentPage(page));
  };

  const renderUniverseItem = (universe, type = "normal") => {
    const isLarge = type === "large";
    const isMajor = universe.type === "major";
    const isFeatured = universe.type === "featured";
    const isExpandedJoy = type === "expandedJoy";
    const isSurrounding = type === "surrounding";

    return (
      <TouchableOpacity
        key={universe.id}
        style={[
          styles.universeItem,
          isLarge && styles.largeUniverseItem,
          isMajor && styles.majorUniverseItem,
          isFeatured && styles.featuredUniverseItem,
          isExpandedJoy && styles.expandedJoyItem,
          isSurrounding && styles.surroundingItem,
        ]}
        onPress={() => handleUniversePress(universe)}
        activeOpacity={0.8}
      >
        <LinearGradient
          colors={[
            `${universe.color}E6`,
            `${universe.color}B3`,
            `${universe.color}80`,
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[
            styles.universeGradient,
            isLarge && styles.largeUniverseGradient,
            isMajor && styles.majorUniverseGradient,
            isFeatured && styles.featuredUniverseGradient,
            isExpandedJoy && styles.expandedJoyGradient,
            isSurrounding && styles.surroundingGradient,
          ]}
        >
          <MaterialCommunityIcons
            name={universe.icon}
            size={isLarge || isMajor || isFeatured || isExpandedJoy ? 32 : (isSurrounding ? 20 : 24)}
            color="rgba(255, 255, 255, 0.9)"
            style={styles.universeIcon}
          />
          <Text
            style={[
              styles.universeName,
              (isLarge || isMajor || isFeatured || isExpandedJoy) && styles.largeUniverseName,
              isSurrounding && styles.surroundingUniverseName,
            ]}
          >
            {universe.name}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  };

  const renderPage1 = () => {
    // Univers qui restent dans la grille principale (incluant maintenant ONG KidJerr)
    const mainGridUniverses = mainUniverses.filter((u) => 
      u.type === "main" && 
      !["NewsJerr", "SpeakJerr", "EvenJerr", "ShopJerr", "TeachJerr", "StarJerr"].includes(u.name)
    );
    
    // Ajouter ONG KidJerr à la grille principale
    const ongKidJerr = mainUniverses.filter((u) => u.name === "ONG KidJerr");
    const allMainGridUniverses = [...mainGridUniverses, ...ongKidJerr];
    
    // Univers qui vont entourer la grille principale
    const surroundingUniverses = mainUniverses.filter((u) => 
      ["NewsJerr", "SpeakJerr", "EvenJerr", "ShopJerr"].includes(u.name)
    );

    return (
      <View style={styles.pageContainer}>
        {/* JoyJerr élargi en haut - prend l'espace de 4 univers */}
        <View style={styles.expandedJoyContainer}>
          {mainUniverses
            .filter((u) => u.name === "JoyJerr")
            .map((universe) => renderUniverseItem(universe, "expandedJoy"))}
        </View>

        {/* Grille principale avec ONG KidJerr inclus */}
        <View style={styles.reducedMainGrid}>
          {allMainGridUniverses.map((universe) => renderUniverseItem(universe))}
        </View>

        {/* Univers qui entourent la grille principale */}
        <View style={styles.surroundingGrid}>
          {surroundingUniverses.map((universe) => renderUniverseItem(universe, "surrounding"))}
        </View>
      </View>
    );
  };

  const renderPage2 = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>Univers Additionnels</Text>
      <View style={styles.additionalGrid}>
        {additionalUniverses.map((universe) => renderUniverseItem(universe))}
      </View>
    </View>
  );

  const renderPage3 = () => (
    <View style={styles.pageContainer}>
      <Text style={styles.pageTitle}>Univers Spécialisés</Text>
      <View style={styles.specializedContainer}>
        {specializedUniverses.map((universe) =>
          renderUniverseItem(universe, "large")
        )}
      </View>
    </View>
  );

  return (
    <ScrollView
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScroll={handleScroll}
      scrollEventThrottle={16}
      style={styles.scrollContainer}
    >
      {renderPage1()}
      {renderPage2()}
      {renderPage3()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
  },
  pageContainer: {
    width: screenWidth,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  pageTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    marginBottom: 20,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mainGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  additionalGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  specializedContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  majorCardsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  featuredContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 5,
  },
  expandedJoyContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
    paddingHorizontal: 10,
  },

  reducedMainGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 8,
    paddingHorizontal: 5,
  },
  surroundingGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 5,
    paddingHorizontal: 10,
  },
  universeItem: {
    width: "22%",
    aspectRatio: 1,
    marginBottom: 15,
    borderRadius: 16,
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  largeUniverseItem: {
    width: "48%",
    aspectRatio: 1.2,
  },
  majorUniverseItem: {
    shadowColor: "rgba(255, 255, 255, 0.3)",
    shadowOpacity: 0.6,
    shadowRadius: 12,
  },
  featuredUniverseItem: {
    width: 160,
    height: 100,
    aspectRatio: 1.6,
    shadowColor: "rgba(255, 255, 255, 0.4)",
    shadowOpacity: 0.8,
    shadowRadius: 15,
  },
  expandedJoyItem: {
    width: "85%",
    height: 120,
    aspectRatio: 3.2,
    shadowColor: "rgba(255, 255, 255, 0.5)",
    shadowOpacity: 0.9,
    shadowRadius: 18,
    marginBottom: 15,
  },

  surroundingItem: {
    width: "22%",
    aspectRatio: 1,
    marginBottom: 8,
    shadowColor: "rgba(255, 255, 255, 0.3)",
    shadowOpacity: 0.6,
    shadowRadius: 10,
  },
  universeGradient: {
    flex: 1,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    padding: 8,
  },
  largeUniverseGradient: {
    padding: 12,
  },
  majorUniverseGradient: {
    borderColor: "rgba(255, 255, 255, 0.4)",
    borderWidth: 1.5,
  },
  featuredUniverseGradient: {
    borderColor: "rgba(255, 255, 255, 0.5)",
    borderWidth: 2,
    padding: 16,
  },
  expandedJoyGradient: {
    borderColor: "rgba(255, 255, 255, 0.6)",
    borderWidth: 2.5,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },

  surroundingGradient: {
    borderColor: "rgba(255, 255, 255, 0.3)",
    borderWidth: 1,
    padding: 6,
  },
  universeIcon: {
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  universeName: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  largeUniverseName: {
    fontSize: 12,
    fontWeight: "bold",
  },
  surroundingUniverseName: {
    fontSize: 9,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.85)",
  },
});

export default UniverseGrid;
