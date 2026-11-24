import { isDueForReview, maxWordsPerLesson } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import { useRouter } from 'expo-router';
import { useState } from 'react';

import { useMenu } from '../../src/features/navigation/menu-context';
import { commitDraft } from '../../src/lib/word-chips';
import { HomeScreen } from '../../src/features/words/HomeScreen';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

const minimumWords = 3;
const bossRound = { lessonsDone: 0, lessonsTotal: 5 };

export default function HomeTab() {
  useStartAppStore();
  const { t } = useTranslation();
  const router = useRouter();
  const { openMenu } = useMenu();
  const profile = useAppStore((state) => state.profile);
  const words = useAppStore((state) => state.words);
  const addTypedWords = useAppStore((state) => state.addTypedWords);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [notice, setNotice] = useState<string>();
  const [isChecking, setIsChecking] = useState(false);

  if (!profile) return null;

  const now = new Date();

  async function checkWords() {
    if (isChecking) return;
    setIsChecking(true);
    setNotice(undefined);
    try {
      const allWords = commitDraft(typedWords, draft, maxWordsPerLesson).words;
      const newWordCount = await addTypedWords(allWords.join('\n'));
      if (newWordCount === 0) {
        setNotice(t('home.noWordsRecognised'));
        return;
      }
      setTypedWords([]);
      setDraft('');
      router.push('/confirm');
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
      draft={draft}
      minimumWords={minimumWords}
      maxWords={maxWordsPerLesson}
      notice={notice}
      onWordsChange={(change) => {
        setNotice(undefined);
        setTypedWords(change.words);
        setDraft(change.draft);
      }}
      onWordsLeftOut={(count) =>
        setNotice(t('home.wordsLeftOut', { count, max: maxWordsPerLesson }))
      }
      onDictate={() => setNotice(t('home.dictationComingSoon'))}
      onOpenMenu={openMenu}
      onOpenReview={() => router.push('/review')}
      onOpenBossRound={() => router.push('/boss')}
      onCheckWords={checkWords}
    />
  );
}
