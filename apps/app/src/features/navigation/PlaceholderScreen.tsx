import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { GlitchTitle } from '../../components/GlitchTitle/GlitchTitle';
import type { IconName } from '../../components/Icon/icon-shapes';
import { Screen } from '../../components/Screen/Screen';
import { TopBar } from '../../components/TopBar/TopBar';
import { Text } from '../../components/ui/text';

type PlaceholderScreenProps = {
  title: string;
  buttonIcon: Extract<IconName, 'menu' | 'back' | 'cross'>;
  buttonLabel: string;
  onButtonPress: () => void;
};

function PlaceholderScreen({
  title,
  buttonIcon,
  buttonLabel,
  onButtonPress,
}: PlaceholderScreenProps) {
  const { t } = useTranslation();

  return (
    <Screen className="gap-section">
      <TopBar
        left={
          <TopBar.Action
            icon={buttonIcon}
            label={buttonLabel}
            onPress={onButtonPress}
          />
        }
      />
      <View className="gap-4">
        <GlitchTitle variant="display-l">{title}</GlitchTitle>
        <Text variant="body" className="text-muted-foreground">
          {t('placeholder.comingSoon')}
        </Text>
      </View>
    </Screen>
  );
}

export { PlaceholderScreen };
export type { PlaceholderScreenProps };
