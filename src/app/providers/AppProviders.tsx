import {useMemo, type PropsWithChildren} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as ReduxProvider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

import {createAppStore} from '@app/store';
import {SplashScreen} from '@core/presentation/screens/SplashScreen';
import {ThemeProvider} from '@shared/ui';

/**
 * Decision — provider order (outer → inner):
 * 1. GestureHandlerRootView — required by RNGH / Reanimated gestures
 * 2. SafeAreaProvider — insets for AppShell
 * 3. Redux + PersistGate — durable client state before UI decisions
 * 4. QueryClient — remote/async cache (never mirrored into Redux)
 * 5. ThemeProvider — reads settings after rehydrate via navigators
 */
export function AppProviders({children}: PropsWithChildren) {
  const {store, persistor} = useMemo(() => createAppStore(), []);
  const queryClient = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
    [],
  );

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <SafeAreaProvider>
        <ReduxProvider store={store}>
          <PersistGate loading={<SplashScreen />} persistor={persistor}>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>{children}</ThemeProvider>
            </QueryClientProvider>
          </PersistGate>
        </ReduxProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
