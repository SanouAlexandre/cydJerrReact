import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const screenWidth = Dimensions.get("window").width;

// Example data for followers
const followers = [
  {
    id: 4,
    name: "Cinda Phelps",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/4/453025cc85-avatar-full.jpg",
    cover:
      "https://demo.peepso.com/wp-content/peepso/users/4/0def2dd6c8-cover-750.jpg",
    mutualFriends: 7,
    followers: 20,
  },
  {
    id: 21,
    name: "Alexia Torman",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/21/e494f7960d-avatar-full.jpg",
    cover:
      "https://demo.peepso.com/wp-content/peepso/users/21/94f1b26f0a-cover-750.jpg",
    mutualFriends: 23,
    followers: 27,
  },
  {
    id: 1,
    name: "Tobias Westbrook",
    avatar:
      "https://demo.peepso.com/wp-content/peepso/users/1/5731bf0708-avatar-full.jpg",
    cover:
      "https://demo.peepso.com/wp-content/peepso/users/1/61561cffca-cover-750.jpg",
    mutualFriends: 2,
    followers: 18,
  },
];

const FollowerCard = ({ user }) => (
  <View style={styles.followerCard}>
    <Image source={{ uri: user.cover }} style={styles.followerCover} />
    <View style={styles.followerAvatarContainer}>
      <Image source={{ uri: user.avatar }} style={styles.followerAvatar} />
    </View>
    <Text style={styles.followerName}>{user.name}</Text>
    <Text style={styles.followerDetails}>
      {user.mutualFriends} mutual friends • {user.followers} followers
    </Text>

    {/* Action Buttons */}
    <View style={styles.followerActions}>
      <TouchableOpacity style={styles.followerButton}>
        <Text style={styles.followerButtonText}>Report</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.followerButton, styles.followerBanButton]}
      >
        <Text style={styles.followerButtonText}>Ban</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const FollowersContent = () => {
  return (
    <ScrollView style={styles.container}>
      {/* Followers List Section */}
      <View style={styles.followersSection}>
        <Text style={styles.sectionTitle}>Followers</Text>
        <FlatList
          data={followers}
          renderItem={({ item }) => <FollowerCard user={item} />}
          keyExtractor={(item) => item.id.toString()}
          horizontal={false}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  // Followers section styles
  followersSection: {
    backgroundColor: "#fff",
    margin: 10,
    borderRadius: 8,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#333",
  },
  followerCard: {
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    overflow: "hidden",
    alignItems: "center",
  },
  followerCover: {
    width: "100%",
    height: 120,
  },
  followerAvatarContainer: {
    position: "absolute",
    top: 80,
    borderWidth: 3,
    borderColor: "#fff",
    borderRadius: 50,
    overflow: "hidden",
  },
  followerAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  followerName: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  followerDetails: {
    fontSize: 14,
    color: "#666",
    marginVertical: 6,
  },
  followerActions: {
    flexDirection: "row",
    marginBottom: 12,
  },
  followerButton: {
    backgroundColor: "#007bff",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  followerBanButton: {
    backgroundColor: "#ff4d4f",
  },
  followerButtonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default FollowersContent;
