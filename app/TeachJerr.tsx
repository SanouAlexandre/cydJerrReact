import React from "react";
import { useRouter } from "expo-router";
import TeachJerrScreen from "@/legacy/screens/TeachJerrScreen";

const TeachJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <TeachJerrScreen {...props} navigation={fakeNavigation} />;
};

export default TeachJerrWrapper;
