import React from "react";
import { useRouter } from "expo-router";
import PiolJerrScreen from "@/legacy/screens/PiolJerrScreen";

const PiolJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <PiolJerrScreen {...props} navigation={fakeNavigation} />;
};

export default PiolJerrWrapper;
