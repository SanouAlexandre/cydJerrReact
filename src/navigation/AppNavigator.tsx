import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from '@/hooks/useColorScheme';
import { DarkTheme, DefaultTheme } from '@react-navigation/native';

// Import screens
import IndexScreen from '@/app/index';
import LoginScreen from '@/app/login';
import SignupScreen from '@/app/signup';
import EmailVerificationScreen from '@/app/EmailVerification';
import HomeScreen from '@/app/home';
import CydJerrNationScreen from '@/app/CydJerrNation';
import KidJerrScreen from '@/app/KidJerr';
import NewsJerrScreen from '@/app/NewsJerr';
import CapiJerrScreen from '@/app/CapiJerr';
import ChabJerrScreen from '@/app/ChabJerr';
import EvenJerrScreen from '@/app/EvenJerr';
import PiolJerrScreen from '@/app/PiolJerr';
import VagoJerrScreen from '@/app/VagoJerr';
import SpeakJerrScreen from '@/app/SpeakJerr';
import JobJerrScreen from '@/app/JobJerr';
import CodeJerrScreen from '@/app/CodeJerr';
import LeaseJerrScreen from '@/app/LeaseJerr';
import StarJerrScreen from '@/app/StarJerr';
import TeachJerrScreen from '@/app/TeachJerr';
import CloudJerrScreen from '@/app/CloudJerr';
import AssuJerrScreen from '@/app/AssuJerr';
import FundingJerrScreen from '@/app/FundingJerr';
import AvoJerrScreen from '@/app/AvoJerr';
import ShopJerrScreen from '@/app/ShopJerr';
import ImmoJerrScreen from '@/app/ImmoJerr';
import DoctoJerrScreen from '@/app/DoctoJerr';
import AppJerrScreen from '@/app/AppJerr';
import DomJerrScreen from '@/app/DomJerr';
import PicJerrScreen from '@/app/PicJerr';
import SmadJerrScreen from '@/app/SmadJerr';
import NotFoundScreen from '@/app/+not-found';

// Import tab screens
import TabHomeScreen from '@/app/(tabs)/index';
import ExploreScreen from '@/app/(tabs)/explore';

// Import JoyJerr screens
import JoyJerrNavigator from './JoyJerrNavigator';

// Import components for tabs
import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Navigator
function TabNavigator() {
  const colorScheme = useColorScheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: () => <TabBarBackground />,
        tabBarStyle: Platform.select({
          ios: {
            position: 'absolute',
          },
          default: {},
        }),
      }}
    >
      <Tab.Screen
        name="TabHome"
        component={TabHomeScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="house.fill" color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Explore"
        component={ExploreScreen}
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="paperplane.fill" color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Main Stack Navigator
function AppNavigator() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Index" component={IndexScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen
          name="EmailVerification"
          component={EmailVerificationScreen}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="CydJerrNation" component={CydJerrNationScreen} />
        <Stack.Screen name="JoyJerr" component={JoyJerrNavigator} />
        <Stack.Screen name="KidJerr" component={KidJerrScreen} />
        <Stack.Screen name="NewsJerr" component={NewsJerrScreen} />
        <Stack.Screen name="CapiJerr" component={CapiJerrScreen} />
        <Stack.Screen name="ChabJerr" component={ChabJerrScreen} />
        <Stack.Screen name="EvenJerr" component={EvenJerrScreen} />
        <Stack.Screen name="PiolJerr" component={PiolJerrScreen} />
        <Stack.Screen name="VagoJerr" component={VagoJerrScreen} />
        <Stack.Screen name="SpeakJerr" component={SpeakJerrScreen} />
        <Stack.Screen name="JobJerr" component={JobJerrScreen} />
        <Stack.Screen name="CodeJerr" component={CodeJerrScreen} />
        <Stack.Screen name="LeaseJerr" component={LeaseJerrScreen} />
        <Stack.Screen name="StarJerr" component={StarJerrScreen} />
        <Stack.Screen name="TeachJerr" component={TeachJerrScreen} />
        <Stack.Screen name="CloudJerr" component={CloudJerrScreen} />
        <Stack.Screen name="AssuJerr" component={AssuJerrScreen} />
        <Stack.Screen name="FundingJerr" component={FundingJerrScreen} />
        <Stack.Screen name="AvoJerr" component={AvoJerrScreen} />
        <Stack.Screen name="ShopJerr" component={ShopJerrScreen} />
        <Stack.Screen name="ImmoJerr" component={ImmoJerrScreen} />
        <Stack.Screen name="DoctoJerr" component={DoctoJerrScreen} />
        <Stack.Screen name="AppJerr" component={AppJerrScreen} />
        <Stack.Screen name="DomJerr" component={DomJerrScreen} />
        <Stack.Screen name="PicJerr" component={PicJerrScreen} />
        <Stack.Screen name="SmadJerr" component={SmadJerrScreen} />
        <Stack.Screen name="Tabs" component={TabNavigator} />
        <Stack.Screen name="NotFound" component={NotFoundScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;
