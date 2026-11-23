import { describe, expect, it } from 'vitest';

import { isHorizontalDrag, swipeDirection } from '../src/lib/swipe-direction';

describe('swipeDirection', () => {
  it('is left for a long move to the left', () => {
    expect(swipeDirection(-80, 5)).toBe('left');
  });

  it('is right for a long move to the right', () => {
    expect(swipeDirection(80, -5)).toBe('right');
  });

  it('is nothing for a short move', () => {
    expect(swipeDirection(30, 0)).toBeNull();
  });

  it('is nothing for a mostly vertical move', () => {
    expect(swipeDirection(60, 70)).toBeNull();
  });
});

describe('isHorizontalDrag', () => {
  it('starts only for a clearly horizontal move', () => {
    expect(isHorizontalDrag(20, 3)).toBe(true);
    expect(isHorizontalDrag(5, 0)).toBe(false);
    expect(isHorizontalDrag(20, 20)).toBe(false);
  });
});
