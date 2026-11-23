import { useTranslation } from '@daily-chunk/i18n';

import { cn } from '../../lib/utils';
import { Icon } from '../Icon/Icon';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { TextClassContext } from '../ui/text';

type TipButtonProps = {
  word: string;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
};

function TipButton({ word, isOpen, onToggle, className }: TipButtonProps) {
  const { t } = useTranslation();

  return (
    <TextClassContext.Provider value={isOpen ? 'text-background' : 'text-ring'}>
      <PressableFocus
        accessibilityRole="button"
        accessibilityLabel={t('tip.button', { word })}
        aria-expanded={isOpen}
        onPress={onToggle}
        className={cn(
          'items-center justify-center',
          isOpen && 'bg-ring',
          className,
        )}
      >
        <Icon name="lamp" decorative />
      </PressableFocus>
    </TextClassContext.Provider>
  );
}

export { TipButton };
export type { TipButtonProps };
