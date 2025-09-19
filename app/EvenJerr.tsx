import React from "react";
import { useRouter } from "expo-router";
import EvenJerrScreen from "@/legacy/screens/EvenJerrScreen";

const EvenJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <EvenJerrScreen {...props} navigation={fakeNavigation} />;
};

export default EvenJerrWrapper;
