import type { Lesson, Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';

import { Notice } from '../../src/components/Notice/Notice';
import { Screen } from '../../src/components/Screen/Screen';
import { TopBar } from '../../src/components/TopBar/TopBar';
import {
  ReadScreen,
  type OpenWord,
} from '../../src/features/lesson/ReadScreen';
import { speakWord } from '../../src/lib/speak-word';
import { displayedWord } from '../../src/lib/displayed-word';
import { useLessonNavigation } from '../../src/lib/use-lesson-navigation';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

type ReadTaskProps = {
  lesson: Lesson;
  words: Word[];
  nativeLanguage: NativeLanguage;
};

function ReadTask({ lesson, words, nativeLanguage }: ReadTaskProps) {
  const router = useRouter();
  const saveTaskResult = useAppStore((state) => state.saveTaskResult);
  const story = useAppStore((state) => state.stories[lesson.id]);
  const [activeWord, setActiveWord] = useState<OpenWord | null>(null);
  const navigation = useLessonNavigation({
    currentStep: 3,
    nativeLanguage,
    targetLanguage: words[0]?.targetLanguage ?? 'de',
  });
  const isMoving = useRef(false);
  const hasFinished = useRef(false);
  const lessonWords = lesson.wordIds.flatMap((wordId) =>
    words.filter((word) => word.id === wordId),
  );

  useFocusEffect(
    useCallback(() => {
      if (!hasFinished.current) return;
      hasFinished.current = false;
      setActiveWord(null);
    }, []),
  );

  if (!story) return null;

  async function goNextSection() {
    if (isMoving.current) return;
    isMoving.current = true;
    try {
      await saveTaskResult('read', {
        correct: lesson.wordIds.length,
        total: lesson.wordIds.length,
      });
      hasFinished.current = true;
      router.push('/lesson/record');
    } catch {
      return;
    } finally {
      isMoving.current = false;
    }
  }

  return (
    <ReadScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      title={story.title}
      paragraphs={story.paragraphs}
      words={lessonWords}
      nativeLanguage={nativeLanguage}
      activeWord={activeWord}
      onWordPress={(word) => {
        const isOpen =
          word.word === activeWord?.word &&
          word.paragraphIndex === activeWord.paragraphIndex;
        setActiveWord(isOpen ? null : word);
      }}
      onPlayWord={(word) => speakWord(displayedWord(word), word.targetLanguage)}
      taskNames={navigation.stepNames}
      onTaskSelect={navigation.goToStep}
      onBack={navigation.goBack}
      onClose={() => router.replace('/')}
      onContinue={goNextSection}
    />
  );
}

function StoryFailed({ onBack }: { onBack: () => void }) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-4">
      <TopBar.Action icon="back" label={t('common.back')} onPress={onBack} />
      <Notice>{t('lesson.somethingFailed')}</Notice>
    </Screen>
  );
}

export default function ReadRoute() {
  useStartAppStore();
  const router = useRouter();
  const status = useAppStore((state) => state.status);
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const lessons = useAppStore((state) => state.lessons);
  const loadStory = useAppStore((state) => state.loadStory);
  const lesson = lessons.find((candidate) => candidate.completedAt === null);
  const [hasFailed, setHasFailed] = useState(false);
  const hasNoLesson = status === 'ready' && !lesson;
  const lessonId = lesson?.id;

  useEffect(() => {
    if (hasNoLesson) router.replace('/');
  }, [hasNoLesson, router]);

  useEffect(() => {
    if (!lessonId) return;
    let isCancelled = false;
    loadStory(lessonId).catch(() => {
      if (!isCancelled) setHasFailed(true);
    });
    return () => {
      isCancelled = true;
    };
  }, [lessonId, loadStory]);

  if (hasFailed) {
    return <StoryFailed onBack={() => router.replace('/lesson/listen')} />;
  }
  if (!profile || !lesson) return null;

  return (
    <ReadTask
      key={lesson.id}
      lesson={lesson}
      words={words}
      nativeLanguage={profile.languages.nativeLanguage}
    />
  );
}
