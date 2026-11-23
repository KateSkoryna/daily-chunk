import type { TargetLanguage } from '@daily-chunk/languages';
import { useCallback, useEffect, useRef, useState } from 'react';

import { estimateSpeechSeconds } from './speech-seconds';
import { speakWord, stopSpeaking } from './speak-word';

const progressTickInMilliseconds = 100;

type SpokenPhraseInput = {
  text: string;
  targetLanguage: TargetLanguage;
  speed: number;
};

export function useSpokenPhrase({
  text,
  targetLanguage,
  speed,
}: SpokenPhraseInput) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playedSeconds, setPlayedSeconds] = useState(0);
  const latestPlayId = useRef(0);
  const durationSeconds = estimateSpeechSeconds(text, speed);

  useEffect(() => {
    if (!isPlaying) return;
    const startedAt = Date.now();
    const timer = setInterval(
      () =>
        setPlayedSeconds(
          Math.min((Date.now() - startedAt) / 1000, durationSeconds),
        ),
      progressTickInMilliseconds,
    );
    return () => clearInterval(timer);
  }, [isPlaying, durationSeconds]);

  useEffect(() => stopSpeaking, []);

  const stop = useCallback(() => {
    latestPlayId.current += 1;
    stopSpeaking();
    setIsPlaying(false);
    setPlayedSeconds(0);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      stop();
      return;
    }
    latestPlayId.current += 1;
    const playId = latestPlayId.current;
    const endIfLatest = (onEnd: () => void) => () => {
      if (playId === latestPlayId.current) onEnd();
    };
    setPlayedSeconds(0);
    setIsPlaying(true);
    speakWord(text, targetLanguage, {
      rate: speed,
      onDone: endIfLatest(() => {
        setIsPlaying(false);
        setPlayedSeconds(durationSeconds);
      }),
      onStopped: endIfLatest(() => setIsPlaying(false)),
      onError: endIfLatest(() => setIsPlaying(false)),
    });
  }, [isPlaying, stop, text, targetLanguage, speed, durationSeconds]);

  const reset = useCallback(() => {
    stop();
  }, [stop]);

  return {
    isPlaying,
    playedSeconds,
    durationSeconds,
    toggle,
    stop,
    reset,
  };
}
