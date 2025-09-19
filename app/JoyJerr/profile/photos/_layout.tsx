import { Tabs } from "expo-router";
import { Ionicons } from "react-native-vector-icons";

export default function PhotosLayout() {
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
          title: "PhotosHome",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="images-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="images-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="albums"
        options={{
          title: "Albums",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
