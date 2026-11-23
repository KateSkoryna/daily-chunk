import { describe, expect, it } from 'vitest';

import { estimateSpeechSeconds } from '../src/lib/speech-seconds';

describe('estimateSpeechSeconds', () => {
  it('takes longer for a longer text', () => {
    expect(
      estimateSpeechSeconds('Ich warte am Bahnhof auf den Zug.', 1),
    ).toBeGreaterThan(estimateSpeechSeconds('Ich warte.', 1));
  });

  it('takes longer at the slower speed', () => {
    const text = 'Sie sucht ihre Fahrkarte in der Tasche.';

    expect(estimateSpeechSeconds(text, 0.75)).toBeGreaterThan(
      estimateSpeechSeconds(text, 1),
    );
  });

  it('never goes below one second', () => {
    expect(estimateSpeechSeconds('Ja', 1)).toBe(1);
  });
});
