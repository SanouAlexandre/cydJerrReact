import React from "react";
import { useRouter } from "expo-router";
import ChabJerrScreen from "@/legacy/screens/ChabJerrScreen";

// Provide a fake navigation object using router
const ChabJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <ChabJerrScreen {...props} navigation={fakeNavigation} />;
};

export default ChabJerrWrapper;
