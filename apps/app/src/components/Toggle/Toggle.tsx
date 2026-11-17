import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';

type ToggleProps = {
  label: string;
  isOn: boolean;
  onToggle: () => void;
  className?: string;
};

function Toggle({ label, isOn, onToggle, className }: ToggleProps) {
  return (
    <PressableFocus
      accessibilityRole="switch"
      aria-checked={isOn}
      onPress={onToggle}
      className={cn(
        'h-control items-center justify-center border-2 px-3',
        isOn ? 'border-ring' : 'border-input',
        className,
      )}
    >
      <Text variant="ui" className={cn('uppercase', isOn && 'text-ring')}>
        {label}
      </Text>
    </PressableFocus>
  );
}

export { Toggle };
export type { ToggleProps };
