import {
  createAudioPlayer,
  type AudioPlayer,
  RecordingPresets,
  requestRecordingPermissionsAsync,
  setAudioModeAsync,
  useAudioRecorder,
} from 'expo-audio';
import { useEffect, useRef, useState } from 'react';

import type { RecordButtonState } from '../components/RecordButton/RecordButton';

export function useVoiceRecorder() {
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [state, setState] = useState<RecordButtonState>('idle');
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const isBusy = useRef(false);
  const isRecording = useRef(false);
  const player = useRef<AudioPlayer | null>(null);

  function stopPlayback() {
    player.current?.remove();
    player.current = null;
  }

  function playRecording() {
    stopPlayback();
    if (!recorder.uri) return;
    player.current = createAudioPlayer(recorder.uri);
    player.current.play();
  }

  async function stopRecording() {
    isRecording.current = false;
    await recorder.stop();
    await setAudioModeAsync({ allowsRecording: false });
  }

  async function startRecording(): Promise<boolean> {
    const { granted } = await requestRecordingPermissionsAsync();
    setIsPermissionDenied(!granted);
    if (!granted) return false;
    stopPlayback();
    await setAudioModeAsync({ allowsRecording: true, playsInSilentMode: true });
    await recorder.prepareToRecordAsync();
    recorder.record();
    isRecording.current = true;
    setState('recording');
    return true;
  }

  async function toggle(): Promise<boolean> {
    if (isBusy.current) return false;
    isBusy.current = true;
    try {
      if (isRecording.current) {
        await stopRecording();
        setState('done');
        return true;
      }
      await startRecording();
      return false;
    } finally {
      isBusy.current = false;
    }
  }

  async function reset() {
    stopPlayback();
    if (isRecording.current) {
      await stopRecording().catch(() => undefined);
    }
    setState('idle');
  }

  useEffect(
    () => () => {
      player.current?.remove();
      if (!isRecording.current) return;
      void recorder
        .stop()
        .then(() => setAudioModeAsync({ allowsRecording: false }))
        .catch(() => undefined);
    },
    [recorder],
  );

  return {
    state,
    isPermissionDenied,
    toggle,
    reset,
    playRecording,
    stopPlayback,
  };
}
