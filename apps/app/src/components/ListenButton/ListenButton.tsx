import { useTranslation } from '@daily-chunk/i18n';

import { Icon } from '../Icon/Icon';
import { Button } from '../ui/button';
import { Text } from '../ui/text';

type ListenButtonProps = {
  isListening: boolean;
  onPress: () => void;
};

function ListenButton({ isListening, onPress }: ListenButtonProps) {
  const { t } = useTranslation();

  return (
    <Button variant="secondary" aria-pressed={isListening} onPress={onPress}>
      <Icon name={isListening ? 'stop' : 'speaker'} decorative />
      <Text>{isListening ? t('common.stop') : t('common.listen')}</Text>
    </Button>
  );
}

export { ListenButton };
export type { ListenButtonProps };
