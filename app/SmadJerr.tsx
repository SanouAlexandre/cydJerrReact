import React from "react";
import { useRouter } from "expo-router";
import SmadJerrScreen from "@/legacy/screens/SmadJerrScreen";

const SmadJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <SmadJerrScreen {...props} navigation={fakeNavigation} />;
};

export default SmadJerrWrapper;
