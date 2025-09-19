import React from "react";
import { useRouter } from "expo-router";
import StarJerrScreen from "@/legacy/screens/StarJerrScreen";

const StarJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <StarJerrScreen {...props} navigation={fakeNavigation} />;
};

export default StarJerrWrapper;
