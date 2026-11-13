import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReducedMotion() {
  const [isMotionReduced, setIsMotionReduced] = useState(false);

  useEffect(() => {
    let isActive = true;
    AccessibilityInfo.isReduceMotionEnabled().then((isReduced) => {
      if (isActive) setIsMotionReduced(isReduced);
    });
    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      setIsMotionReduced,
    );
    return () => {
      isActive = false;
      subscription.remove();
    };
  }, []);

  return isMotionReduced;
}
