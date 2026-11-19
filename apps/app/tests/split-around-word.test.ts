import { describe, expect, it } from 'vitest';

import { splitAroundWord } from '../src/lib/split-around-word';

describe('splitAroundWord', () => {
  it('splits the sentence around the whole word', () => {
    expect(splitAroundWord('ich warte in Bahnhof.', 'in')).toEqual({
      before: 'ich warte ',
      after: ' Bahnhof.',
    });
  });

  it('does not match inside another word', () => {
    expect(splitAroundWord('Ich bin Anna.', 'in')).toBeNull();
  });

  it('finds a word at the start and one followed by punctuation', () => {
    expect(splitAroundWord('Für dich, für mich.', 'für')).toEqual({
      before: 'Für dich, ',
      after: ' mich.',
    });
    expect(splitAroundWord('Ich warte in.', 'in')).toEqual({
      before: 'Ich warte ',
      after: '.',
    });
  });
});
