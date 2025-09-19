import React from "react";
import { useRouter } from "expo-router";
import AvoJerrScreen from "@/legacy/screens/AvoJerrScreen";

const AvoJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <AvoJerrScreen {...props} navigation={fakeNavigation} />;
};

export default AvoJerrWrapper;
