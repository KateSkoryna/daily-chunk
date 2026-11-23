import { describe, expect, it } from 'vitest';

import { waveformBars } from '../src/lib/waveform-bars';

describe('waveformBars', () => {
  it('gives the same bars for the same text', () => {
    expect(waveformBars('Ich warte am Bahnhof.')).toEqual(
      waveformBars('Ich warte am Bahnhof.'),
    );
  });

  it('gives different bars for different texts', () => {
    expect(waveformBars('Ich warte am Bahnhof.')).not.toEqual(
      waveformBars('Ihr Zug ist wieder verspätet.'),
    );
  });

  it('keeps every bar between 10 and 100 percent', () => {
    for (const bar of waveformBars('Der Zug fährt heute von Gleis drei ab.')) {
      expect(bar).toBeGreaterThanOrEqual(10);
      expect(bar).toBeLessThanOrEqual(100);
    }
  });

  it('gives bars for an empty text as well', () => {
    expect(waveformBars('')).toHaveLength(31);
  });
});
