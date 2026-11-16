import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
} from '@expo-google-fonts/plus-jakarta-sans';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import 'react-native-reanimated';

import { SplashView, SPLASH_MS } from '@/src/components/SplashView';
import { AuthProvider, useAuth } from '@/src/contexts/AuthContext';
import { CoupleProvider } from '@/src/contexts/CoupleContext';
import { ThemeProvider, useTheme } from '@/src/contexts/ThemeContext';

export { ErrorBoundary } from 'expo-router';

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 400, fade: true });

export default function RootLayout() {
  const [loaded, error] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <CoupleProvider>
            <AppEntry />
          </CoupleProvider>
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}

function AppEntry() {
  const { loading: authLoading } = useAuth();
  const [showSplash, setShowSplash] = useState(true);
  const startedAt = useRef(Date.now());

  useEffect(() => {
    if (authLoading) return;

    let cancelled = false;

    const finish = async () => {
      await SplashScreen.hideAsync();
      const remaining = Math.max(0, SPLASH_MS - (Date.now() - startedAt.current));
      await new Promise((resolve) => setTimeout(resolve, remaining));
      if (!cancelled) setShowSplash(false);
    };

    void finish();

    return () => {
      cancelled = true;
    };
  }, [authLoading]);

  if (showSplash) return <SplashView />;

  return <RootNavigator />;
}

function RootNavigator() {
  const { isDark, colors } = useTheme();

  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'fade',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="note/create"
          options={{ presentation: 'modal', headerShown: false }}
        />
        <Stack.Screen name="relationship/edit" options={{ presentation: 'modal' }} />
        <Stack.Screen name="partner/manage" />
        <Stack.Screen name="settings" />
      </Stack>
    </>
  );
}
