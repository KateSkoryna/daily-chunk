import { useTranslation } from '@daily-chunk/i18n';

import { PlaceholderScreen } from './PlaceholderScreen';
import { useMenu } from './menu-context';

type TabPlaceholderProps = {
  titleKey: 'nav.home' | 'nav.lessons' | 'nav.score' | 'nav.stats';
};

function TabPlaceholder({ titleKey }: TabPlaceholderProps) {
  const { t } = useTranslation();
  const { openMenu } = useMenu();

  return (
    <PlaceholderScreen
      title={t(titleKey)}
      buttonIcon="menu"
      buttonLabel={t('nav.menu')}
      onButtonPress={openMenu}
    />
  );
}

export { TabPlaceholder };
export type { TabPlaceholderProps };
