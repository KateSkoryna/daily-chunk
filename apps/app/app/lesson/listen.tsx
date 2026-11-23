import {
  createListenSession,
  goToListenPhrase,
  isFirstListenPhrase,
  isLastListenPhrase,
  listenResult,
  maxListenRepeats,
  nextListenPhrase,
  previousListenPhrase,
  recordListenRepeat,
  type Lesson,
  type Word,
} from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { ListenScreen } from '../../src/features/lesson/ListenScreen';
import { useSpokenPhrase } from '../../src/lib/use-spoken-phrase';
import { useLessonNavigation } from '../../src/lib/use-lesson-navigation';
import { useVoiceRecorder } from '../../src/lib/use-voice-recorder';
import { waveformBars } from '../../src/lib/waveform-bars';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

const speeds = [0.75, 1];

type ListenTaskProps = {
  lesson: Lesson;
  words: Word[];
  nativeLanguage: NativeLanguage;
};

function ListenTask({ lesson, words, nativeLanguage }: ListenTaskProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const saveTaskResult = useAppStore((state) => state.saveTaskResult);
  const [session, setSession] = useState(() =>
    createListenSession(lesson.wordIds),
  );
  const [speedIndex, setSpeedIndex] = useState(0);
  const navigation = useLessonNavigation({
    currentStep: 2,
    nativeLanguage,
    targetLanguage: words[0]?.targetLanguage ?? 'de',
  });
  const [step, setStep] = useState<1 | 2>(1);
  const [hasFailed, setHasFailed] = useState(false);
  const isMoving = useRef(false);
  const hasFinished = useRef(false);
  const recorder = useVoiceRecorder();
  const word = words.find(
    (candidate) => candidate.id === session.wordIds[session.phraseIndex],
  );
  const speed = speeds[speedIndex] ?? 1;
  const phrase = useSpokenPhrase({
    text: word?.sentence ?? '',
    targetLanguage: word?.targetLanguage ?? 'de',
    speed,
  });

  useFocusEffect(
    useCallback(() => {
      if (!hasFinished.current) return;
      hasFinished.current = false;
      setSession(createListenSession(lesson.wordIds));
      setStep(1);
    }, [lesson.wordIds]),
  );

  if (!word) return null;

  async function toggleRecording() {
    const recordedPhraseIndex = session.phraseIndex;
    phrase.stop();
    setHasFailed(false);
    try {
      const hasFinishedRecording = await recorder.toggle();
      if (hasFinishedRecording) {
        setSession((current) =>
          current.phraseIndex === recordedPhraseIndex
            ? recordListenRepeat(current)
            : current,
        );
      }
    } catch {
      await recorder.reset();
      setHasFailed(true);
    }
  }

  async function selectStep(nextStep: 1 | 2) {
    if (nextStep === step) return;
    phrase.stop();
    recorder.stopPlayback();
    if (recorder.state === 'recording') await toggleRecording();
    setStep(nextStep);
  }

  async function moveBack() {
    if (isMoving.current) return;
    isMoving.current = true;
    setHasFailed(false);
    try {
      phrase.stop();
      await recorder.reset();
      phrase.reset();
      setSession(previousListenPhrase(session));
    } catch {
      setHasFailed(true);
    } finally {
      isMoving.current = false;
    }
  }

  async function jumpToPhrase(phraseNumber: number) {
    if (isMoving.current || phraseNumber - 1 === session.phraseIndex) return;
    isMoving.current = true;
    setHasFailed(false);
    try {
      phrase.stop();
      await recorder.reset();
      phrase.reset();
      setSession(goToListenPhrase(session, phraseNumber - 1));
    } catch {
      setHasFailed(true);
    } finally {
      isMoving.current = false;
    }
  }

  async function moveOn(isFinishing: boolean) {
    if (isMoving.current) return;
    isMoving.current = true;
    setHasFailed(false);
    try {
      phrase.stop();
      await recorder.reset();
      if (isFinishing) {
        await saveTaskResult('listen', listenResult(session));
        hasFinished.current = true;
        router.push('/lesson/read');
      } else {
        phrase.reset();
        setSession(nextListenPhrase(session));
      }
    } catch {
      setHasFailed(true);
    } finally {
      isMoving.current = false;
    }
  }

  return (
    <ListenScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      word={word}
      highlightedWord={word.lemma}
      nativeLanguage={nativeLanguage}
      step={step}
      onStepSelect={selectStep}
      playback={{
        bars: waveformBars(word.sentence),
        playedSeconds: phrase.playedSeconds,
        durationSeconds: phrase.durationSeconds,
        speed,
        isPlaying: phrase.isPlaying,
      }}
      recordState={recorder.state}
      notice={
        recorder.isPermissionDenied
          ? t('listen.microphoneDenied')
          : hasFailed
            ? t('lesson.somethingFailed')
            : undefined
      }
      phrase={{
        current: session.phraseIndex + 1,
        total: session.wordIds.length,
      }}
      repeat={{
        current: Math.min(
          (session.repeats[session.phraseIndex] ?? 0) + 1,
          maxListenRepeats,
        ),
        total: maxListenRepeats,
      }}
      taskNames={navigation.stepNames}
      onTaskSelect={navigation.goToStep}
      onBack={navigation.goBack}
      onClose={() => router.replace('/')}
      onTogglePlay={phrase.toggle}
      onSpeedPress={() => {
        phrase.stop();
        setSpeedIndex((speedIndex + 1) % speeds.length);
      }}
      onRecord={toggleRecording}
      onPlayRecording={() => {
        phrase.stop();
        recorder.playRecording();
      }}
      isFirstPhrase={isFirstListenPhrase(session)}
      onPhraseSelect={jumpToPhrase}
      onPrevious={moveBack}
      isLastPhrase={isLastListenPhrase(session)}
      onNext={() => moveOn(false)}
      onNextSection={() => moveOn(true)}
    />
  );
}

export default function ListenRoute() {
  useStartAppStore();
  const router = useRouter();
  const status = useAppStore((state) => state.status);
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const lessons = useAppStore((state) => state.lessons);
  const lesson = lessons.find((candidate) => candidate.completedAt === null);
  const hasNoLesson = status === 'ready' && !lesson;

  useEffect(() => {
    if (hasNoLesson) router.replace('/');
  }, [hasNoLesson, router]);

  if (!profile || !lesson) return null;

  return (
    <ListenTask
      key={lesson.id}
      lesson={lesson}
      words={words}
      nativeLanguage={profile.languages.nativeLanguage}
    />
  );
}
