import React from "react";
import { useRouter } from "expo-router";
import CapiJerrScreen from "@/legacy/screens/CapiJerrScreen";

// Provide a fake navigation object using router
const CapiJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <CapiJerrScreen {...props} navigation={fakeNavigation} />;
};

export default CapiJerrWrapper;
