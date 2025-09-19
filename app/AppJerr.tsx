import React from "react";
import { useRouter } from "expo-router";
import AppJerrScreen from "@/legacy/screens/AppJerrScreen";

const AppJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <AppJerrScreen {...props} navigation={fakeNavigation} />;
};

export default AppJerrWrapper;
