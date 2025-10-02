import React from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { JoyJerrStackParamList } from "../../../src/navigation/types";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

export default function JoyJerrIndex() {
  const navigation =
    useNavigation<NativeStackNavigationProp<JoyJerrStackParamList>>();

  const sections = [
    { key: "JoyJerrCommunity", label: "Community", icon: "people-outline" },
    { key: "JoyJerrMembers", label: "Membres", icon: "person-outline" },
    { key: "JoyJerrPages", label: "Pages", icon: "copy-outline" },
    { key: "JoyJerrGroups", label: "Groupes", icon: "albums-outline" },
    { key: "JoyJerrBlog", label: "Blog", icon: "newspaper-outline" },
    { key: "JoyJerrProfile", label: "Profil", icon: "id-card-outline" },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../../../attached_assets/joyJerr_1756297239250.png")}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>JoyJerr</Text>
      <View style={styles.grid}>
        {sections.map((s) => (
          <TouchableOpacity
            key={s.key}
            style={styles.item}
            onPress={() => navigation.navigate(s.key as keyof JoyJerrStackParamList)}
          >
            <View style={styles.iconCircle}>
              <Ionicons name={s.icon} size={26} color="#fff" />
            </View>
            <Text style={styles.label}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
  },
  grid: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    gap: 16,
  },
  item: {
    width: "40%",
    alignItems: "center",
    marginVertical: 8,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#6BCB77",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
  },
});
