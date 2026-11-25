const typedSeparators = /[\n,;]+/;
const pastedSeparators = /[\s,;]+/;

export type WordField = { id: string; text: string };

export type SpreadResult = {
  fields: WordField[];
  leftOutCount: number;
  focusIndex: number;
};

let createdFieldCount = 0;

export function createWordField(text = ''): WordField {
  createdFieldCount += 1;
  return { id: `word-field-${createdFieldCount}`, text };
}

export function createWordFields(texts: string[]): WordField[] {
  return texts.map((text) => createWordField(text));
}

function withText(field: WordField, text: string): WordField {
  return { ...field, text };
}

export function filledWords(fields: WordField[]): string[] {
  const words: string[] = [];
  for (const { text } of fields) {
    const word = text.trim();
    const isKnown = words.some(
      (known) => known.toLowerCase() === word.toLowerCase(),
    );
    if (word !== '' && !isKnown) words.push(word);
  }
  return words;
}

export function spreadPastedWords(
  fields: WordField[],
  index: number,
  text: string,
  maxFields: number,
  isPaste = false,
): SpreadResult {
  const next = [...fields];
  const separators = isPaste ? pastedSeparators : typedSeparators;
  const editedField = next[index] ?? createWordField();
  if (!separators.test(text.trim())) {
    next[index] = withText(editedField, isPaste ? text.trim() : text);
    return { fields: next, leftOutCount: 0, focusIndex: index };
  }

  const [firstWord = '', ...otherWords] = text
    .split(separators)
    .map((word) => word.trim())
    .filter((word) => word !== '');
  next[index] = withText(editedField, firstWord);
  let focusIndex = index;
  let leftOutCount = 0;

  for (const word of otherWords) {
    const isKnown = filledWords(next).some(
      (known) => known.toLowerCase() === word.toLowerCase(),
    );
    if (isKnown) continue;
    const emptyIndex = next.findIndex(
      (field, fieldIndex) => fieldIndex > index && field.text.trim() === '',
    );
    const emptyField = next[emptyIndex];
    if (emptyField) {
      next[emptyIndex] = withText(emptyField, word);
      focusIndex = emptyIndex;
    } else if (next.length < maxFields) {
      next.push(createWordField(word));
      focusIndex = next.length - 1;
    } else {
      leftOutCount += 1;
    }
  }
  return { fields: next, leftOutCount, focusIndex };
}

export function clearField(fields: WordField[], index: number): WordField[] {
  return fields.map((field, fieldIndex) =>
    fieldIndex === index ? withText(field, '') : field,
  );
}

export function removeField(fields: WordField[], index: number): WordField[] {
  return fields.filter((_, fieldIndex) => fieldIndex !== index);
}
