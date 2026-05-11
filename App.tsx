import React, { useEffect, useState } from 'react'; // gregado useState
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';

import RootNavigator from '@app/navigation/RootNavigator';
import ToastContainer from '@app/components/Toast';
import ErrorBoundary from '@app/components/ErrorBoundary';
import { useAuthStore } from '@store/authStore';
import { colors } from '@app/theme/colors';
import SplashScreen from '@app/screens/SplashScreen'; // nuevo import

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
    },
  },
});

export default function App() {
  const restoreSession = useAuthStore(state => state.restoreSession);
  const [showSplash, setShowSplash] = useState(true); // nuevo estado — controla si se muestra la splash

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // 👈 Si showSplash es true, muestra la pantalla del logo antes que todo lo demás
  if (showSplash) {
    return <SplashScreen onFinish={() => setShowSplash(false)} />;
  }

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={styles.root}>
        <SafeAreaProvider>
          <QueryClientProvider client={queryClient}>
            <NavigationContainer>
              <StatusBar style="light" backgroundColor={colors.background} />
              <RootNavigator />
              <ToastContainer />
            </NavigationContainer>
          </QueryClientProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
});
