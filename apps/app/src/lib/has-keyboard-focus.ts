export function hasKeyboardFocus(target: unknown) {
  const element = target as { matches?: (selector: string) => boolean };
  return element.matches?.(':focus-visible') ?? true;
}
