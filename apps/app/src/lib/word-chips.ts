export type WordChipsState = {
  words: string[];
  draft: string;
  leftOutCount: number;
};

const separators = /[\s,;]+/;
const endsWithSeparator = /[\s,;]$/;

function hasWord(words: string[], candidate: string) {
  const lowerCaseCandidate = candidate.toLowerCase();
  return words.some((word) => word.toLowerCase() === lowerCaseCandidate);
}

export function applyWordInput(
  currentWords: string[],
  text: string,
  maxWords: number,
): WordChipsState {
  const parts = text.split(separators).filter((part) => part !== '');
  const draft = endsWithSeparator.test(text) ? '' : (parts.pop() ?? '');
  const words = [...currentWords];
  let leftOutCount = 0;

  for (const part of parts) {
    if (hasWord(words, part)) continue;
    if (words.length >= maxWords) {
      leftOutCount += 1;
      continue;
    }
    words.push(part);
  }

  if (words.length >= maxWords && draft !== '') {
    const isDuplicate = hasWord(words, draft);
    return {
      words,
      draft: '',
      leftOutCount: leftOutCount + (isDuplicate ? 0 : 1),
    };
  }
  return { words, draft, leftOutCount };
}

export function commitDraft(
  words: string[],
  draft: string,
  maxWords: number,
): WordChipsState {
  return applyWordInput(words, `${draft} `, maxWords);
}

export function removeWord(words: string[], index: number): string[] {
  return words.filter((_, wordIndex) => wordIndex !== index);
}

export function editWord(
  words: string[],
  index: number,
  draft: string,
  maxWords: number,
): WordChipsState {
  const editedWord = words[index] ?? '';
  const committed = commitDraft(removeWord(words, index), draft, maxWords);
  return { ...committed, draft: editedWord };
}
