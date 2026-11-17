import type { StorybookConfig } from '@storybook/react-native-web-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { mergeConfig } from 'vite';

const appDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
);

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.tsx'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-a11y',
    '@storybook/addon-vitest',
  ],
  docs: { defaultName: 'Overview' },
  viteFinal: (config) =>
    mergeConfig(config, {
      resolve: {
        alias: {
          '@react-native/assets-registry/registry': path.join(
            appDirectory,
            'tests/stubs/assets-registry.ts',
          ),
        },
      },
      optimizeDeps: { rolldownOptions: { shimMissingExports: true } },
    }),
  framework: {
    name: '@storybook/react-native-web-vite',
    options: {
      pluginReactOptions: { jsxImportSource: 'nativewind' },
    },
  },
};

export default config;
