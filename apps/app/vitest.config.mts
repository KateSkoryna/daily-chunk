import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitest/config';

process.env.NODE_ENV = 'development';

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  test: {
    passWithNoTests: true,
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
        test: {
          name: 'storybook',
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
