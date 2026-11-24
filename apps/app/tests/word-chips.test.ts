import { describe, expect, it } from 'vitest';

import {
  applyWordInput,
  commitDraft,
  editWord,
  removeWord,
} from '../src/lib/word-chips';

describe('applyWordInput', () => {
  it('keeps typed letters as the draft', () => {
    expect(applyWordInput([], 'Bahn', 6)).toEqual({
      words: [],
      draft: 'Bahn',
      leftOutCount: 0,
    });
  });

  it('turns the draft into a word when a separator is typed', () => {
    for (const separator of [' ', ',', '\n', ';']) {
      expect(applyWordInput([], `Bahnhof${separator}`, 6)).toEqual({
        words: ['Bahnhof'],
        draft: '',
        leftOutCount: 0,
      });
    }
  });

  it('splits a pasted list and keeps the last unfinished word as the draft', () => {
    expect(applyWordInput(['Gleis'], 'Bahnhof\nFahrkarte, verspä', 6)).toEqual({
      words: ['Gleis', 'Bahnhof', 'Fahrkarte'],
      draft: 'verspä',
      leftOutCount: 0,
    });
  });

  it('skips a word that is already there, ignoring case', () => {
    expect(applyWordInput(['Bahnhof'], 'bahnhof Gleis ', 6).words).toEqual([
      'Bahnhof',
      'Gleis',
    ]);
  });

  it('ignores empty pieces', () => {
    expect(applyWordInput([], ' ,, \n ', 6).words).toEqual([]);
  });

  it('counts the words that do not fit under the limit', () => {
    expect(applyWordInput(['a', 'b', 'c', 'd'], 'e f g h ', 6)).toEqual({
      words: ['a', 'b', 'c', 'd', 'e', 'f'],
      draft: '',
      leftOutCount: 2,
    });
  });

  it('counts the draft too when the limit is reached', () => {
    expect(applyWordInput(['a', 'b', 'c', 'd', 'e'], 'f g', 6)).toEqual({
      words: ['a', 'b', 'c', 'd', 'e', 'f'],
      draft: '',
      leftOutCount: 1,
    });
  });
});

describe('applyWordInput at the limit', () => {
  it('skips a draft that is already a word without counting it as left out', () => {
    expect(applyWordInput(['a', 'b', 'c', 'd', 'e', 'f'], 'F', 6)).toEqual({
      words: ['a', 'b', 'c', 'd', 'e', 'f'],
      draft: '',
      leftOutCount: 0,
    });
  });
});

describe('commitDraft', () => {
  it('turns the draft into a word', () => {
    expect(commitDraft(['a'], 'b', 6)).toEqual({
      words: ['a', 'b'],
      draft: '',
      leftOutCount: 0,
    });
  });

  it('does nothing for an empty draft', () => {
    expect(commitDraft(['a'], '  ', 6).words).toEqual(['a']);
  });
});

describe('removeWord', () => {
  it('removes the word at the index', () => {
    expect(removeWord(['a', 'b', 'c'], 1)).toEqual(['a', 'c']);
  });
});

describe('editWord', () => {
  it('moves the word into the draft', () => {
    expect(editWord(['a', 'b', 'c'], 1, '', 6)).toEqual({
      words: ['a', 'c'],
      draft: 'b',
      leftOutCount: 0,
    });
  });

  it('turns the draft that was being typed into a word first', () => {
    expect(editWord(['a', 'b'], 0, 'x', 6)).toEqual({
      words: ['b', 'x'],
      draft: 'a',
      leftOutCount: 0,
    });
  });
});
