
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useRouter } from "expo-router";
import NavigationMenu from "./components/NavigationMenu";
import BlogContent from "./components/BlogContent";

const BlogScreen: React.FC = () => {
  const router = useRouter();

  // Navigation menu state
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);

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

      {/* Content */}
      <BlogContent />

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />
    </View>
  );
};

export default BlogScreen;

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
  
});
