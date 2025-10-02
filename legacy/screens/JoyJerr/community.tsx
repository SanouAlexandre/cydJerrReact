import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useUserProfile } from "../../hooks/useApi";
import { useSelector } from "react-redux";
import { selectUserAvatar } from "../../redux/userSlice";

import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { JoyJerrStackParamList } from '../../../src/navigation/types';
import CommunityContent from "./components/communityContent";
import NavigationMenu from "./components/NavigationMenu";

const CommunityScreen: React.FC = () => {
  // Récupérer les données de l'utilisateur connecté
  const { data } = useUserProfile("current"); // data = { success: boolean, user: {...} }

  // 🔍 Debug complet
  console.log("✅ Contenu brut de data:", data);
  console.log("✅ Contenu JSON de data:", JSON.stringify(data, null, 2));

  // Extraire l'utilisateur
  const user = data?.user?.data?.user;

  // Avatar par défaut si l'utilisateur n'en a pas
  const avatarUri = user?.avatar?.url;

  // Nom complet
  const userName =
    `${user?.firstName || ""} ${user?.lastName || ""}`.trim() || "Anonymous";

  // 🔍 Debug
  console.log("✅ Utilisateur connecté :", user);
  console.log("✅ Avatar URI :", avatarUri);
  console.log("✅ Nom utilisateur :", userName);

  const navigation = useNavigation<NativeStackNavigationProp<JoyJerrStackParamList>>();

  // Navigation menu state
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <View style={styles.headerWrapper}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        {/* Search Bar à gauche */}
        <View style={styles.searchWrapper}>
          <Ionicons
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#999"
            style={styles.searchInput}
          />
        </View>
        {/* Avatar avec badge au centre */}
        <View style={styles.avatarWrapper}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, styles.defaultAvatar]}>
              <Ionicons name="person" size={24} color="#666" />
            </View>
          )}
          <View style={styles.badge}>
            <Text style={styles.badgeText}>9</Text>
          </View>
        </View>
        {/* Menu à droite */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowNavigationMenu(true)}
        >
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <CommunityContent />

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />
    </View>
  );
};

export default CommunityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    marginRight: 8,
    padding: 4,
  },
  headerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 10,
    height: 36,
  },
  searchIcon: {
    marginRight: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: "100%",
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
    marginLeft: 10,
  },
  defaultAvatar: {
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
});
