const barCount = 31;
const lowestBar = 10;
const barRange = 85;

export function waveformBars(text: string): number[] {
  const seed = [...text].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0,
  );
  return Array.from(
    { length: barCount },
    (_, index) =>
      lowestBar + ((seed * (index + 3) * 7 + index * 13) % barRange),
  );
}
