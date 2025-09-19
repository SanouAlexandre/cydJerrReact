import { Tabs } from "expo-router";
import { Ionicons } from "react-native-vector-icons";

export default function AudioVideoLayout() {
  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        tabBarActiveTintColor: "#007AFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "AudioVideoHome",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="musical-notes-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="audio"
        options={{
          title: "Audio",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="musical-notes-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="videos"
        options={{
          title: "Videos",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="videocam-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
