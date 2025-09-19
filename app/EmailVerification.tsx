// app/EmailVerification.tsx
import { useLocalSearchParams } from "expo-router";
import EmailVerificationScreen from "@/legacy/screens/EmailVerificationScreen";

export default function EmailVerificationPage() {
  const params = useLocalSearchParams<{ email?: string }>();

  // Create a fake route/navigation object for legacy screen
  const route = { params: { email: params.email } };
  const navigation = {}; // Could map router actions if needed

  return <EmailVerificationScreen route={route} navigation={navigation} />;
}
