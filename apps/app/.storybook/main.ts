import type { StorybookConfig } from '@storybook/react-native-web-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  docs: { defaultName: 'Overview' },
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: { jsxImportSource: 'nativewind' },
    },
  },
};

export default config;
