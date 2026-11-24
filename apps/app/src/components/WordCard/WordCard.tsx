import { useTranslation } from '@daily-chunk/i18n';
import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';

import { useReducedMotion } from '../../lib/use-reduced-motion';
import { cn } from '../../lib/utils';
import { HardShadow } from '../../theme/HardShadow/HardShadow';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text } from '../ui/text';
import { flipDurationInMs } from './flip-duration';

const useNativeDriver = Platform.OS !== 'web';
const turnPerspective = 2000;
const turnInput = [0, 0.5, 0.5, 1];
const fadeInput = [0, 0.4, 0.6, 1];
const flipEasing = Easing.inOut(Easing.quad);

type CardFaceProps = {
  opacity: Animated.AnimatedInterpolation<number>;
  isHidden: boolean;
  className: string;
  testID: string;
  children: ReactNode;
};

function CardFace({
  opacity,
  isHidden,
  className,
  testID,
  children,
}: CardFaceProps) {
  return (
    <Animated.View
      testID={testID}
      aria-hidden={isHidden}
      style={{ ...StyleSheet.absoluteFill, opacity }}
    >
      <View
        className={cn(
          'flex-1 justify-between border-2 border-border p-6',
          className,
        )}
      >
        {children}
      </View>
    </Animated.View>
  );
}

type WordCardProps = {
  isFlipped: boolean;
  onFlip: () => void;
  front: ReactNode;
  back: ReactNode;
  corner?: ReactNode;
  overlay?: ReactNode;
};

function WordCard({
  isFlipped,
  onFlip,
  front,
  back,
  corner,
  overlay,
}: WordCardProps) {
  const { t } = useTranslation();
  const isMotionReduced = useReducedMotion();
  const [flip] = useState(() => new Animated.Value(isFlipped ? 1 : 0));
  const target = isFlipped ? 1 : 0;

  useEffect(() => {
    if (isMotionReduced) {
      flip.setValue(target);
      return;
    }
    Animated.timing(flip, {
      toValue: target,
      duration: flipDurationInMs,
      easing: flipEasing,
      useNativeDriver,
    }).start();
  }, [flip, isMotionReduced, target]);

  return (
    <View className="relative">
      <Animated.View
        style={{
          transform: [
            { perspective: turnPerspective },
            {
              rotateY: flip.interpolate({
                inputRange: turnInput,
                outputRange: ['0deg', '90deg', '-90deg', '0deg'],
              }),
            },
          ],
        }}
      >
        <HardShadow className="w-full">
          <PressableFocus
            accessibilityRole="button"
            accessibilityHint={t('flashcard.flipHint')}
            onPress={onFlip}
            className="aspect-square w-full"
          >
            <CardFace
              testID="word-card-front"
              opacity={flip.interpolate({
                inputRange: fadeInput,
                outputRange: [1, 1, 0, 0],
              })}
              isHidden={isFlipped}
              className="bg-card"
            >
              {front}
              <Text variant="caption" className="self-end">
                {t('flashcard.tapToFlip')}
              </Text>
            </CardFace>
            <CardFace
              testID="word-card-back"
              opacity={flip.interpolate({
                inputRange: fadeInput,
                outputRange: [0, 0, 1, 1],
              })}
              isHidden={!isFlipped}
              className="bg-popover"
            >
              {back}
              <Text variant="caption" className="self-end">
                {t('flashcard.tapToFlipBack')}
              </Text>
            </CardFace>
          </PressableFocus>
        </HardShadow>
      </Animated.View>
      {corner && <View className="absolute right-2 top-2">{corner}</View>}
      {overlay && (
        <View className="absolute inset-x-2 top-16 desktop:inset-x-auto desktop:left-full desktop:top-2 desktop:ml-4 desktop:w-rail">
          {overlay}
        </View>
      )}
    </View>
  );
}

export { WordCard };
export type { WordCardProps };
