import { useTranslation } from '@daily-chunk/i18n';
import { View } from 'react-native';

import { HardShadow } from '../../theme/HardShadow/HardShadow';
import { Icon } from '../Icon/Icon';
import { Text, TextClassContext } from '../ui/text';

type TipCardProps = {
  tip: string;
};

function TipCard({ tip }: TipCardProps) {
  const { t } = useTranslation();

  return (
    <HardShadow>
      <View
        role="group"
        accessibilityLabel={t('tip.card')}
        className="flex-row items-start gap-2.5 border-2 border-ring bg-popover px-3 py-2.5"
      >
        <TextClassContext.Provider value="text-ring">
          <Icon name="lamp" decorative />
        </TextClassContext.Provider>
        <View className="min-w-0 flex-1">
          <Text variant="caption" className="uppercase">
            {t('tip.card')}
          </Text>
          <Text variant="body-sm">{tip}</Text>
        </View>
      </View>
    </HardShadow>
  );
}

export { TipCard };
export type { TipCardProps };
