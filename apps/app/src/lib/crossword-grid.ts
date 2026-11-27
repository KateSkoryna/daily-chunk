import {
  crosswordCells,
  crosswordCellKey,
  nextCrosswordCell,
  type CrosswordDirection,
  type CrosswordPuzzle,
  type CrosswordSession,
} from '@daily-chunk/core';

export type CrosswordCellLook =
  'open' | 'given' | 'active' | 'solved' | 'link-solved';

export type CrosswordCursor = 'none' | 'next' | 'wrong';

export type CrosswordCellWord = {
  number: number;
  direction: CrosswordDirection;
  position: number;
};

export type CrosswordGridCell = {
  key: string;
  letter?: string;
  number?: number;
  words: CrosswordCellWord[];
  look: CrosswordCellLook;
  cursor: CrosswordCursor;
  isFilledIn: boolean;
  isPressable: boolean;
};

function lookOf(
  isInActiveWord: boolean,
  solvedOwners: { isLink: boolean }[],
  isGiven: boolean,
): CrosswordCellLook {
  if (isInActiveWord) return 'active';
  if (solvedOwners.some((owner) => !owner.isLink)) return 'solved';
  if (solvedOwners.length > 0) return 'link-solved';
  return isGiven ? 'given' : 'open';
}

export function crosswordGrid(
  puzzle: CrosswordPuzzle,
  session: CrosswordSession,
): (CrosswordGridCell | null)[][] {
  const activeEntry =
    session.activeIndex === null
      ? undefined
      : puzzle.entries[session.activeIndex];
  const activeKeys = new Set(
    activeEntry ? crosswordCells(activeEntry).map((cell) => cell.key) : [],
  );
  const cursorKey = nextCrosswordCell(puzzle, session)?.key;
  const owners = puzzle.entries.map((entry, index) => ({
    entry,
    index,
    keys: crosswordCells(entry).map((cell) => cell.key),
  }));

  return Array.from({ length: puzzle.rows }, (_row, row) =>
    Array.from({ length: puzzle.columns }, (_column, column) => {
      const key = crosswordCellKey(row, column);
      const cellOwners = owners.filter((owner) => owner.keys.includes(key));
      if (cellOwners.length === 0) return null;
      const solvedOwners = cellOwners
        .filter((owner) => session.solvedIndexes.includes(owner.index))
        .map((owner) => ({ isLink: owner.entry.wordId === null }));
      const isCursor = key === cursorKey;
      return {
        key,
        letter: session.letters[key],
        number: puzzle.entries.find(
          (entry) => entry.row === row && entry.column === column,
        )?.number,
        words: cellOwners.map(({ entry, keys }) => ({
          number: entry.number,
          direction: entry.direction,
          position: keys.indexOf(key) + 1,
        })),
        look: lookOf(
          activeKeys.has(key),
          solvedOwners,
          puzzle.givenCells.includes(key),
        ),
        cursor: isCursor
          ? session.lastEvent === 'wrong'
            ? 'wrong'
            : 'next'
          : 'none',
        isFilledIn: session.filledCells.includes(key),
        isPressable: solvedOwners.length < cellOwners.length,
      };
    }),
  );
}
