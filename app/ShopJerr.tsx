import React from "react";
import { useRouter } from "expo-router";
import ShopJerrScreen from "@/legacy/screens/ShopJerrScreen";

const ShopJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };
  return <ShopJerrScreen {...props} navigation={fakeNavigation} />;
};

export default ShopJerrWrapper;
