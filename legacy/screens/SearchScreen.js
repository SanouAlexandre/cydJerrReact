import React from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Platform,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "react-native-vector-icons";
import SearchBar from "../components/SearchBar";

const SearchScreen = () => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={Platform.OS === "android" ? "transparent" : undefined}
        translucent={Platform.OS === "android"}
      />

      <LinearGradient
        colors={["#FF6B9D", "#C44569", "#6C5CE7", "#74B9FF", "#00CEC9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backgroundGradient}
      >
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Recherche</Text>
          </View>

          <SearchBar />

          <View style={styles.content}>
            <View style={styles.emptyState}>
              <MaterialCommunityIcons
                name="magnify"
                size={64}
                color="rgba(255, 255, 255, 0.6)"
              />
              <Text style={styles.emptyText}>
                Recherchez dans tous les univers
              </Text>
              <Text style={styles.emptySubtext}>
                Découvrez de nouveaux contenus et fonctionnalités
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "rgba(255, 255, 255, 0.95)",
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  emptyState: {
    alignItems: "center",
    opacity: 0.8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.9)",
    marginTop: 20,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.7)",
    marginTop: 8,
    textAlign: "center",
  },
});

export default SearchScreen;
