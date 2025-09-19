import React from "react";
import { useRouter } from "expo-router";
import VagoJerrScreen from "@/legacy/screens/VagoJerrScreen";

const VagoJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <VagoJerrScreen {...props} navigation={fakeNavigation} />;
};

export default VagoJerrWrapper;
