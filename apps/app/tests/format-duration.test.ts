import { describe, expect, it } from 'vitest';

import { formatDuration } from '../src/lib/format-duration';

describe('formatDuration', () => {
  it('writes minutes and seconds with two digits', () => {
    expect(formatDuration(24)).toBe('00:24');
    expect(formatDuration(0)).toBe('00:00');
    expect(formatDuration(65)).toBe('01:05');
  });

  it('drops fractions of a second', () => {
    expect(formatDuration(24.9)).toBe('00:24');
  });
});
