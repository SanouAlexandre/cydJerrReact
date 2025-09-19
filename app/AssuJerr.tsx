import React from "react";
import { useRouter } from "expo-router";
import AssuJerrScreen from "@/legacy/screens/AssuJerrScreen";

const AssuJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <AssuJerrScreen {...props} navigation={fakeNavigation} />;
};

export default AssuJerrWrapper;
