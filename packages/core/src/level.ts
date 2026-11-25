export const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'] as const;

export type Level = (typeof levels)[number];

export const defaultLevel: Level = 'B2';

export const textLevelsAhead = 2;

export function highestTextLevel(level: Level): Level {
  const index = Math.min(
    levels.indexOf(level) + textLevelsAhead,
    levels.length - 1,
  );
  return levels[index] as Level;
}
