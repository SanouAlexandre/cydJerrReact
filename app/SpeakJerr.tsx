import React from "react";
import { useRouter } from "expo-router";
import SpeakJerrScreen from "@/legacy/screens/SpeakJerr/SpeakJerrScreen";

const SpeakJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <SpeakJerrScreen {...props} navigation={fakeNavigation} />;
};

export default SpeakJerrWrapper;
