import type { Word } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import { ListGroup } from '../../components/ListGroup/ListGroup';
import { Screen } from '../../components/Screen/Screen';
import { SectionLabel } from '../../components/SectionLabel/SectionLabel';
import { StatTile } from '../../components/StatTile/StatTile';
import { TutorQuote } from '../../components/TutorQuote/TutorQuote';
import { WordTag } from '../../components/WordTag/WordTag';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';
import { cn } from '../../lib/utils';

type ReviewWord = {
  word: Word;
  isWeak: boolean;
};

type DoneScreenProps = {
  lessonNumber: number;
  xp: number;
  streakDays: number;
  accuracyPercent: number;
  reviewWords: ReviewWord[];
  bossRound: { lessonsDone: number; lessonsTotal: number };
  onBackToBase: () => void;
  onReplayRecording: () => void;
};

function DoneScreen({
  lessonNumber,
  xp,
  streakDays,
  accuracyPercent,
  reviewWords,
  bossRound,
  onBackToBase,
  onReplayRecording,
}: DoneScreenProps) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-4">
      <Text variant="label" className="text-ring">
        {t('done.lessonCleared', { number: lessonNumber })}
      </Text>
      <GlitchTitle>{t('done.stageClear')}</GlitchTitle>
      <View className="flex-row gap-2">
        <StatTile
          variant="primary"
          value={`+${xp}`}
          label={t('stats.xp')}
          className="flex-1"
        />
        <StatTile
          variant="success"
          value={String(streakDays)}
          label={t('stats.dayStreak')}
          className="flex-1"
        />
        <StatTile
          variant="highlight"
          value={`${accuracyPercent}%`}
          label={t('stats.accuracy')}
          className="flex-1"
        />
      </View>
      <TutorQuote tabLabel={t('tutor.says')}>
        {t('done.chunkLine', { count: reviewWords.length })}
      </TutorQuote>
      <View className="gap-2">
        <SectionLabel>{t('done.addedToReview')}</SectionLabel>
        <ListGroup>
          {reviewWords.map(({ word, isWeak }) => (
            <ListGroup.Row
              key={word.id}
              left={<WordTag word={word} className="min-w-14" />}
              right={
                <Text
                  variant="caption"
                  className={cn('uppercase', isWeak && 'text-highlight')}
                >
                  {t(isWeak ? 'done.tomorrowWeak' : 'done.tomorrow')}
                </Text>
              }
            >
              <Text variant="option">{word.lemma}</Text>
            </ListGroup.Row>
          ))}
        </ListGroup>
      </View>
      <Text variant="ui" className="uppercase text-ring">
        {t('done.bossUnlocks', {
          count: bossRound.lessonsTotal - bossRound.lessonsDone,
          done: bossRound.lessonsDone,
          total: bossRound.lessonsTotal,
        })}
      </Text>
      <View className="mt-auto gap-2">
        <Button onPress={onBackToBase}>
          <Text>{t('done.backToBase')}</Text>
        </Button>
        <Button variant="ghost" onPress={onReplayRecording}>
          <Text>{t('done.replayRecording')}</Text>
        </Button>
      </View>
    </Screen>
  );
}

export { DoneScreen };
export type { DoneScreenProps, ReviewWord };
