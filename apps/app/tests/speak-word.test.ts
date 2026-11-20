import { beforeEach, describe, expect, it, vi } from 'vitest';

const calls: string[] = [];
const speakOptions: unknown[] = [];

vi.mock('expo-speech', () => ({
  stop: () => calls.push('stop'),
  speak: (text: string, options: unknown) => {
    calls.push(`speak ${text}`);
    speakOptions.push(options);
  },
}));

const { speakWord } = await import('../src/lib/speak-word');

describe('speakWord', () => {
  beforeEach(() => {
    calls.length = 0;
    speakOptions.length = 0;
  });

  it('stops what is playing, then speaks in the voice of the target language', () => {
    speakWord('der Bahnhof', 'de');

    expect(calls).toEqual(['stop', 'speak der Bahnhof']);
    expect(speakOptions).toEqual([{ language: 'de-DE' }]);
  });
});
