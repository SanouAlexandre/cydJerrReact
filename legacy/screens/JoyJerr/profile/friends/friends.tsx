import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

// Parsed data from your HTML
const friends = [
  {
    id: 21,
    name: "Alexia Torman",
    avatar: "https://demo.peepso.com/wp-content/peepso/users/21/e494f7960d-avatar-full.jpg",
    cover: "https://demo.peepso.com/wp-content/peepso/users/21/94f1b26f0a-cover-750.jpg",
    mutualFriends: 23,
  },
  {
    id: 25,
    name: "Andy Gibbs",
    avatar: "https://demo.peepso.com/wp-content/peepso/users/25/2e065a7559-avatar-full.jpg",
    cover: "https://demo.peepso.com/wp-content/peepso/users/25/ef37dc77ff-cover-750.jpg",
    mutualFriends: 14,
  },
  {
    id: 8,
    name: "Astrid Jarvis",
    avatar: "https://demo.peepso.com/wp-content/peepso/users/8/8564d62b3a-avatar-full.jpg",
    cover: "https://demo.peepso.com/wp-content/peepso/users/8/2c5980c78e-cover-750.jpg",
    mutualFriends: 22,
  },
  {
    id: 13,
    name: "Catherine Siregar",
    avatar: "https://demo.peepso.com/wp-content/peepso/users/13/fcd81dfe6b-avatar-full.jpg",
    cover: "https://demo.peepso.com/wp-content/peepso/users/13/e9b22d794d-cover-750.jpg",
    mutualFriends: 22,
  },
  {
    id: 4,
    name: "Cinda Phelps",
    avatar: "https://demo.peepso.com/wp-content/peepso/users/4/453025cc85-avatar-full.jpg",
    cover: "https://demo.peepso.com/wp-content/peepso/users/4/0def2dd6c8-cover-750.jpg",
    mutualFriends: 7,
  },
  {
    id: 1,
    name: "Tobias Westbrook",
    avatar: "https://demo.peepso.com/wp-content/peepso/users/1/5731bf0708-avatar-full.jpg",
    cover: "https://demo.peepso.com/wp-content/peepso/users/1/61561cffca-cover-750.jpg",
    mutualFriends: 2,
  },
];

const FriendCard = ({ friend }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: friend.cover }} style={styles.cover} />
      <View style={styles.avatarContainer}>
        <Image source={{ uri: friend.avatar }} style={styles.avatar} />
      </View>
      <Text style={styles.name}>{friend.name}</Text>
      <Text style={styles.mutual}>{friend.mutualFriends} mutual friends</Text>

      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={[styles.button, styles.messageBtn]}>
          <Text style={styles.buttonText}>Message</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.unfriendBtn]}>
          <Text style={styles.buttonText}>Unfriend</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.reportBtn]}>
          <Text style={styles.buttonText}>Report</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FriendsContent = () => {
  return (
    <View style={styles.container}>
      <FlatList
        data={friends}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FriendCard friend={item} />}
        contentContainerStyle={styles.listContainer}
        scrollEnabled={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    alignItems: "center",
  },
  cover: {
    width: "100%",
    height: 120,
  },
  avatarContainer: {
    position: "absolute",
    top: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  name: {
    marginTop: 50,
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  mutual: {
    fontSize: 14,
    color: "#666",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    marginVertical: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 4,
  },
  messageBtn: {
    backgroundColor: "#007bff",
  },
  unfriendBtn: {
    backgroundColor: "#ff9800",
  },
  reportBtn: {
    backgroundColor: "#f44336",
  },
  buttonText: {
    color: "#fff",
    fontSize: 14,
  },
});

export default FriendsContent;