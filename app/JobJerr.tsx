import React from "react";
import { useRouter } from "expo-router";
import JobJerrScreen from "@/legacy/screens/JobJerrScreen";

const JobJerrWrapper = (props: any) => {
  const router = useRouter();

  const fakeNavigation = {
    goBack: () => router.back(),
    navigate: (path: string) => router.push(path),
    replace: (path: string) => router.replace(path),
  };

  return <JobJerrScreen {...props} navigation={fakeNavigation} />;
};

export default JobJerrWrapper;
