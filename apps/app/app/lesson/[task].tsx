import { useTranslation } from '@daily-chunk/i18n';
import { useRouter } from 'expo-router';

import { PlaceholderScreen } from '../../src/features/navigation/PlaceholderScreen';
import { lessonThirteen } from '../../src/mocks/lesson';

export default function LessonTaskPlaceholder() {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <PlaceholderScreen
      title={t('lesson.title', { number: lessonThirteen.number })}
      buttonIcon="cross"
      buttonLabel={t('lesson.quit')}
      onButtonPress={() =>
        router.canGoBack() ? router.back() : router.replace('/')
      }
    />
  );
}
