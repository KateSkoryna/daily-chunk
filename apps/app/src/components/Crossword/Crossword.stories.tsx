import {
  createCrosswordSession,
  crosswordEntryAt,
  selectCrosswordEntry,
  typeCrosswordLetter,
  type CrosswordSession,
} from '@daily-chunk/core';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { crosswordGrid } from '../../lib/crossword-grid';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import { crosswordPuzzleFor } from '../../mocks/crossword';
import { demoWords } from '../../mocks/words';
import { Crossword, type CrosswordProps } from './Crossword';
import { crosswordMeta } from './Crossword.meta';

const puzzle = crosswordPuzzleFor(demoWords, 'en');
const freshSession = createCrosswordSession(puzzle);

function typedInto(index: number, letters: string) {
  return [...letters].reduce(
    (session, letter) => typeCrosswordLetter(puzzle, session, letter),
    selectCrosswordEntry(freshSession, index),
  );
}

type CrosswordStoryArgs = CrosswordProps & { session: CrosswordSession };

function CrosswordDemo({
  session: startSession,
  onCellPress,
}: CrosswordStoryArgs) {
  const [session, setSession] = useState(startSession);

  return (
    <View className="max-w-content p-gutter">
      <Crossword
        rows={crosswordGrid(puzzle, session)}
        onCellPress={(key) => {
          const index = crosswordEntryAt(puzzle, session, key);
          if (index !== undefined) {
            setSession(selectCrosswordEntry(session, index));
          }
          onCellPress(key);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/Crossword',
  component: Crossword,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(crosswordMeta) } },
    controls: { disable: true },
  },
  args: { rows: [], onCellPress: fn(), session: freshSession },
  render: (args) => <CrosswordDemo {...(args as CrosswordStoryArgs)} />,
} satisfies Meta<CrosswordStoryArgs>;

export default meta;

type Story = StoryObj<CrosswordStoryArgs>;

function cellName(
  t: ReturnType<typeof textFor>,
  words: [number, 'down' | 'across', number][],
  letter?: string,
) {
  const names = words.map(([number, direction, position]) =>
    t('crossword.cellWord', {
      number,
      position,
      direction: t(
        direction === 'down'
          ? 'crossword.directionDown'
          : 'crossword.directionAcross',
      ),
    }),
  );
  const named =
    names.length > 1
      ? t('crossword.cellWords', { first: names[0], second: names[1] })
      : (names[0] as string);
  return letter
    ? t('crossword.cellLetter', { words: named, letter })
    : t('crossword.cellEmpty', { words: named });
}

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const grid = await canvas.findByRole('group', {
      name: t('crossword.grid'),
    });
    const firstCell = canvas.getByRole('button', {
      name: cellName(t, [[1, 'down', 1]]),
    });

    expect(within(grid).getAllByRole('button')).toHaveLength(21);
    expect(grid.getBoundingClientRect().right).toBeLessThanOrEqual(
      grid.parentElement!.getBoundingClientRect().right + 1,
    );
    expect(
      canvas.getByRole('button', {
        name: cellName(
          t,
          [
            [1, 'down', 3],
            [4, 'across', 3],
          ],
          'H',
        ),
      }),
    ).toBeTruthy();
    expect(firstCell.getAttribute('aria-current')).not.toBe('true');

    await userEvent.click(firstCell);

    expect(args.onCellPress).toHaveBeenCalledWith('0,2');
    expect(firstCell.getAttribute('aria-current')).toBe('true');
  },
};

export const WordOpen: Story = {
  args: { session: typedInto(0, 'BA') },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const cursor = await canvas.findByRole('button', {
      name: cellName(t, [[1, 'down', 4]]),
    });
    const typed = canvas.getByRole('button', {
      name: cellName(t, [[1, 'down', 1]], 'B'),
    });

    expect(typed.getAttribute('aria-current')).toBe('true');
    expect(getComputedStyle(cursor).borderTopWidth).not.toBe(
      getComputedStyle(typed).borderTopWidth,
    );
  },
};

export const WrongLetter: Story = {
  args: { session: typedInto(0, 'X') },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const cursor = await canvas.findByRole('button', {
      name: cellName(t, [[1, 'down', 1]]),
    });
    const open = canvas.getByRole('button', {
      name: cellName(t, [[3, 'down', 2]]),
    });

    expect(getComputedStyle(cursor).borderTopColor).not.toBe(
      getComputedStyle(open).borderTopColor,
    );
  },
};

export const FilledInByChunk: Story = {
  args: { session: typedInto(0, 'XYZ') },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const filled = await canvas.findByRole('button', {
      name: cellName(t, [[1, 'down', 1]], 'B'),
    });

    expect(getComputedStyle(filled).borderTopStyle).toBe('dashed');
  },
};

export const SolvedWords: Story = {
  args: {
    session: [...'FARKART'].reduce(
      (session, letter) => typeCrosswordLetter(puzzle, session, letter),
      selectCrosswordEntry(typedInto(1, 'ZU'), 3),
    ),
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const linkCell = await canvas.findByRole('button', {
      name: cellName(t, [[2, 'across', 1]], 'Z'),
    });
    const lessonCell = canvas.getByRole('button', {
      name: cellName(t, [[4, 'across', 1]], 'F'),
    });

    expect(linkCell.getAttribute('aria-disabled')).toBe('true');
    expect(lessonCell.getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(lessonCell).borderTopColor).not.toBe(
      getComputedStyle(linkCell).borderTopColor,
    );
  },
};
