import { describe, expect, it } from 'vitest';

import {
  clearField,
  createWordFields,
  filledWords,
  removeField,
  spreadPastedWords,
} from '../src/lib/word-fields';

function texts(fields: { text: string }[]) {
  return fields.map((field) => field.text);
}

describe('createWordFields', () => {
  it('gives every field its own id', () => {
    const fields = createWordFields(['a', 'b', 'c']);

    expect(new Set(fields.map((field) => field.id)).size).toBe(3);
    expect(texts(fields)).toEqual(['a', 'b', 'c']);
  });
});

describe('filledWords', () => {
  it('keeps the trimmed words and skips empty fields', () => {
    expect(
      filledWords(createWordFields([' Bahnhof ', '', '  ', 'Gleis'])),
    ).toEqual(['Bahnhof', 'Gleis']);
  });

  it('skips a word that is already there, ignoring case', () => {
    expect(
      filledWords(createWordFields(['Bahnhof', 'bahnhof', 'Gleis'])),
    ).toEqual(['Bahnhof', 'Gleis']);
  });

  it('keeps a phrase with a space as one word', () => {
    expect(filledWords(createWordFields(['sich freuen']))).toEqual([
      'sich freuen',
    ]);
  });
});

describe('spreadPastedWords', () => {
  it('only sets the field when the text is not a list', () => {
    const fields = createWordFields(['', '', '']);
    const result = spreadPastedWords(fields, 1, 'sich freuen', 6);

    expect(texts(result.fields)).toEqual(['', 'sich freuen', '']);
    expect(result.fields[1]?.id).toBe(fields[1]?.id);
    expect(result.leftOutCount).toBe(0);
    expect(result.focusIndex).toBe(1);
  });

  it('spreads a list over the empty fields after the typed one', () => {
    const result = spreadPastedWords(
      createWordFields(['', '', '']),
      0,
      'Bahnhof\nFahrkarte, Gleis',
      6,
    );

    expect(texts(result.fields)).toEqual(['Bahnhof', 'Fahrkarte', 'Gleis']);
    expect(result.focusIndex).toBe(2);
  });

  it('keeps filled fields and adds fields when there are not enough empty ones', () => {
    const fields = createWordFields(['a', '', 'c']);
    const result = spreadPastedWords(fields, 0, 'x,y,z,w', 6);

    expect(texts(result.fields)).toEqual(['x', 'y', 'c', 'z', 'w']);
    expect(result.fields.slice(0, 3).map((field) => field.id)).toEqual(
      fields.map((field) => field.id),
    );
    expect(result.focusIndex).toBe(4);
  });

  it('counts the words that do not fit under the limit', () => {
    const result = spreadPastedWords(
      createWordFields(['', '']),
      0,
      'a,b,c,d',
      3,
    );

    expect(texts(result.fields)).toEqual(['a', 'b', 'c']);
    expect(result.leftOutCount).toBe(1);
    expect(result.focusIndex).toBe(2);
  });

  it('skips a word that is already in a field without counting it', () => {
    const result = spreadPastedWords(
      createWordFields(['Gleis', '', '']),
      1,
      'gleis,Haus',
      6,
    );

    expect(texts(result.fields)).toEqual(['Gleis', 'gleis', 'Haus']);
    expect(result.leftOutCount).toBe(0);
  });

  it('splits on spaces too when the text was pasted', () => {
    const result = spreadPastedWords(
      createWordFields(['', '', '']),
      0,
      'Bahnhof Fahrkarte Gleis',
      6,
      true,
    );

    expect(texts(result.fields)).toEqual(['Bahnhof', 'Fahrkarte', 'Gleis']);
  });

  it('keeps one pasted word with spaces around it as it is', () => {
    expect(
      texts(
        spreadPastedWords(createWordFields(['', '']), 0, ' Gleis ', 6, true)
          .fields,
      ),
    ).toEqual(['Gleis', '']);
  });

  it('clears the field for a list with no words', () => {
    expect(
      texts(
        spreadPastedWords(createWordFields(['x', '']), 0, ',;\n', 6).fields,
      ),
    ).toEqual(['', '']);
  });
});

describe('clearField and removeField', () => {
  it('clears only the text and keeps the id', () => {
    const fields = createWordFields(['a', 'b', 'c']);
    const result = clearField(fields, 1);

    expect(texts(result)).toEqual(['a', '', 'c']);
    expect(result[1]?.id).toBe(fields[1]?.id);
  });

  it('removes the field at the index and keeps the others as they are', () => {
    const fields = createWordFields(['a', 'b', 'c']);
    const result = removeField(fields, 1);

    expect(texts(result)).toEqual(['a', 'c']);
    expect(result[1]).toBe(fields[2]);
  });
});
