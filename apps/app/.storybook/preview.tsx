import {
  appLanguages,
  createI18n,
  I18nextProvider,
  type AppLanguage,
} from '@daily-chunk/i18n';
import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import '../global.css';
import { loadFonts } from './fonts';

const i18nByLanguage = {
  en: createI18n('en'),
  ru: createI18n('ru'),
} satisfies Record<AppLanguage, ReturnType<typeof createI18n>>;

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
  initialGlobals: { appLanguage: 'en' },
  decorators: [
    (Story, { globals }) => (
      <I18nextProvider
        i18n={i18nByLanguage[globals.appLanguage as AppLanguage]}
      >
        <View className="bg-background">
          <Story />
        </View>
      </I18nextProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
};

export default preview;
