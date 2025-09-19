import React from "react";
import { useRouter } from "expo-router";
import CloudJerrScreen from "@/legacy/screens/CloudJerrScreen";

const CloudJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <CloudJerrScreen {...props} navigation={fakeNavigation} />;
};

export default CloudJerrWrapper;
