import React, { useEffect } from 'react';
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

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

export default function App() {
  const restoreSession = useAuthStore(state => state.restoreSession);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

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
