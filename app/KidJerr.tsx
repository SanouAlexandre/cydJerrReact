import React from "react";
import { useRouter } from "expo-router";
import KidJerrScreen from "@/legacy/screens/KidJerrScreen";

const KidJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <KidJerrScreen {...props} navigation={fakeNavigation} />;
};

export default KidJerrWrapper;
