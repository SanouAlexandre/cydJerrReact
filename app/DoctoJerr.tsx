import React from "react";
import { useRouter } from "expo-router";
import DoctoJerrScreen from "@/legacy/screens/DoctoJerrScreen";

const DoctoJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <DoctoJerrScreen {...props} navigation={fakeNavigation} />;
};

export default DoctoJerrWrapper;
