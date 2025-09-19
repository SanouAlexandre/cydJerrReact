// app/joyJerr.tsx
import React from "react";
import { useRouter } from "expo-router";
import JoyJerrScreen from "@/legacy/screens/JoyJerrScreen";

// Provide a fake navigation object using router
const JoyJerrWrapper = (props: any) => {
  const router = useRouter();
  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <JoyJerrScreen {...props} navigation={fakeNavigation} />;
};

export default JoyJerrWrapper;
