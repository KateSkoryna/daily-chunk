import { describe, expect, it } from 'vitest';

import { hasKeyboardFocus } from '../src/lib/has-keyboard-focus';

describe('hasKeyboardFocus', () => {
  it('is true when the browser says the focus is visible (keyboard)', () => {
    expect(hasKeyboardFocus({ matches: () => true })).toBe(true);
  });

  it('is false when the focus came from a click or a tap', () => {
    expect(hasKeyboardFocus({ matches: () => false })).toBe(false);
  });

  it('is true where there is no focus-visible rule (phones: only a keyboard or a switch focuses)', () => {
    expect(hasKeyboardFocus({})).toBe(true);
  });
});
