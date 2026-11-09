import type { Preview } from '@storybook/react-native-web-vite';
import { View } from 'react-native';

import '../global.css';
import { loadFonts } from './fonts';

const preview: Preview = {
  loaders: [loadFonts],
  decorators: [
    (Story) => (
      <View className="bg-background">
        <Story />
      </View>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
    a11y: { test: 'error' },
  },
};

export default preview;
