import type { TargetLanguage } from '@daily-chunk/languages';
import { useCallback, useEffect, useState } from 'react';

import { speakWord, stopSpeaking } from './speak-word';

export function useListening(targetLanguage: TargetLanguage) {
  const [isListening, setIsListening] = useState(false);

  const stop = useCallback(() => {
    stopSpeaking();
    setIsListening(false);
  }, []);

  const toggle = useCallback(
    (text: string) => {
      if (isListening) {
        stop();
        return;
      }
      setIsListening(true);
      const finish = () => setIsListening(false);
      speakWord(text, targetLanguage, {
        onDone: finish,
        onStopped: finish,
        onError: finish,
      });
    },
    [isListening, stop, targetLanguage],
  );

  useEffect(() => stopSpeaking, []);

  return { isListening, toggle, stop };
}
