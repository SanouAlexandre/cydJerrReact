import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

// Import des écrans
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MenuScreen from '../screens/MenuScreen';
import CydJerrNationScreen from '../screens/CydJerrNationScreen';
import JoyJerrScreen from '../screens/JoyJerrScreen';
import SagaJerrScreen from '../screens/SagaJerrScreen';
import NewsJerrScreen from '../screens/NewsJerrScreen';
import SpeakJerrScreen from '../screens/SpeakJerr/SpeakJerrScreen';
import ChatScreen from '../screens/SpeakJerr/ChatScreen';
import ChabJerrScreen from '../screens/ChabJerrScreen';
// import ChabJerrScreenSimple from '../screens/ChabJerrScreenSimple';

import PiolJerrScreen from '../screens/PiolJerrScreen';
import EvenJerrScreen from '../screens/EvenJerrScreen';
import ShopJerrScreen from '../screens/ShopJerrScreen';
import CapiJerrScreen from '../screens/CapiJerrScreen';
import JobJerrScreen from '../screens/JobJerrScreen';
import TeachJerrScreen from '../screens/TeachJerrScreen';
import StarJerrScreen from '../screens/StarJerrScreen';
import StarJerrCategoryScreen from '../screens/StarJerrCategoryScreen';
import StarJerrSearchResultsScreen from '../screens/StarJerrSearchResultsScreen';
import StarTokensScreen from '../screens/StarTokensScreen';
import FundingJerrScreen from '../screens/FundingJerrScreen';
import KidJerrScreen from '../screens/KidJerrScreen';
import CloudJerrScreen from '../screens/CloudJerrScreen';
import FileManagerScreen from '../screens/FileManagerScreen';
import StoragePlansScreen from '../screens/StoragePlansScreen';
import CloudSettingsScreen from '../screens/CloudSettingsScreen';
import DoctoJerrScreen from '../screens/DoctoJerrScreen';
import AvoJerrScreen from '../screens/AvoJerrScreen';
import AssuJerrScreen from '../screens/AssuJerrScreen';
import DomJerrScreen from '../screens/DomJerrScreen';
import VagoJerrScreen from '../screens/VagoJerrScreen';
import ImmoJerrScreen from '../screens/ImmoJerrScreen';
import AppJerrScreen from '../screens/AppJerrScreen';
import SmadJerrScreen from '../screens/SmadJerrScreen';
import GameJerrScreen from '../screens/GameJerrScreen';
import PicJerrScreen from '../screens/PicJerrScreen';
import CodJerrScreen from '../screens/CodJerrScreen';
import LeaseJerrScreen from '../screens/LeaseJerrScreen';
import CreateGroupScreen from '../screens/CreateGroupScreen';
import ComposeMessageScreen from '../screens/ComposeMessageScreen';
import ContactsScreen from '../screens/SpeakJerr/ContactsScreen';
import CreateStatusScreen from '../screens/SpeakJerr/CreateStatusScreen';
import StatusViewerScreen from '../screens/SpeakJerr/StatusViewerScreen';
import InvestmentHistoryScreen from '../screens/InvestmentHistoryScreen';
import PlanDetailsScreen from '../screens/PlanDetailsScreen';
import TransferScreen from '../screens/TransferScreen';
import CapiJerrProfileScreen from '../screens/CapiJerrProfileScreen';
import VideoPlayerScreen from '../screens/VideoPlayerScreen';
import VideoUploadScreen from '../screens/VideoUploadScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import StarDetailsScreen from '../screens/StarDetailsScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack Navigator pour l'écran d'accueil
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="CydJerrNation" component={CydJerrNationScreen} />
      <Stack.Screen name="JoyJerr" component={JoyJerrScreen} />
      <Stack.Screen name="SagaJerr" component={SagaJerrScreen} />
      <Stack.Screen name="NewsJerr" component={NewsJerrScreen} />
      <Stack.Screen name="SpeakJerr" component={SpeakJerrScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
      <Stack.Screen name="ChabJerr" component={ChabJerrScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="VideoUpload" component={VideoUploadScreen} />
      <Stack.Screen name="PiolJerr" component={PiolJerrScreen} />
      <Stack.Screen name="EvenJerr" component={EvenJerrScreen} />
      <Stack.Screen name="ShopJerr" component={ShopJerrScreen} />
      <Stack.Screen name="CapiJerr" component={CapiJerrScreen} />
      <Stack.Screen name="JobJerr" component={JobJerrScreen} />
      <Stack.Screen name="TeachJerr" component={TeachJerrScreen} />
      <Stack.Screen name="StarJerr" component={StarJerrScreen} />
      <Stack.Screen name="CategoryDetails" component={CategoryDetailsScreen} />
      <Stack.Screen name="StarDetails" component={StarDetailsScreen} />
      <Stack.Screen name="StarJerrCategory" component={StarJerrCategoryScreen} />
      <Stack.Screen name="StarJerrSearchResults" component={StarJerrSearchResultsScreen} />
      <Stack.Screen name="StarTokens" component={StarTokensScreen} />
      <Stack.Screen name="FundingJerr" component={FundingJerrScreen} />
      <Stack.Screen name="KidJerr" component={KidJerrScreen} />
      <Stack.Screen name="CloudJerr" component={CloudJerrScreen} />
      <Stack.Screen name="FileManager" component={FileManagerScreen} />
      <Stack.Screen name="StoragePlans" component={StoragePlansScreen} />
      <Stack.Screen name="CloudSettings" component={CloudSettingsScreen} />
      <Stack.Screen name="DoctoJerr" component={DoctoJerrScreen} />
      <Stack.Screen name="AvoJerr" component={AvoJerrScreen} />
      <Stack.Screen name="AssuJerr" component={AssuJerrScreen} />
      <Stack.Screen name="DomJerr" component={DomJerrScreen} />
      <Stack.Screen name="VagoJerr" component={VagoJerrScreen} />
      <Stack.Screen name="ImmoJerr" component={ImmoJerrScreen} />
      <Stack.Screen name="AppJerr" component={AppJerrScreen} />
      <Stack.Screen name="SmadJerr" component={SmadJerrScreen} />
      <Stack.Screen name="GameJerr" component={GameJerrScreen} />
      <Stack.Screen name="PicJerr" component={PicJerrScreen} />
      <Stack.Screen name="CodJerr" component={CodJerrScreen} />
      <Stack.Screen name="LeaseJerr" component={LeaseJerrScreen} />
      <Stack.Screen name="CreateGroup" component={CreateGroupScreen} />
      <Stack.Screen name="ComposeMessage" component={ComposeMessageScreen} />
      <Stack.Screen name="ContactsScreen" component={ContactsScreen} />
      <Stack.Screen name="CreateStatusScreen" component={CreateStatusScreen} />
      <Stack.Screen name="StatusViewerScreen" component={StatusViewerScreen} />
      <Stack.Screen name="InvestmentHistory" component={InvestmentHistoryScreen} />
      <Stack.Screen name="PlanDetails" component={PlanDetailsScreen} />
      <Stack.Screen name="Transfer" component={TransferScreen} />
      <Stack.Screen name="CapiJerrProfile" component={CapiJerrProfileScreen} />
    </Stack.Navigator>
  );
}

// Tab Navigator principal
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Search') {
            iconName = focused ? 'magnify' : 'magnify';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'account' : 'account-outline';
          } else if (route.name === 'Menu') {
            iconName = focused ? 'menu' : 'menu';
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#FF6B35',
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          borderTopWidth: 0,
          height: Platform.OS === 'ios' ? 90 : 70,
          paddingBottom: Platform.OS === 'ios' ? 25 : 10,
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={['rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.7)']}
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              height: Platform.OS === 'ios' ? 90 : 70,
            }}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeStack} 
        options={{ tabBarLabel: 'Accueil' }}
      />
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{ tabBarLabel: 'Recherche' }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{ tabBarLabel: 'Profil' }}
      />
      <Tab.Screen 
        name="Menu" 
        component={MenuScreen} 
        options={{ tabBarLabel: 'Menu' }}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;