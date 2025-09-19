import { Tabs } from "expo-router";
import { Ionicons } from "react-native-vector-icons";

export default function ProfileLayout() {
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
          title: "Profile",
          tabBarButton: () => null, // cache complètement le tab
          tabBarStyle: { display: "none" },
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="stream"
        options={{
          title: "Stream",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="albums" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="information-circle" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="blog"
        options={{
          title: "Blog",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="book" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="followers"
        options={{
          title: "Followers",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="people" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="friends"
        options={{
          title: "Friends",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-outline" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="groups"
        options={{
          title: "Groups",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="people-circle" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="photos"
        options={{
          title: "Photos",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="images" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="audio-videos"
        options={{
          title: "Audio & Videos",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="musical-notes" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="files"
        options={{
          title: "Files",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="document" size={20} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="pages"
        options={{
          title: "Pages",
          tabBarButton: () => null, // cache complètement le tab
          tabBarIcon: ({ color }) => (
            <Ionicons name="reader" size={20} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
