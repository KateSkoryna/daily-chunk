import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

process.env.NODE_ENV = 'development';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          include: ['tests/**/*.test.ts'],
          environment: 'node',
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(currentDirectory, '.storybook'),
          }),
        ],
        define: {
          'import.meta.env.VITE_APP_LANGUAGE': JSON.stringify('en'),
        },
        test: {
          name: 'storybook-en',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
      {
        extends: true,
        plugins: [
          storybookTest({
            configDir: path.join(currentDirectory, '.storybook'),
          }),
        ],
        define: {
          'import.meta.env.VITE_APP_LANGUAGE': JSON.stringify('ru'),
        },
        test: {
          name: 'storybook-ru',
          browser: {
            enabled: true,
            headless: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
