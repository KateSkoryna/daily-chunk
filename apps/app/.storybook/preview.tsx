import {
  appLanguages,
  createI18n,
  I18nextProvider,
  type AppLanguage,
} from '@daily-chunk/i18n';
import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import '../global.css';
import { loadFonts } from './fonts';

const i18nByLanguage = {
  en: createI18n('en'),
  ru: createI18n('ru'),
} satisfies Record<AppLanguage, ReturnType<typeof createI18n>>;

const browserMetrics = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, right: 0, bottom: 0, left: 0 },
};

const preview: Preview = {
  loaders: [loadFonts],
  globalTypes: {
    appLanguage: {
      description: 'App language of the interface strings',
      toolbar: {
        title: 'App language',
        icon: 'globe',
        items: [...appLanguages],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { appLanguage: import.meta.env.VITE_APP_LANGUAGE ?? 'en' },
  decorators: [
    (Story, { globals }) => (
      <SafeAreaProvider initialMetrics={browserMetrics}>
        <I18nextProvider
          i18n={i18nByLanguage[globals.appLanguage as AppLanguage]}
        >
          <View className="min-h-screen bg-background">
            <Story />
          </View>
        </I18nextProvider>
      </SafeAreaProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
    viewport: {
      options: {
        phone: {
          name: 'Phone (design size)',
          styles: { width: '390px', height: '844px' },
          type: 'mobile',
        },
      },
    },
  },
};

export default preview;
