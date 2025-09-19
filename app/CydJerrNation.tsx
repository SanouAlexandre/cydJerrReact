import React from "react";
import { useRouter } from "expo-router";
import CydJerrNationScreen from "@/legacy/screens/CydJerrNationScreen";

const CydJerrNationWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <CydJerrNationScreen {...props} navigation={fakeNavigation} />;
};

export default CydJerrNationWrapper;
