import React from "react";
import { useRouter } from "expo-router";
import CodJerrScreen from "@/legacy/screens/CodJerrScreen";

const CodeJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <CodJerrScreen {...props} navigation={fakeNavigation} />;
};

export default CodeJerrWrapper;
