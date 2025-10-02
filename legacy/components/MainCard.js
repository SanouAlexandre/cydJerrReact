import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from "react-native";
import LinearGradient from 'react-native-linear-gradient';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const MainCard = ({ onPress }) => {
  const scaleValue = new Animated.Value(1);

  const handlePressIn = () => {
    Animated.spring(scaleValue, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  return (
    <View style={styles.container}>
      {/* Carte principale */}
      <Animated.View
        style={[
          styles.mainCardContainer,
          { transform: [{ scale: scaleValue }] },
        ]}
      >
        <TouchableOpacity
          style={styles.mainCard}
          onPress={onPress}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={[
              "rgba(255, 255, 255, 0.4)",
              "rgba(255, 255, 255, 0.2)",
              "rgba(255, 255, 255, 0.1)",
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradient}
          >
            <View style={styles.cardContent}>
              <MaterialCommunityIcons
                name="rocket-launch"
                size={32}
                color="rgba(255, 255, 255, 0.95)"
                style={styles.mainIcon}
              />
              <Text style={styles.mainTitle}>CydJerr</Text>
              <Text style={styles.mainSubtitle}>Nation</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: -2,
    position: "relative",
  },

  mainCardContainer: {
    zIndex: 10,
  },
  mainCard: {
    width: 160,
    height: 100,
    borderRadius: 16,
    shadowColor: "rgba(255, 255, 255, 0.3)",
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 4,
  },
  cardGradient: {
    width: "100%",
    height: "100%",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.4)",
  },
  cardContent: {
    alignItems: "center",
  },
  mainIcon: {
    marginBottom: 4,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.95)",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  mainSubtitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.8)",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default MainCard;
