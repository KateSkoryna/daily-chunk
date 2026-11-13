import { createRequire } from 'node:module';
import { describe, expect, it } from 'vitest';

import { flipDurationInMs } from '../src/components/WordCard/flip-duration';

const require = createRequire(import.meta.url);
const { theme } = require('../tailwind.config.js');

describe('flipDurationInMs', () => {
  it('equals the duration-flip token of the theme', () => {
    expect(`${flipDurationInMs}ms`).toBe(theme.extend.transitionDuration.flip);
  });
});
