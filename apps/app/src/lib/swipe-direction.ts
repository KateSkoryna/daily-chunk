export const swipeDistanceInPixels = 50;

export type SwipeDirection = 'left' | 'right' | null;

export function swipeDirection(
  horizontalMove: number,
  verticalMove: number,
): SwipeDirection {
  if (Math.abs(horizontalMove) < swipeDistanceInPixels) return null;
  if (Math.abs(horizontalMove) < Math.abs(verticalMove) * 1.5) return null;
  return horizontalMove < 0 ? 'left' : 'right';
}

export function isHorizontalDrag(
  horizontalMove: number,
  verticalMove: number,
): boolean {
  return (
    Math.abs(horizontalMove) > 10 &&
    Math.abs(horizontalMove) > Math.abs(verticalMove) * 1.5
  );
}
