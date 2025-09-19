import React from "react";
import { useRouter } from "expo-router";
import FundingJerrScreen from "@/legacy/screens/FundingJerrScreen";

const FundingJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <FundingJerrScreen {...props} navigation={fakeNavigation} />;
};

export default FundingJerrWrapper;
