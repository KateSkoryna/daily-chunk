import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type ChipProps = {
  label: string;
  icon?: IconName;
  onPress: () => void;
  accessibilityLabel?: string;
  className?: string;
};

function Chip({
  label,
  icon,
  onPress,
  accessibilityLabel,
  className,
}: ChipProps) {
  return (
    <PressableFocus
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className={cn(
        'h-control flex-1 flex-row items-center justify-center gap-2 border-2 border-highlight bg-card',
        className,
      )}
    >
      {icon ? <Icon name={icon} decorative className="text-highlight" /> : null}
      <Text variant="option">{label}</Text>
    </PressableFocus>
  );
}

export { Chip };
export type { ChipProps };
