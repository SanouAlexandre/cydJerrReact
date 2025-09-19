import { Stack } from "expo-router";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function JoyJerrLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="community" options={{ title: "Community" }} />
      <Stack.Screen name="members" options={{ title: "Membres" }} />
      <Stack.Screen name="pages" options={{ title: "Pages" }} />
      <Stack.Screen name="groups" options={{ title: "Groups" }} />
      <Stack.Screen name="blog" options={{ title: "Blog" }} />
      <Stack.Screen name="profile" options={{ headerShown: false }} />
    </Stack>
  );
}
