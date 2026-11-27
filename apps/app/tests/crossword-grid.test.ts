import {
  createCrosswordSession,
  selectCrosswordEntry,
  typeCrosswordLetter,
  type CrosswordPuzzle,
} from '@daily-chunk/core';
import { describe, expect, it } from 'vitest';

import { createMockAiService } from '../src/ai/mock-ai-service';
import { crosswordGrid } from '../src/lib/crossword-grid';
import { demoWords } from '../src/mocks/words';

const { puzzle } = await createMockAiService().generateCrossword({
  languages: { targetLanguage: 'de', nativeLanguage: 'en' },
  words: demoWords,
  level: 'B2',
});

function cellAt(grid: ReturnType<typeof crosswordGrid>, key: string) {
  const [row, column] = key.split(',').map(Number) as [number, number];
  return grid[row]?.[column];
}

function typed(target: CrosswordPuzzle, index: number, letters: string) {
  return [...letters].reduce(
    (session, letter) => typeCrosswordLetter(target, session, letter),
    selectCrosswordEntry(createCrosswordSession(target), index),
  );
}

describe('crosswordGrid', () => {
  it('lays out the rows and columns with gaps where no word runs', () => {
    const grid = crosswordGrid(puzzle, createCrosswordSession(puzzle));

    expect(grid).toHaveLength(7);
    expect(grid[0]).toHaveLength(9);
    expect(cellAt(grid, '0,0')).toBeNull();
    expect(cellAt(grid, '0,2')).toMatchObject({
      number: 1,
      look: 'open',
      cursor: 'none',
      isPressable: true,
    });
  });

  it('shows the given letters on a raised cell', () => {
    const grid = crosswordGrid(puzzle, createCrosswordSession(puzzle));

    expect(cellAt(grid, '2,2')).toMatchObject({ letter: 'H', look: 'given' });
    expect(cellAt(grid, '2,2')?.words).toEqual([
      { number: 1, direction: 'down', position: 3 },
      { number: 4, direction: 'across', position: 3 },
    ]);
  });

  it('marks the open word and puts the cursor on its first empty cell', () => {
    const session = selectCrosswordEntry(createCrosswordSession(puzzle), 0);
    const grid = crosswordGrid(puzzle, session);

    expect(cellAt(grid, '0,2')).toMatchObject({
      look: 'active',
      cursor: 'next',
    });
    expect(cellAt(grid, '2,2')?.look).toBe('active');
    expect(cellAt(grid, '2,3')?.look).toBe('open');
  });

  it('turns the cursor wrong after a wrong letter and dashes a filled-in cell', () => {
    expect(
      cellAt(crosswordGrid(puzzle, typed(puzzle, 0, 'X')), '0,2'),
    ).toMatchObject({ cursor: 'wrong' });
    expect(
      cellAt(crosswordGrid(puzzle, typed(puzzle, 0, 'XYZ')), '0,2'),
    ).toMatchObject({ letter: 'B', isFilledIn: true, cursor: 'none' });
  });

  it('shows a solved lesson word as found and a solved link word as quiet', () => {
    const zug = crosswordGrid(puzzle, typed(puzzle, 1, 'ZU'));

    expect(cellAt(zug, '0,6')).toMatchObject({
      look: 'link-solved',
      isPressable: false,
    });
    expect(cellAt(zug, '0,8')).toMatchObject({
      look: 'link-solved',
      isPressable: true,
    });

    const gleis = crosswordGrid(puzzle, typed(puzzle, 2, 'LIS'));
    expect(cellAt(gleis, '1,8')?.look).toBe('solved');
  });
});
