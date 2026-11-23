const secondsPerCharacter = 0.065;
const shortestSpeechSeconds = 1;

export function estimateSpeechSeconds(text: string, speed: number): number {
  return Math.max(
    shortestSpeechSeconds,
    (text.length * secondsPerCharacter) / speed,
  );
}
