import React from "react";
import { useRouter } from "expo-router";
import NewsJerrScreen from "@/legacy/screens/NewsJerrScreen";

const NewsJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <NewsJerrScreen {...props} navigation={fakeNavigation} />;
};

export default NewsJerrWrapper;
