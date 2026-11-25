import {
  answerQuizQuestion,
  createQuizSession,
  quizScore,
  shuffleOptions,
  type Lesson,
  type StoryResponse,
  type Word,
} from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import type { NativeLanguage } from '@daily-chunk/languages';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { Notice } from '../../src/components/Notice/Notice';
import { Screen } from '../../src/components/Screen/Screen';
import { TopBar } from '../../src/components/TopBar/TopBar';
import { ReadQuizScreen } from '../../src/features/lesson/ReadQuizScreen';
import { ReadScreen } from '../../src/features/lesson/ReadScreen';
import { speakWord } from '../../src/lib/speak-word';
import { useListening } from '../../src/lib/use-listening';
import { displayedWord } from '../../src/lib/displayed-word';
import { useLessonNavigation } from '../../src/lib/use-lesson-navigation';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

type ReadTaskProps = {
  lesson: Lesson;
  story: StoryResponse;
  words: Word[];
  nativeLanguage: NativeLanguage;
};

function LoadedReadTask({
  lesson,
  story,
  words,
  nativeLanguage,
}: ReadTaskProps) {
  const router = useRouter();
  const saveTaskResult = useAppStore((state) => state.saveTaskResult);
  const [activeWord, setActiveWord] = useState<string | null>(null);
  const [isTranslationShown, setIsTranslationShown] = useState(false);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [session, setSession] = useState(() =>
    createQuizSession(story.questions.length),
  );
  const questions = useMemo(
    () =>
      story.questions.map((question, index) => ({
        ...question,
        options: shuffleOptions(question.options, `${lesson.id}:${index}`),
      })),
    [story, lesson.id],
  );
  const targetLanguage = words[0]?.targetLanguage ?? 'de';
  const navigation = useLessonNavigation({
    currentStep: 3,
    nativeLanguage,
    targetLanguage,
  });
  const listening = useListening(targetLanguage);
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
      setIsTranslationShown(false);
      setIsQuizOpen(false);
      setQuestionIndex(0);
      setSession(createQuizSession(questions.length));
    }, [questions.length]),
  );

  async function goNextSection() {
    if (isMoving.current) return;
    isMoving.current = true;
    try {
      await saveTaskResult(
        'read',
        quizScore(
          session,
          questions.map((question) => question.answer),
        ),
      );
      hasFinished.current = true;
      router.push('/lesson/answer');
    } catch {
      return;
    } finally {
      isMoving.current = false;
    }
  }

  if (isQuizOpen) {
    return (
      <ReadQuizScreen
        lessonNumber={lesson.number}
        xp={lesson.xpEarned}
        questions={questions}
        answers={session.answers}
        questionIndex={questionIndex}
        taskNames={navigation.stepNames}
        onTaskSelect={navigation.goToStep}
        onAnswer={(option) =>
          setSession((current) =>
            answerQuizQuestion(current, questionIndex, option),
          )
        }
        onNextQuestion={() => setQuestionIndex((current) => current + 1)}
        onBack={() => setIsQuizOpen(false)}
        onClose={() => router.replace('/')}
        onContinue={goNextSection}
      />
    );
  }

  return (
    <ReadScreen
      lessonNumber={lesson.number}
      xp={lesson.xpEarned}
      text={story.text}
      highlightedWords={story.highlightedWords}
      translation={story.translation}
      isTranslationShown={isTranslationShown}
      words={lessonWords}
      nativeLanguage={nativeLanguage}
      activeWord={activeWord}
      onWordPress={(word) => setActiveWord(word === activeWord ? null : word)}
      onTranslationToggle={() => setIsTranslationShown((isShown) => !isShown)}
      isListening={listening.isListening}
      onPlayText={() => listening.toggle(story.text)}
      onPlayWord={(word) => {
        listening.stop();
        speakWord(displayedWord(word), word.targetLanguage);
      }}
      taskNames={navigation.stepNames}
      onTaskSelect={navigation.goToStep}
      onBack={navigation.goBack}
      onClose={() => router.replace('/')}
      onStartQuiz={() => setIsQuizOpen(true)}
    />
  );
}

function ReadTask(props: Omit<ReadTaskProps, 'story'>) {
  const story = useAppStore((state) => state.stories[props.lesson.id]);
  if (!story) return null;
  return <LoadedReadTask {...props} story={story} />;
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
