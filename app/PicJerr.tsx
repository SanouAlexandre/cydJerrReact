import React from "react";
import { useRouter } from "expo-router";
import PicJerrScreen from "@/legacy/screens/PicJerrScreen";

const PicJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <PicJerrScreen {...props} navigation={fakeNavigation} />;
};

export default PicJerrWrapper;
