import { Tabs } from "expo-router";
import { Ionicons } from "react-native-vector-icons";

export default function FriendsLayout() {
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
          title: "FriendsHome",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friendsRequests"
        options={{
          title: "FriendsRequests",
          tabBarButton: () => null, // Masque le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-add-outline" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
