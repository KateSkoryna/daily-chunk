import expoConfig from 'eslint-config-expo/flat.js';
import { designRules } from './eslint.design-rules.mjs';

export default [
  ...expoConfig,
  { ignores: ['dist/**', '.expo/**', 'storybook-static/**'] },
  designRules,
];
