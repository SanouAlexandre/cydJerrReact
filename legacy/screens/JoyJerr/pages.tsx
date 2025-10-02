import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { JoyJerrStackParamList } from "../../../src/navigation/types";
import NavigationMenu from "./components/NavigationMenu";
import PagesHeader from "./components/PagesHeader";
import PagesFilters from "./components/PagesFilters";
import CreatePageModal from "./components/CreatePageModal";
import PagesContent from "./components/PagesContent";

const PagesScreen: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<JoyJerrStackParamList>>();

  // Navigation menu state
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);
  // Filters modal state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // Create page modal state
  const [showCreatePage, setShowCreatePage] = useState<boolean>(false);

  // Pages header handlers
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  const handleFilterToggle = () => {
    console.log("Filter toggle pressed");
    setShowFilters(true);
  };

  const handleCreatePage = () => {
    console.log("Create page pressed");
    setShowCreatePage(true);
  };

  const handlePageCreate = (pageData: any) => {
    console.log("Page created:", pageData);
    // Implement actual page creation logic here
  };

  const handleFiltersChange = (filters: any) => {
    console.log("Filters applied:", filters);
    // Implement filter application logic here
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        {/* Back Button à gauche */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Spacer pour centrer l'avatar */}
        <View style={styles.spacer} />

        {/* Avatar avec badge au centre */}
        <View style={styles.avatarWrapper}>
          <Image
            source={{
              uri: "https://demo.peepso.com/wp-content/peepso/users/2/ec758423ef-avatar-full.jpg",
            }}
            style={styles.avatar}
          />
          <View style={styles.badge}>
            <Text style={styles.badgeText}>9</Text>
          </View>
        </View>

        {/* Spacer pour centrer l'avatar */}
        <View style={styles.spacer} />

        {/* Menu à droite */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowNavigationMenu(true)}
        >
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Pages Header */}
      <PagesHeader
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        onCreatePage={handleCreatePage}
      />

      {/* Content */}
      <PagesContent />

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />

      {/* Filters Modal */}
      <PagesFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
      />

      {/* Create Page Modal */}
      <CreatePageModal
        visible={showCreatePage}
        onClose={() => setShowCreatePage(false)}
        onCreatePage={handlePageCreate}
      />
    </View>
  );
};

export default PagesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
    justifyContent: "space-between",
  },
  backButton: {
    padding: 4,
  },
  spacer: {
    flex: 1,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  menuButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
});
