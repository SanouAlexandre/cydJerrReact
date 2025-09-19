import React from "react";
import { useRouter } from "expo-router";
import LeaseJerrScreen from "@/legacy/screens/LeaseJerrScreen";

const LeaseJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <LeaseJerrScreen {...props} navigation={fakeNavigation} />;
};

export default LeaseJerrWrapper;
