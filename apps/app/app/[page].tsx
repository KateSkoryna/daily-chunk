import { useTranslation } from '@daily-chunk/i18n';
import { Redirect, useLocalSearchParams, useRouter } from 'expo-router';

import { PlaceholderScreen } from '../src/features/navigation/PlaceholderScreen';
import {
  isPageName,
  pageTitleKeys,
} from '../src/features/navigation/page-titles';

export default function PagePlaceholder() {
  const { t } = useTranslation();
  const router = useRouter();
  const { page } = useLocalSearchParams<{ page: string }>();

  if (!isPageName(page)) {
    return <Redirect href="/" />;
  }

  return (
    <PlaceholderScreen
      title={t(pageTitleKeys[page])}
      buttonIcon="back"
      buttonLabel={t('common.back')}
      onButtonPress={() =>
        router.canGoBack() ? router.back() : router.replace('/')
      }
    />
  );
}
