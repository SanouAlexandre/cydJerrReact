import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/legacy/redux/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Créer un QueryClient
const queryClient = new QueryClient();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" options={{ headerShown: false }} />
            <Stack.Screen name="login" options={{ headerShown: false }} />
            <Stack.Screen name="signup" options={{ headerShown: false }} />
            <Stack.Screen
              name="EmailVerification"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="home" options={{ headerShown: false }} />
            <Stack.Screen
              name="CydJerrNation"
              options={{ headerShown: false }}
            />
            <Stack.Screen name="JoyJerr" options={{ headerShown: false }} />
            <Stack.Screen name="KidJerr" options={{ headerShown: false }} />
            <Stack.Screen name="NewsJerr" options={{ headerShown: false }} />
            <Stack.Screen name="CapiJerr" options={{ headerShown: false }} />
            <Stack.Screen name="ChabJerr" options={{ headerShown: false }} />
            <Stack.Screen name="EvenJerr" options={{ headerShown: false }} />
            <Stack.Screen name="PiolJerr" options={{ headerShown: false }} />
            <Stack.Screen name="VagoJerr" options={{ headerShown: false }} />
            <Stack.Screen name="SpeakJerr" options={{ headerShown: false }} />
            <Stack.Screen name="JobJerr" options={{ headerShown: false }} />
            <Stack.Screen name="CodeJerr" options={{ headerShown: false }} />
            <Stack.Screen name="LeaseJerr" options={{ headerShown: false }} />
            <Stack.Screen name="StarJerr" options={{ headerShown: false }} />
            <Stack.Screen name="TeachJerr" options={{ headerShown: false }} />
            <Stack.Screen name="CloudJerr" options={{ headerShown: false }} />
            <Stack.Screen name="AssuJerr" options={{ headerShown: false }} />
            <Stack.Screen name="FundingJerr" options={{ headerShown: false }} />
            <Stack.Screen name="AvoJerr" options={{ headerShown: false }} />
            <Stack.Screen name="ShopJerr" options={{ headerShown: false }} />
            <Stack.Screen name="ImmoJerr" options={{ headerShown: false }} />
            <Stack.Screen name="DoctoJerr" options={{ headerShown: false }} />
            <Stack.Screen name="AppJerr" options={{ headerShown: false }} />
            <Stack.Screen name="DomJerr" options={{ headerShown: false }} />
            <Stack.Screen name="PicJerr" options={{ headerShown: false }} />
            <Stack.Screen name="SmadJerr" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
