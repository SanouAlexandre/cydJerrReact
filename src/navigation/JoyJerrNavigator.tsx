import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Import JoyJerr screens (use relative paths to avoid alias resolution issues)
import JoyJerrIndexScreen from '../../legacy/screens/JoyJerr/index';
import JoyJerrCommunityScreen from '../../legacy/screens/JoyJerr/community';
import JoyJerrMembersScreen from '../../legacy/screens/JoyJerr/members';
import JoyJerrPagesScreen from '../../legacy/screens/JoyJerr/pages';
import JoyJerrGroupsScreen from '../../legacy/screens/JoyJerr/groups';
import JoyJerrBlogScreen from '../../legacy/screens/JoyJerr/blog';
import JoyJerrProfileScreen from '../../legacy/screens/JoyJerr/profile/index';

const Stack = createNativeStackNavigator();

function JoyJerrNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: "#fff" },
        headerTintColor: "#000",
        headerTitleAlign: "center",
      }}
    >
      <Stack.Screen 
        name="JoyJerrIndex" 
        component={JoyJerrIndexScreen} 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="JoyJerrCommunity" 
        component={JoyJerrCommunityScreen} 
        options={{ title: "Community" }} 
      />
      <Stack.Screen 
        name="JoyJerrMembers" 
        component={JoyJerrMembersScreen} 
        options={{ title: "Membres" }} 
      />
      <Stack.Screen 
        name="JoyJerrPages" 
        component={JoyJerrPagesScreen} 
        options={{ title: "Pages" }} 
      />
      <Stack.Screen 
        name="JoyJerrGroups" 
        component={JoyJerrGroupsScreen} 
        options={{ title: "Groups" }} 
      />
      <Stack.Screen 
        name="JoyJerrBlog" 
        component={JoyJerrBlogScreen} 
        options={{ title: "Blog" }} 
      />
      <Stack.Screen 
        name="JoyJerrProfile" 
        component={JoyJerrProfileScreen} 
        options={{ headerShown: false }} 
      />
    </Stack.Navigator>
  );
}

export default JoyJerrNavigator;