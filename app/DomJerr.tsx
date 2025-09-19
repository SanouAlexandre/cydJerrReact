import React from "react";
import { useRouter } from "expo-router";
import DomJerrScreen from "@/legacy/screens/DomJerrScreen";

const DomJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <DomJerrScreen {...props} navigation={fakeNavigation} />;
};

export default DomJerrWrapper;
