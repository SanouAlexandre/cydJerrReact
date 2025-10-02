import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ScrollView,
} from "react-native";

// Example Parsed Data
const friendRequests = {
  received: [
    {
      id: 7,
      name: "Martina Malory",
      avatar: "https://demo.peepso.com/wp-content/peepso/users/7/5307c3ffb6-avatar-full.jpg",
      cover: "https://demo.peepso.com/wp-content/peepso/users/7/9eb0fc38ee-cover-750.jpg",
      mutualFriends: 16,
    },
    {
      id: 31,
      name: "Gordon Michaels",
      avatar: "https://demo.peepso.com/wp-content/peepso/users/31/18b0e8eff5-avatar-full.jpg",
      cover: "https://demo.peepso.com/wp-content/peepso/users/31/6abca217f9-cover-750.jpg",
      mutualFriends: 22,
    },
    {
      id: 19,
      name: "Sylvia Isley",
      avatar: "https://demo.peepso.com/wp-content/peepso/users/19/4c403a51a7-avatar-full.jpg",
      cover: "https://demo.peepso.com/wp-content/peepso/users/19/6aa6f89649-cover-750.jpg",
      mutualFriends: 1,
    },
    {
      id: 16,
      name: "Paul Jefferson",
      avatar: "https://demo.peepso.com/wp-content/peepso/users/16/2425bcccf3-avatar-full.jpg",
      cover: "https://demo.peepso.com/wp-content/peepso/users/16/805d5a4976-cover-750.jpg",
      mutualFriends: 0,
    },
  ],
  sent: [
    {
      id: 17,
      name: "Christian Peterson",
      avatar: "https://demo.peepso.com/wp-content/peepso/users/17/1ed7136978-avatar-full.jpg",
      cover: "https://demo.peepso.com/wp-content/peepso/users/17/63b25a50f3-cover-750.jpg",
      mutualFriends: 5,
    },
    {
      id: 12,
      name: "Juan Alvarez",
      avatar: "https://demo.peepso.com/wp-content/peepso/users/12/5a214affd3-avatar-full.jpg",
      cover: "https://demo.peepso.com/wp-content/peepso/users/12/367ce5326d-cover-750.jpg",
      mutualFriends: 0,
    },
  ],
};

const FriendCard = ({ user, type }) => {
  return (
    <View style={styles.card}>
      {/* Cover Image */}
      <Image source={{ uri: user.cover }} style={styles.cover} />

      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
      </View>

      {/* Name */}
      <Text style={styles.name}>{user.name}</Text>
      {user.mutualFriends > 0 && (
        <Text style={styles.mutual}>{user.mutualFriends} mutual friends</Text>
      )}

      {/* Action Buttons */}
      <View style={styles.actions}>
        {type === "received" ? (
          <>
            <TouchableOpacity style={[styles.button, styles.acceptBtn]}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectBtn]}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={[styles.button, styles.cancelBtn]}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const FriendsRequestsContent = () => {
  return (
    <View style={styles.container}>
      {/* Received Requests */}
      <Text style={styles.sectionTitle}>Received Requests</Text>
      <FlatList
        data={friendRequests.received}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FriendCard user={item} type="received" />}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        scrollEnabled={true}
      />

      {/* Sent Requests */}
      <Text style={styles.sectionTitle}>Sent Requests</Text>
      <FlatList
        data={friendRequests.sent}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <FriendCard user={item} type="sent" />}
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.list}
        scrollEnabled={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
    marginLeft: 16,
    color: "#333",
  },
  list: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 10,
    width: 220,
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cover: {
    width: "100%",
    height: 100,
  },
  avatarContainer: {
    position: "absolute",
    top: 60,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#fff",
    overflow: "hidden",
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  name: {
    marginTop: 40,
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  mutual: {
    fontSize: 13,
    color: "#666",
    marginVertical: 4,
  },
  actions: {
    flexDirection: "row",
    marginBottom: 10,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginHorizontal: 5,
  },
  acceptBtn: {
    backgroundColor: "#4CAF50",
  },
  rejectBtn: {
    backgroundColor: "#F44336",
  },
  cancelBtn: {
    backgroundColor: "#FF9800",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
  },
});

export default FriendsRequestsContent;