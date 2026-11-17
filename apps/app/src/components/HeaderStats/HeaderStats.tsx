import { View } from 'react-native';

import { Text } from '../ui/text';

type HeaderStatsProps = {
  xp: number;
  xpLabel: string;
  streakLabel: string;
};

function HeaderStats({ xp, xpLabel, streakLabel }: HeaderStatsProps) {
  return (
    <View className="items-end">
      <View className="flex-row items-baseline gap-1">
        <Text variant="display-btn-sm" className="text-primary">
          {xp}
        </Text>
        <Text variant="caption" className="text-ring">
          {xpLabel}
        </Text>
      </View>
      <Text variant="caption" className="text-ring">
        {streakLabel}
      </Text>
    </View>
  );
}

export { HeaderStats };
export type { HeaderStatsProps };
