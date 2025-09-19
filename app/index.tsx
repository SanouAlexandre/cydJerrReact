import { useEffect } from "react";
import { router } from "expo-router";
import { View } from "react-native";

export default function RootIndex() {
  useEffect(() => {
    // Use a small delay to ensure the Root Layout is mounted
    const timer = setTimeout(() => {
      router.replace("/login");
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Return a simple view while waiting for navigation
  return <View style={{ flex: 1 }} />;
}
