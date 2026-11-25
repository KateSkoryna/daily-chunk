import { isDueForReview, maxWordsPerLesson } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useMenu } from '../../src/features/navigation/menu-context';
import { createWordFields, filledWords } from '../../src/lib/word-fields';
import { HomeScreen } from '../../src/features/words/HomeScreen';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

const minimumWords = 3;
const emptyTexts = Array.from({ length: minimumWords }, () => '');
const bossRound = { lessonsDone: 0, lessonsTotal: 5 };

export default function HomeTab() {
  useStartAppStore();
  const { t } = useTranslation();
  const router = useRouter();
  const { openMenu } = useMenu();
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const addTypedWords = useAppStore((state) => state.addTypedWords);
  const [typedWords, setTypedWords] = useState(() =>
    createWordFields(emptyTexts),
  );
  const [notice, setNotice] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);

  if (!profile) return null;

  const now = new Date();

  async function checkWords() {
    if (isChecking) return;
    setIsChecking(true);
    setNotice(undefined);
    try {
      const newWordCount = await addTypedWords(
        filledWords(typedWords).join('\n'),
      );
      if (newWordCount === 0) {
        setNotice(t('home.noWordsRecognised'));
        return;
      }
      router.replace('/confirm');
    } catch {
      setNotice(t('home.checkFailed'));
    } finally {
      setIsChecking(false);
    }
  }

  return (
    <HomeScreen
      xp={profile.xp}
      streak={profile.currentStreak}
      dueForReviewCount={
        words.filter((word) => isDueForReview(word, now)).length
      }
      bossRound={bossRound}
      words={typedWords}
      minimumWords={minimumWords}
      maxWords={maxWordsPerLesson}
      notice={notice}
      onWordsChange={(words) => {
        setNotice(undefined);
        setTypedWords(words);
      }}
      onWordsLeftOut={(count) =>
        setNotice(t('home.wordsLeftOut', { count, max: maxWordsPerLesson }))
      }
      onOpenMenu={openMenu}
      onOpenReview={() => router.push('/review')}
      onOpenBossRound={() => router.push('/boss')}
      onCheckWords={checkWords}
    />
  );
}
