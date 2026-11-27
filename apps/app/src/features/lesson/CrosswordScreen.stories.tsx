import {
  closeCrosswordEntry,
  createCrosswordSession,
  crosswordEntryAt,
  selectCrosswordEntry,
  showCrosswordHint,
  typeCrosswordLetter,
  type CrosswordSession,
} from '@daily-chunk/core';
import { getTargetLanguagePack } from '@daily-chunk/languages';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { lessonStepNames } from '../../lib/lesson-step-names';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { crosswordPuzzleFor } from '../../mocks/crossword';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { demoWords } from '../../mocks/words';
import { CrosswordScreen, type CrosswordScreenProps } from './CrosswordScreen';
import { crosswordScreenMeta } from './CrosswordScreen.meta';

const puzzles = {
  en: crosswordPuzzleFor(demoWords, 'en'),
  ru: crosswordPuzzleFor(demoWords, 'ru'),
};
const puzzle = puzzles.en;
const { keyboardRows } = getTargetLanguagePack('de');

function typed(session: CrosswordSession, letters: string) {
  return [...letters].reduce(
    (current, letter) => typeCrosswordLetter(puzzle, current, letter),
    session,
  );
}

const start = createCrosswordSession(puzzle);
const bahnhofOpen = typed(selectCrosswordEntry(start, 0), 'BA');
const zugSolved = typed(selectCrosswordEntry(start, 1), 'ZU');

function solvedAll() {
  return puzzle.entries.reduce((session, entry, index) => {
    const opened = selectCrosswordEntry(session, index);
    const missing = [...entry.answer].filter((_letter, position) => {
      const key =
        entry.direction === 'down'
          ? `${entry.row + position},${entry.column}`
          : `${entry.row},${entry.column + position}`;
      return !opened.letters[key];
    });
    return typed(opened, missing.join(''));
  }, start);
}

function CrosswordDemo(props: CrosswordScreenProps) {
  const [session, setSession] = useState(props.session);

  return (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => {
          const localPuzzle = {
            ...props.puzzle,
            entries: puzzles[appLanguage].entries,
          };
          return (
            <CrosswordScreen
              {...props}
              puzzle={localPuzzle}
              session={session}
              taskNames={lessonStepNames(t, appLanguage, 'de')}
              onCellPress={(key) => {
                const index = crosswordEntryAt(localPuzzle, session, key);
                if (index !== undefined) {
                  setSession(selectCrosswordEntry(session, index));
                }
                props.onCellPress(key);
              }}
              onKeyPress={(letter) => {
                setSession(typeCrosswordLetter(localPuzzle, session, letter));
                props.onKeyPress(letter);
              }}
              onHint={() => {
                setSession(showCrosswordHint(session));
                props.onHint();
              }}
              onCloseClue={() => {
                setSession(closeCrosswordEntry(session));
                props.onCloseClue();
              }}
            />
          );
        }}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Screens/Crossword',
  component: CrosswordScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(crosswordScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.crossword,
    puzzle,
    session: start,
    keyboardRows,
    targetLanguage: 'de',
    taskNames: [],
    onTaskSelect: fn(),
    onCellPress: fn(),
    onKeyPress: fn(),
    onHint: fn(),
    onCloseClue: fn(),
    onNext: fn(),
    onBack: fn(),
    onClose: fn(),
  },
  render: (args: CrosswordScreenProps) => <CrosswordDemo {...args} />,
} satisfies Meta<typeof CrosswordScreen>;

export default meta;

type Story = StoryObj<typeof CrosswordScreen>;

function firstCellName(t: ReturnType<typeof textFor>) {
  return t('crossword.cellEmpty', {
    words: t('crossword.cellWord', {
      number: 1,
      position: 1,
      direction: t('crossword.directionDown'),
    }),
  });
}

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(await canvas.findByText(t('crossword.start'))).toBeTruthy();
    expect(
      canvas
        .getByRole('button', { name: t('lesson.nextSection') })
        .getAttribute('aria-disabled'),
    ).toBe('true');

    await userEvent.click(
      canvas.getByRole('button', { name: firstCellName(t) }),
    );

    expect(canvas.getByText(t('crossword.down', { number: 1 }))).toBeTruthy();
    expect(canvas.getByText(puzzle.entries[0]!.clue)).toBeTruthy();
    expect(
      canvas.getByText(t('crossword.lessonWordInfo', { count: 7 })),
    ).toBeTruthy();
    expect(
      canvas
        .getByRole('button', { name: t('lesson.nextSection') })
        .getAttribute('aria-disabled'),
    ).toBe('true');

    await userEvent.click(canvas.getByRole('button', { name: 'B' }));

    expect(args.onKeyPress).toHaveBeenCalledWith('B');
    expect(
      canvas.getByRole('button', {
        name: t('crossword.cellLetter', {
          words: t('crossword.cellWord', {
            number: 1,
            position: 1,
            direction: t('crossword.directionDown'),
          }),
          letter: 'B',
        }),
      }),
    ).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', { name: t('crossword.closeKeyboard') }),
    );

    expect(args.onCloseClue).toHaveBeenCalledTimes(1);
    expect(canvas.getByText(t('crossword.start'))).toBeTruthy();
  },
};

export const WordOpen: Story = {
  args: { session: bahnhofOpen },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      await canvas.findByRole('group', { name: t('crossword.keyboard') }),
    ).toBeTruthy();
    expect(
      canvas.getByRole('button', { name: t('crossword.showHint') }),
    ).toBeTruthy();
  },
};

export const WrongLetter: Story = {
  args: { session: bahnhofOpen },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    await userEvent.click(await canvas.findByRole('button', { name: 'X' }));

    expect(
      canvas.getByText(t('crossword.wrong', { letter: 'X', count: 2 })),
    ).toBeTruthy();

    await userEvent.click(canvas.getByRole('button', { name: 'Y' }));
    await userEvent.click(canvas.getByRole('button', { name: 'Z' }));

    expect(canvas.getByText(t('crossword.filled'))).toBeTruthy();
  },
};

export const HintShown: Story = {
  args: { session: bahnhofOpen },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const translation = puzzles[appLanguageOf(globals)].entries[0]!.translation;

    expect(canvas.queryByText(t('crossword.hint', { translation }))).toBeNull();

    await userEvent.click(
      await canvas.findByRole('button', { name: t('crossword.showHint') }),
    );

    expect(args.onHint).toHaveBeenCalledTimes(1);
    expect(canvas.getByText(t('crossword.hint', { translation }))).toBeTruthy();
    expect(
      canvas
        .getByRole('button', { name: t('crossword.hintUsed') })
        .getAttribute('aria-disabled'),
    ).toBe('true');
  },
};

export const LinkWordOpen: Story = {
  args: { session: selectCrosswordEntry(start, 1) },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      await canvas.findByText(
        t('crossword.linkClue', {
          label: t('crossword.across', { number: 2 }),
        }),
      ),
    ).toBeTruthy();
    expect(canvas.getByText(t('crossword.linkWordInfo'))).toBeTruthy();
  },
};

export const WordSolved: Story = {
  args: { session: zugSolved },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(await canvas.findByText(t('crossword.solved'))).toBeTruthy();
    expect(canvas.getByText('Zug')).toBeTruthy();
    expect(canvas.getByText('der')).toBeTruthy();
  },
};

export const AllSolved: Story = {
  args: { session: closeCrosswordEntry(solvedAll()) },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const next = await canvas.findByRole('button', {
      name: t('lesson.nextSection'),
    });

    expect(canvas.getByText(t('crossword.allSolved'))).toBeTruthy();
    expect(next.getAttribute('aria-disabled')).not.toBe('true');

    await userEvent.click(next);

    expect(args.onNext).toHaveBeenCalledTimes(1);
  },
};

export const WideScreen: Story = {
  args: { session: bahnhofOpen },
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const grid = (
      await canvas.findByRole('group', { name: t('crossword.grid') })
    ).getBoundingClientRect();
    const keyboard = canvas
      .getByRole('group', { name: t('crossword.keyboard') })
      .getBoundingClientRect();
    const next = canvas
      .getByRole('button', { name: t('lesson.nextSection') })
      .getBoundingClientRect();

    expect(window.innerWidth).toBeGreaterThanOrEqual(1024);
    expect(keyboard.left).toBeGreaterThan(grid.right);
    expect(Math.abs(keyboard.width - grid.width)).toBeLessThan(2);
    expect(next.top).toBeGreaterThan(Math.max(grid.bottom, keyboard.bottom));
    expect(next.bottom).toBeLessThanOrEqual(window.innerHeight);
  },
};

export const WideGrid: Story = {
  args: { session: bahnhofOpen, puzzle: { ...puzzle, columns: 15 } },
  globals: { viewport: { value: 'desktop', isRotated: false } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const grid = (
      await canvas.findByRole('group', { name: t('crossword.grid') })
    ).getBoundingClientRect();
    const keyboard = canvas
      .getByRole('group', { name: t('crossword.keyboard') })
      .getBoundingClientRect();

    expect(grid.width / keyboard.width).toBeCloseTo(15 / 9, 1);
  },
};

export const LessonWordsFound: Story = {
  args: {
    session: closeCrosswordEntry(
      [0, 2, 3].reduce((session, index) => {
        const entry = puzzle.entries[index]!;
        const opened = selectCrosswordEntry(session, index);
        const missing = [...entry.answer].filter((_letter, position) => {
          const key =
            entry.direction === 'down'
              ? `${entry.row + position},${entry.column}`
              : `${entry.row},${entry.column + position}`;
          return !opened.letters[key];
        });
        return typed(opened, missing.join(''));
      }, start),
    ),
  },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const next = await canvas.findByRole('button', {
      name: t('lesson.nextSection'),
    });

    expect(canvas.getByText(t('crossword.allSolved'))).toBeTruthy();
    expect(next.getAttribute('aria-disabled')).not.toBe('true');

    await userEvent.click(next);

    expect(args.onNext).toHaveBeenCalledTimes(1);
  },
};

export const NarrowScreen: Story = {
  args: { session: bahnhofOpen },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    await within(canvasElement).findByRole('group', {
      name: t('crossword.keyboard'),
    });

    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};
