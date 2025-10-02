import { StatusBar, StyleSheet, useColorScheme, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './legacy/redux/store';
import AuthNavigator from './legacy/navigation/AuthNavigator';

const Stack = createStackNavigator();

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <SafeAreaProvider>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <NavigationContainer
              onStateChange={state => {
                try {
                  const routes = state?.routes || [];
                  const current = routes[state?.index ?? 0];
                  const stackPath = routes.map(r => r.name).join(' -> ');
                  console.log('[Nav] State change:', {
                    stackPath,
                    currentRoute: current?.name,
                  });
                } catch (e) {
                  console.log('[Nav] onStateChange error', e);
                }
              }}
              onReady={() => {
                console.log('[Nav] NavigationContainer ready');
              }}
            >
              <AppContent />
            </NavigationContainer>
          </SafeAreaProvider>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  );
}

function AppContent() {
  const safeAreaInsets = useSafeAreaInsets();

  return <AuthNavigator />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
