import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";

interface ProfileFooterProps {
  name: string;
  friends: number;
  followers: number;
  following: number;
  views: number;
  onUpdateInfo?: () => void;
}

const ProfileFooter: React.FC<ProfileFooterProps> = ({
  name,
  friends,
  followers,
  following,
  views,
  onUpdateInfo,
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Name */}
      <Text style={styles.name}>{name}</Text>

      {/* Stats - First Row */}
      <View style={styles.statsRow}>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.stat}>
            <Ionicons name="people-outline" size={14} /> {friends} Friends
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.stat}>
            <Ionicons name="person-add-outline" size={14} /> {followers}{" "}
            Followers
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.stat}>
            <Ionicons name="person-outline" size={14} /> {following} Following
          </Text>
        </TouchableOpacity>
      </View>

      {/* Stats - Second Row */}
      <View style={styles.secondStatsRow}>
        <TouchableOpacity style={styles.statButton}>
          <Text style={styles.stat}>
            <Ionicons name="eye-outline" size={14} /> {views} Profile Views
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="thumbs-up-outline" size={16} color="#555" />
          <Text style={styles.likeButtonText}>Like</Text>
        </TouchableOpacity>
      </View>

      {/* Update Info Button */}
      <TouchableOpacity style={styles.updateBtn} onPress={onUpdateInfo}>
        <Ionicons name="person-circle-outline" size={16} color="#fff" />
        <Text style={styles.updateBtnText}>Update Info</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ProfileFooter;

const styles = StyleSheet.create({
  container: { padding: 0, backgroundColor: "#fff", marginTop: 10 },
  name: { fontSize: 20, fontWeight: "bold", textAlign: "center" },
  statsRow: {
    flexDirection: "row",
    justifyContent: "center", // Aligné au début
    gap: 15, // Ajoute un espace fixe entre chaque bouton
    marginTop: 10,
    marginBottom: 8,
  },

  secondStatsRow: {
    flexDirection: "row",
    justifyContent: "center", // Même alignement à gauche
    gap: 20, // Un peu plus d’espace si nécessaire
    alignItems: "center",
    marginBottom: 15,
  },

  statButton: {
    padding: 5,
  },

  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },

  stat: {
    fontSize: 12,
    color: "#555",
    marginVertical: 2,
  },

  likeButtonText: {
    color: "#555",
    marginLeft: 4,
    fontSize: 12,
    fontWeight: "600",
  },

  updateBtn: {
    alignSelf: "center",
    flexDirection: "row",
    backgroundColor: "#007bff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    marginBottom: 10,
  },
  updateBtnText: { color: "#fff", marginLeft: 6, fontSize: 14 },
});
