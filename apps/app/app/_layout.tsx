import '../global.css';

import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import { PixelifySans_400Regular } from '@expo-google-fonts/pixelify-sans';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { rem } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { View } from 'react-native';

const transparentNavigationTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

SplashScreen.preventAutoHideAsync();
rem.set(16);

export default function RootLayout() {
  const [areFontsLoaded, fontError] = useFonts({
    Bungee_400Regular,
    RussoOne_400Regular,
    VT323_400Regular,
    PixelifySans_400Regular,
    IBMPlexSans_400Regular,
    IBMPlexSans_600SemiBold,
  });

  useEffect(() => {
    if (areFontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [areFontsLoaded, fontError]);

  if (!areFontsLoaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={transparentNavigationTheme}>
      <View className="flex-1 bg-background">
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }} />
      </View>
    </ThemeProvider>
  );
}
