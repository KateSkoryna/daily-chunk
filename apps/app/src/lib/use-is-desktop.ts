import { rem } from 'nativewind';
import { useWindowDimensions } from 'react-native';

export const desktopMinWidthInRem = 64;

export function useIsDesktop() {
  const { width } = useWindowDimensions();
  return width / rem.get() >= desktopMinWidthInRem;
}
