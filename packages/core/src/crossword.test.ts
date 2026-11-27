import { describe, expect, it } from 'vitest';

import {
  closeCrosswordEntry,
  createCrosswordSession,
  crosswordCells,
  crosswordEntryAt,
  crosswordProblems,
  crosswordResult,
  areLessonWordsFound,
  nextCrosswordCell,
  selectCrosswordEntry,
  showCrosswordHint,
  typeCrosswordLetter,
  wrongTriesBeforeFill,
  wrongTriesLeft,
  type CrosswordPuzzle,
  type CrosswordSession,
} from './crossword';
import type { Word } from './word';

const puzzle: CrosswordPuzzle = {
  rows: 7,
  columns: 9,
  entries: [
    {
      number: 1,
      direction: 'down',
      row: 0,
      column: 2,
      answer: 'BAHNHOF',
      lemma: 'Bahnhof',
      gender: 'masc',
      wordId: 'word-bahnhof',
      clue: 'Ein Gebäude, in dem sich Reisende und Züge treffen.',
      translation: 'вокзал',
    },
    {
      number: 2,
      direction: 'across',
      row: 0,
      column: 6,
      answer: 'ZUG',
      lemma: 'Zug',
      gender: 'masc',
      wordId: null,
      clue: 'Er fährt auf Schienen und hält am Bahnhof.',
      translation: 'поезд',
    },
    {
      number: 3,
      direction: 'down',
      row: 0,
      column: 8,
      answer: 'GLEIS',
      lemma: 'Gleis',
      gender: 'neut',
      wordId: 'word-gleis',
      clue: 'Zwei Schienen mit einer Nummer, von denen der Zug abfährt.',
      translation: 'путь, платформа',
    },
    {
      number: 4,
      direction: 'across',
      row: 2,
      column: 0,
      answer: 'FAHRKARTE',
      lemma: 'Fahrkarte',
      gender: 'fem',
      wordId: 'word-fahrkarte',
      clue: 'Ohne sie darfst du nicht mitfahren. Du kaufst sie am Automaten.',
      translation: 'билет',
    },
  ],
  givenCells: ['2,2', '0,8', '2,8'],
};

const lessonWords = ['word-bahnhof', 'word-gleis', 'word-fahrkarte'].map(
  (id) => ({ id }) as Word,
);

function typeWord(session: CrosswordSession, letters: string) {
  return [...letters].reduce(
    (current, letter) => typeCrosswordLetter(puzzle, current, letter),
    session,
  );
}

function solveAll(session: CrosswordSession) {
  return puzzle.entries.reduce((current, _entry, index) => {
    const opened = selectCrosswordEntry(current, index);
    const missing = crosswordCells(puzzle.entries[index]!)
      .filter((cell) => !opened.letters[cell.key])
      .map((cell) => cell.letter)
      .join('');
    return typeWord(opened, missing);
  }, session);
}

describe('crosswordCells', () => {
  it('runs down the rows and across the columns', () => {
    expect(crosswordCells(puzzle.entries[1]!).map((cell) => cell.key)).toEqual([
      '0,6',
      '0,7',
      '0,8',
    ]);
    expect(
      crosswordCells(puzzle.entries[2]!)
        .slice(0, 3)
        .map((cell) => cell.key),
    ).toEqual(['0,8', '1,8', '2,8']);
  });
});

describe('crosswordProblems', () => {
  it('finds nothing wrong in the designed grid', () => {
    expect(crosswordProblems(puzzle, lessonWords)).toEqual([]);
  });

  it('names a lesson word that is not in the grid', () => {
    expect(
      crosswordProblems(puzzle, [
        ...lessonWords,
        { id: 'word-verspaetet' } as Word,
      ]),
    ).toEqual(['missing-word']);
  });

  it('names a word that leaves the grid, a clash and a given cell outside the words', () => {
    const broken: CrosswordPuzzle = {
      ...puzzle,
      columns: 8,
      entries: puzzle.entries.map((entry) =>
        entry.number === 2 ? { ...entry, answer: 'ZUX' } : entry,
      ),
      givenCells: [...puzzle.givenCells, '6,6'],
    };

    expect(crosswordProblems(broken, lessonWords)).toEqual([
      'outside-grid',
      'letter-clash',
      'given-outside-words',
    ]);
  });
});

describe('the crossword session', () => {
  it('starts with the given letters and nothing open', () => {
    const session = createCrosswordSession(puzzle);

    expect(session.letters).toEqual({ '2,2': 'H', '0,8': 'G', '2,8': 'E' });
    expect(session.activeIndex).toBeNull();
    expect(session.solvedIndexes).toEqual([]);
  });

  it('types into the first empty cell of the open word and skips given letters', () => {
    const opened = selectCrosswordEntry(createCrosswordSession(puzzle), 0);
    const typed = typeWord(opened, 'BA');

    expect(nextCrosswordCell(puzzle, typed)?.key).toBe('3,2');
    expect(typed.lastEvent).toBe('right');
  });

  it('keeps a wrong letter out and counts the tries left', () => {
    const opened = selectCrosswordEntry(createCrosswordSession(puzzle), 0);
    const wrong = typeCrosswordLetter(puzzle, opened, 'X');

    expect(wrong.letters['0,2']).toBeUndefined();
    expect(wrong.lastEvent).toBe('wrong');
    expect(wrong.lastWrongLetter).toBe('X');
    expect(wrongTriesLeft(puzzle, wrong)).toBe(wrongTriesBeforeFill - 1);
  });

  it('fills the letter in after three wrong tries on one cell', () => {
    const opened = selectCrosswordEntry(createCrosswordSession(puzzle), 0);
    const filled = typeWord(opened, 'XYZ');

    expect(filled.letters['0,2']).toBe('B');
    expect(filled.filledCells).toEqual(['0,2']);
    expect(filled.lastEvent).toBe('filled');
    expect(wrongTriesLeft(puzzle, filled)).toBe(wrongTriesBeforeFill);
  });

  it('closes the word when its last letter is in and remembers it as solved', () => {
    const opened = selectCrosswordEntry(createCrosswordSession(puzzle), 1);
    const solved = typeWord(opened, 'ZU');

    expect(solved.activeIndex).toBeNull();
    expect(solved.solvedIndexes).toEqual([1]);
    expect(solved.lastEvent).toBe('solved');
    expect(solved.lastSolvedIndex).toBe(1);
  });

  it('does not open a solved word again', () => {
    const solved = typeWord(
      selectCrosswordEntry(createCrosswordSession(puzzle), 1),
      'ZU',
    );

    expect(selectCrosswordEntry(solved, 1)).toBe(solved);
  });

  it('counts a word as solved when other letters already fill every cell', () => {
    const givenZug = { ...puzzle, givenCells: ['0,6', '0,7', '0,8'] };
    expect(createCrosswordSession(givenZug).solvedIndexes).toEqual([1]);

    const crossing: CrosswordPuzzle = {
      ...puzzle,
      givenCells: ['0,6', '0,7', '2,8', '3,8', '4,8'],
    };
    const gleis = typeWord(
      selectCrosswordEntry(createCrosswordSession(crossing), 2),
      'GL',
    );

    expect(gleis.solvedIndexes).toEqual([1, 2]);
    expect(gleis.lastSolvedIndex).toBe(2);
  });

  it('shows the translation hint once per word', () => {
    const opened = typeCrosswordLetter(
      puzzle,
      selectCrosswordEntry(createCrosswordSession(puzzle), 0),
      'X',
    );
    const hinted = showCrosswordHint(opened);

    expect(hinted.hintedIndexes).toEqual([0]);
    expect(hinted.lastEvent).toBe('none');
    expect(showCrosswordHint(hinted)).toBe(hinted);
    expect(
      showCrosswordHint(closeCrosswordEntry(hinted)).hintedIndexes,
    ).toEqual([0]);
  });

  it('ignores typing while no word is open', () => {
    const session = createCrosswordSession(puzzle);

    expect(typeCrosswordLetter(puzzle, session, 'B')).toBe(session);
  });
});

describe('letters without an upper case', () => {
  it('takes ß as it is and a lower-case letter as the same letter', () => {
    const strasse: CrosswordPuzzle = {
      rows: 1,
      columns: 6,
      entries: [
        {
          ...puzzle.entries[0]!,
          direction: 'across',
          row: 0,
          column: 0,
          answer: 'STRAßE',
          lemma: 'Straße',
          gender: 'fem',
        },
      ],
      givenCells: [],
    };
    const opened = selectCrosswordEntry(createCrosswordSession(strasse), 0);
    const typed = [...'stRAßE'].reduce(
      (current, letter) => typeCrosswordLetter(strasse, current, letter),
      opened,
    );

    expect(typed.lastEvent).toBe('solved');
    expect(typed.letters['0,4']).toBe('ß');
  });
});

describe('crosswordEntryAt', () => {
  it('opens the word of a cell, and the crossing word when that cell is in the open word', () => {
    const session = createCrosswordSession(puzzle);

    expect(crosswordEntryAt(puzzle, session, '0,2')).toBe(0);
    expect(crosswordEntryAt(puzzle, session, '2,2')).toBe(0);
    expect(
      crosswordEntryAt(puzzle, selectCrosswordEntry(session, 0), '2,2'),
    ).toBe(3);
    expect(crosswordEntryAt(puzzle, session, '6,6')).toBeUndefined();
  });

  it('skips solved words', () => {
    const solved = typeWord(
      selectCrosswordEntry(createCrosswordSession(puzzle), 1),
      'ZU',
    );

    expect(crosswordEntryAt(puzzle, solved, '0,8')).toBe(2);
    expect(crosswordEntryAt(puzzle, solved, '0,6')).toBeUndefined();
  });
});

describe('areLessonWordsFound', () => {
  it('needs every lesson word but not the link word', () => {
    const lessonWordsOnly = [0, 2, 3].reduce((session, index) => {
      const opened = selectCrosswordEntry(session, index);
      const missing = crosswordCells(puzzle.entries[index]!)
        .filter((cell) => !opened.letters[cell.key])
        .map((cell) => cell.letter)
        .join('');
      return typeWord(opened, missing);
    }, createCrosswordSession(puzzle));

    expect(areLessonWordsFound(puzzle, createCrosswordSession(puzzle))).toBe(
      false,
    );
    expect(lessonWordsOnly.solvedIndexes).not.toContain(1);
    expect(areLessonWordsFound(puzzle, lessonWordsOnly)).toBe(true);
  });
});

describe('crosswordResult', () => {
  it('counts the lesson words found without a filled-in letter, never the link word', () => {
    const withFill = typeWord(
      selectCrosswordEntry(createCrosswordSession(puzzle), 0),
      'XYZ',
    );
    const session = solveAll(closeCrosswordEntry(withFill));

    expect(areLessonWordsFound(puzzle, session)).toBe(true);
    expect(crosswordResult(puzzle, session)).toEqual({ correct: 2, total: 3 });
  });

  it('gives a full score when every word is typed right', () => {
    const session = solveAll(createCrosswordSession(puzzle));

    expect(crosswordResult(puzzle, session)).toEqual({ correct: 3, total: 3 });
  });

  it('counts an unsolved word as not found', () => {
    expect(crosswordResult(puzzle, createCrosswordSession(puzzle))).toEqual({
      correct: 0,
      total: 3,
    });
  });
});
