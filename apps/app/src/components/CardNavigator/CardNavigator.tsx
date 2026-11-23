import { useMemo, type ReactNode } from 'react';
import { PanResponder, Platform, View } from 'react-native';

import { isHorizontalDrag, swipeDirection } from '../../lib/swipe-direction';
import { ArrowButton } from '../ArrowButton/ArrowButton';
import { Text } from '../ui/text';

type CardNavigatorProps = {
  isFirst: boolean;
  isLast: boolean;
  previousLabel: string;
  nextLabel: string;
  swipeHint: string;
  onPrevious: () => void;
  onNext: () => void;
  children: ReactNode;
};

function CardNavigator({
  isFirst,
  isLast,
  previousLabel,
  nextLabel,
  swipeHint,
  onPrevious,
  onNext,
  children,
}: CardNavigatorProps) {
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_event, move) =>
          isHorizontalDrag(move.dx, move.dy),
        onPanResponderRelease: (_event, move) => {
          const direction = swipeDirection(move.dx, move.dy);
          if (direction === 'left' && !isLast) onNext();
          if (direction === 'right' && !isFirst) onPrevious();
        },
      }),
    [isFirst, isLast, onPrevious, onNext],
  );

  if (Platform.OS === 'web') {
    return (
      <View className="flex-row items-center justify-center gap-4 desktop:gap-8">
        <ArrowButton
          direction="previous"
          label={previousLabel}
          disabled={isFirst}
          onPress={onPrevious}
        />
        <View className="max-w-flashcard flex-1 desktop:max-w-flashcard-desktop">
          {children}
        </View>
        <ArrowButton
          direction="next"
          label={nextLabel}
          disabled={isLast}
          onPress={onNext}
        />
      </View>
    );
  }

  return (
    <View className="gap-2">
      <View {...panResponder.panHandlers}>{children}</View>
      <Text variant="caption" className="text-center">
        {swipeHint}
      </Text>
    </View>
  );
}

export { CardNavigator };
export type { CardNavigatorProps };
