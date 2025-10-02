import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth, checkAuthStatus } from '../redux/userSlice';

// Import des écrans d'authentification
import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import EmailVerificationScreen from '../screens/EmailVerificationScreen';

// Import du navigateur principal
import TabNavigator from './TabNavigator';

// Import des composants de chargement
import LoadingScreen from '../components/LoadingScreen';

const Stack = createStackNavigator();

const AuthNavigator = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, isLoading, user, justRegistered } = useSelector(selectAuth);

  // Vérifier le statut d'authentification au démarrage uniquement si non authentifié
  // Évite d'écraser l'état persisté (Remember Me) en cas d'erreur réseau
  useEffect(() => {
    if (!isAuthenticated) {
      dispatch(checkAuthStatus());
    }
  }, [dispatch, isAuthenticated]);

  // Gérer la navigation initiale selon l'état justRegistered
  const getInitialRouteName = () => {
    if (justRegistered) {
      return 'EmailVerification';
    }
    return 'Login';
  };

  // Afficher l'écran de chargement pendant la vérification
  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={!isAuthenticated ? getInitialRouteName() : undefined}
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        cardStyleInterpolator: ({ current, layouts }) => {
          return {
            cardStyle: {
              transform: [
                {
                  translateX: current.progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [layouts.screen.width, 0],
                  }),
                },
              ],
            },
          };
        },
      }}
    >
      {isAuthenticated ? (
        // Utilisateur connecté - Afficher l'application principale
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{
            animationEnabled: false, // Pas d'animation pour la transition vers l'app principale
          }}
        />
      ) : (
        // Utilisateur non connecté - Afficher les écrans d'authentification
        // Structure fixe des écrans pour éviter les erreurs de navigation
        <>
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{
              title: 'Connexion',
            }}
          />
          <Stack.Screen
            name="Signup"
            component={SignupScreen}
            options={{
              title: 'Inscription',
            }}
          />
          <Stack.Screen
            name="EmailVerification"
            component={EmailVerificationScreen}
            options={{
              title: 'Vérification email',
            }}
          />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
            options={{
              title: 'Mot de passe oublié',
            }}
          />
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            options={{
              title: 'Réinitialiser le mot de passe',
            }}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AuthNavigator;