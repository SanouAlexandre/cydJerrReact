import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useRouter } from "expo-router";
import NavigationMenu from "./components/NavigationMenu";
import GroupsHeader from "./components/GroupsHeader";
import GroupsFilters from "./components/GroupsFilters";
import CreateGroupModal from "./components/CreateGroupModal";
import GroupsContent from "./components/GroupsContent";

const GroupsScreen: React.FC = () => {
  const router = useRouter();

  // Navigation menu state
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);
  // Filters modal state
  const [showFilters, setShowFilters] = useState<boolean>(false);
  // Create group modal state
  const [showCreateGroup, setShowCreateGroup] = useState<boolean>(false);

  // Groups header handlers
  const handleSearch = (query: string) => {
    console.log("Search query:", query);
    // Implement search logic here
  };

  const handleFilterToggle = () => {
    console.log("Filter toggle pressed");
    setShowFilters(true);
  };

  const handleCreateGroup = () => {
    console.log("Create group pressed");
    setShowCreateGroup(true);
  };

  const handleGroupCreate = (groupData: any) => {
    console.log("Group created:", groupData);
    // Implement actual group creation logic here
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
          onPress={() => router.back()}
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

      {/* Groups Header */}
      <GroupsHeader
        onSearch={handleSearch}
        onFilterToggle={handleFilterToggle}
        onCreateGroup={handleCreateGroup}
      />

      {/* Content */}
      <GroupsContent />

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />

      {/* Filters Modal */}
      <GroupsFilters
        visible={showFilters}
        onClose={() => setShowFilters(false)}
        onFiltersChange={handleFiltersChange}
      />

      {/* Create Group Modal */}
      <CreateGroupModal
        visible={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onCreateGroup={handleGroupCreate}
      />
    </View>
  );
};

export default GroupsScreen;

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
