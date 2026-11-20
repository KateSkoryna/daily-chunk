import { currentLessonNumber } from '@daily-chunk/core';
import { useTranslation } from '@daily-chunk/i18n';
import { useRouter } from 'expo-router';

import { PlaceholderScreen } from '../../src/features/navigation/PlaceholderScreen';
import { useAppStore, useStartAppStore } from '../../src/state/use-app-store';

export default function LessonTaskPlaceholder() {
  useStartAppStore();
  const { t } = useTranslation();
  const router = useRouter();
  const lessons = useAppStore((state) => state.lessons);

  return (
    <PlaceholderScreen
      title={t('lesson.title', { number: currentLessonNumber(lessons) })}
      buttonIcon="cross"
      buttonLabel={t('lesson.quit')}
      onButtonPress={() =>
        router.canGoBack() ? router.back() : router.replace('/')
      }
    />
  );
}
