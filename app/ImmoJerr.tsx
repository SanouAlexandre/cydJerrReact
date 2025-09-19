import React from "react";
import { useRouter } from "expo-router";
import ImmoJerrScreen from "@/legacy/screens/ImmoJerrScreen";

const ImmoJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <ImmoJerrScreen {...props} navigation={fakeNavigation} />;
};

export default ImmoJerrWrapper;
