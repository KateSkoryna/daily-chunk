export function splitAroundWord(sentence: string, word: string) {
  const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const match = new RegExp(`(?<!\\p{L})${escaped}(?!\\p{L})`, 'u').exec(
    sentence,
  );

  if (!match) return null;

  return {
    before: sentence.slice(0, match.index),
    after: sentence.slice(match.index + word.length),
  };
}
