import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { useRouter } from "expo-router";
import NavigationMenu from "../components/NavigationMenu";
import ProfileCover from "../components/ProfileCover";
import ProfileFooter from "../components/ProfileFooter";

// 🔥 Importe tes pages ici
import StreamContent from "./stream";
import AboutHomeContent from "./about";
import BlogContent from "./blog";
import FollowersContent from "./followers";
import FriendsContent from "./friends";
import GroupsContent from "./groups";
import PhotosContent from "./photos";
import AudioVideoContent from "./audio-videos";
import FilesContent from "./files";
import PagesContent from "./pages";

export default function ProfileIndex() {
  const router = useRouter();
  const [showNavigationMenu, setShowNavigationMenu] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("Stream");

  const profileMenuItems = [
    { label: "Stream", icon: "home-outline", component: "Stream" },
    { label: "About", icon: "person-circle-outline", component: "About" },
    { label: "Blog", icon: "reader-outline", component: "Blog" },
    { label: "Followers", icon: "person-add-outline", component: "Followers" },
    { label: "Friends", icon: "people-outline", component: "Friends" },
    { label: "Groups", icon: "people-circle-outline", component: "Groups" },
    { label: "Photos", icon: "images-outline", component: "Photos" },
    {
      label: "Audio & Video",
      icon: "videocam-outline",
      component: "AudioVideo",
    },
    { label: "Files", icon: "document-outline", component: "Files" },
    { label: "Pages", icon: "star-outline", component: "Pages" },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "Stream":
        return <StreamContent />;
      case "About":
        return <AboutHomeContent />;
      case "Blog":
        return <BlogContent />;
      case "Followers":
        return <FollowersContent />;
      case "Friends":
        return <FriendsContent />;
      case "Groups":
        return <GroupsContent />;
      case "Photos":
        return <PhotosContent />;
      case "AudioVideo":
        return <AudioVideoContent />;
      case "Files":
        return <FilesContent />;
      case "Pages":
        return <PagesContent />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerWrapper}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>

        {/* Search Bar */}
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

        {/* Avatar with Badge */}
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

        {/* Menu Button */}
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setShowNavigationMenu(true)}
        >
          <Ionicons name="menu" size={28} color="black" />
        </TouchableOpacity>
      </View>

      <ScrollView>
        <View style={styles.profileContainer}>
          {/* Profile Cover */}
          <ProfileCover
            coverUrl="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
            avatarUrl="https://demo.peepso.com/wp-content/peepso/users/2/ec758423ef-avatar-full.jpg"
            name="Ashley Smith"
            isOnline={true}
            onUpdateInfo={() => console.log("Update info pressed")}
            onChangeCover={() => console.log("Change cover pressed")}
            onChangeAvatar={() => console.log("Change avatar pressed")}
          />

          {/* Profile Footer */}
          <ProfileFooter
            name="Ashley Smith"
            friends={245}
            followers={1205}
            following={180}
            views={5420}
            onUpdateInfo={() => console.log("Update info pressed")}
          />

          {/* Profile Menu Tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.profileMenuScroll}
          >
            {profileMenuItems.map((item, idx) => (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.profileMenuItem,
                  activeTab === item.component && styles.activeTab,
                ]}
                onPress={() => setActiveTab(item.component)}
              >
                <Ionicons
                  name={item.icon as any}
                  size={18}
                  color={activeTab === item.component ? "#007AFF" : "#555"}
                />
                <Text
                  style={[
                    styles.profileMenuLabel,
                    activeTab === item.component && styles.activeTabText,
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Dynamic Content */}
        <View style={styles.content}>{renderContent()}</View>
      </ScrollView>

      {/* Navigation Menu */}
      <NavigationMenu
        visible={showNavigationMenu}
        onClose={() => setShowNavigationMenu(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  profileContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    overflow: "hidden",
    margin: 10,
    elevation: 3, // Android shadow
    shadowColor: "#000", // iOS shadow
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  content: { padding: 16 },
  postBox: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    marginRight: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
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
    marginLeft: 8,
  },
  profileMenuScroll: { marginTop: 8 },
  profileMenuItem: {
    alignItems: "center",
    marginHorizontal: 10,
    paddingVertical: 8,
  },
  profileMenuLabel: { fontSize: 12, marginTop: 4, color: "#555" },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: "#007AFF",
  },
  activeTabText: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});
