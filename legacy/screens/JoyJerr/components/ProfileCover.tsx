import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
} from "react-native";
import {launchImageLibrary, MediaType, ImagePickerResponse} from 'react-native-image-picker';
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import userService from "../../../services/api/userService"; // ton service API

interface ProfileCoverProps {
  coverUrl: string;
  avatarUrl: string;
  name: string;
  isOnline?: boolean;
  onChangeCover?: () => void;
  refetch?: () => void; // fonction pour recharger les données du profil
}

const { width } = Dimensions.get("window");

const ProfileCover: React.FC<ProfileCoverProps> = ({
  coverUrl,
  avatarUrl,
  name,
  isOnline = false,
  onChangeCover,
  refetch,
}) => {
  const [currentAvatar, setCurrentAvatar] = useState<string>(avatarUrl);
  const [uploading, setUploading] = useState(false);

  const pickAvatarImage = async () => {
    try {
      const options = {
        mediaType: 'photo' as MediaType,
        quality: 0.8,
        includeBase64: false,
      };

      launchImageLibrary(options, (response: ImagePickerResponse) => {
        if (response.didCancel || response.errorMessage) {
          if (response.errorMessage) {
            console.error("Erreur sélection image:", response.errorMessage);
            Alert.alert("Erreur", "Impossible de sélectionner l'image.");
          }
          return;
        }

        if (response.assets && response.assets.length > 0) {
          const uri = response.assets[0].uri;
          if (uri) {
            setCurrentAvatar(uri);
            uploadAvatar(uri);
          }
        }
      });
    } catch (error) {
      console.error("Erreur sélection image:", error);
      Alert.alert("Erreur", "Impossible de sélectionner l'image.");
    }
  };

  const uploadAvatar = async (uri: string) => {
    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("avatar", {
        uri,
        type: "image/jpeg",
        name: "avatar.jpg",
      } as any);

      const response = await userService.updateAvatar(formData);
      console.log("✅ Avatar mis à jour :", response.avatar);

      Alert.alert("Succès", "Avatar mis à jour !");
      if (refetch) refetch(); // recharge les données du profil
    } catch (error) {
      console.error("❌ Erreur update avatar:", error);
      Alert.alert("Erreur", "Erreur lors de la mise à jour de l'avatar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cover Image */}
      <Image source={{ uri: coverUrl }} style={styles.coverImage} />

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image source={{ uri: currentAvatar }} style={styles.avatar} />
        {isOnline && <View style={styles.onlineIndicator} />}

        {/* Change Avatar Button */}
        <TouchableOpacity
          style={styles.changeAvatarBtn}
          onPress={pickAvatarImage}
        >
          <Ionicons name="camera" size={16} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Change Cover Button */}
      {onChangeCover && (
        <TouchableOpacity style={styles.changeCoverBtn} onPress={onChangeCover}>
          <MaterialIcons name="image" size={18} color="#fff" />
          <Text style={styles.changeCoverText}>Change Cover</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ProfileCover;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    marginBottom: 20,
  },
  coverImage: {
    width: width,
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  avatarWrapper: {
    position: "absolute",
    bottom: -20,
    alignSelf: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: "#fff",
  },
  onlineIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  changeAvatarBtn: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    borderRadius: 20,
    padding: 4,
  },
  changeCoverBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  changeCoverText: { color: "#fff", marginLeft: 4, fontSize: 12 },
});
