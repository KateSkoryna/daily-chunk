import '../global.css';

import { Bungee_400Regular } from '@expo-google-fonts/bungee';
import {
  IBMPlexSans_400Regular,
  IBMPlexSans_600SemiBold,
} from '@expo-google-fonts/ibm-plex-sans';
import { PixelifySans_400Regular } from '@expo-google-fonts/pixelify-sans';
import { RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { VT323_400Regular } from '@expo-google-fonts/vt323';
import {
  createI18n,
  defaultAppLanguage,
  I18nextProvider,
  pickAppLanguage,
} from '@daily-chunk/i18n';
import { useFonts } from 'expo-font';
import { getLocales } from 'expo-localization';
import { DarkTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { rem } from 'nativewind';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import { View } from 'react-native';

const transparentNavigationTheme = {
  ...DarkTheme,
  colors: { ...DarkTheme.colors, background: 'transparent' },
};

const i18n = createI18n(defaultAppLanguage);

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

  const [isAppLanguageApplied, setIsAppLanguageApplied] = useState(false);

  useEffect(() => {
    i18n
      .changeLanguage(
        pickAppLanguage(getLocales().map((locale) => locale.languageCode)),
      )
      .catch(() => undefined)
      .then(() => setIsAppLanguageApplied(true));
  }, []);

  useEffect(() => {
    if (areFontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [areFontsLoaded, fontError]);

  if ((!areFontsLoaded && !fontError) || !isAppLanguageApplied) {
    return null;
  }

  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider value={transparentNavigationTheme}>
        <View className="flex-1 bg-background">
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </ThemeProvider>
    </I18nextProvider>
  );
}
