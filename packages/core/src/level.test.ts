import { describe, expect, it } from 'vitest';

import { highestTextLevel } from './level';

describe('highestTextLevel', () => {
  it('is two levels above the learner', () => {
    expect(highestTextLevel('A1')).toBe('B1');
    expect(highestTextLevel('B1')).toBe('C1');
    expect(highestTextLevel('B2')).toBe('C2');
  });

  it('stops at C2', () => {
    expect(highestTextLevel('C1')).toBe('C2');
    expect(highestTextLevel('C2')).toBe('C2');
  });
});
