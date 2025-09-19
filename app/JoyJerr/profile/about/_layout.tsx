import { Tabs } from "expo-router";
import { Ionicons } from "react-native-vector-icons";

export default function AboutLayout() {
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
          title: "AboutHome",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons
              name="information-circle-outline"
              size={20}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="preferences"
        options={{
          title: "Preferences",
          tabBarButton: () => null, // Masque le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="options-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notifications",
          tabBarButton: () => null, // Masque le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarButton: () => null, // Masque le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-circle-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
