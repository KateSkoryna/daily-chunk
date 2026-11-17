import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import {
  SentenceBuilder,
  type SentenceBuilderProps,
  type SentenceTile,
} from './SentenceBuilder';
import { sentenceBuilderMeta } from './SentenceBuilder.meta';

const allTiles: SentenceTile[] = [
  { id: 'ich', text: 'Ich' },
  { id: 'warte', text: 'warte' },
  { id: 'seit', text: 'seit' },
  { id: 'einer', text: 'einer' },
  { id: 'stunde', text: 'Stunde' },
  { id: 'am', text: 'am' },
  { id: 'bahnhof', text: 'Bahnhof' },
  { id: 'bin', text: 'bin' },
];

function BuilderDemo({
  answerLabel,
  onAdd,
  onRemove,
}: Pick<SentenceBuilderProps, 'answerLabel' | 'onAdd' | 'onRemove'>) {
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const answer = answerIds.map((id) =>
    allTiles.find((tile) => tile.id === id)!,
  );
  const pool = allTiles.filter((tile) => !answerIds.includes(tile.id));

  return (
    <View className="p-gutter">
      <SentenceBuilder
        answer={answer}
        pool={pool}
        answerLabel={answerLabel}
        onAdd={(id) => {
          setAnswerIds([...answerIds, id]);
          onAdd(id);
        }}
        onRemove={(id) => {
          setAnswerIds(answerIds.filter((answerId) => answerId !== id));
          onRemove(id);
        }}
      />
    </View>
  );
}

const meta = {
  title: 'Components/SentenceBuilder',
  component: SentenceBuilder,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(sentenceBuilderMeta) } },
    controls: { include: ['answerLabel'] },
  },
  args: {
    answer: [],
    pool: allTiles,
    answerLabel: 'Your answer',
    onAdd: fn(),
    onRemove: fn(),
  },
  argTypes: {
    answerLabel: {
      control: 'text',
      description: 'Names the answer line for a screen reader.',
    },
  },
  render: ({ answerLabel, onAdd, onRemove }) => (
    <BuilderDemo answerLabel={answerLabel} onAdd={onAdd} onRemove={onRemove} />
  ),
} satisfies Meta<typeof SentenceBuilder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const answerLine = await canvas.findByRole('group', {
      name: args.answerLabel,
    });

    expect(within(answerLine).queryAllByRole('button')).toHaveLength(0);
    expect(
      toRem(answerLine.getBoundingClientRect().height),
    ).toBeGreaterThanOrEqual(7);
    expect(getComputedStyle(answerLine).borderTopStyle).toBe('solid');
    expect(canvas.getAllByRole('button')).toHaveLength(allTiles.length);

    for (const tile of canvas.getAllByRole('button')) {
      expect(toRem(tile.getBoundingClientRect().height)).toBe(3);
    }

    await userEvent.click(canvas.getByRole('button', { name: 'Ich' }));
    await userEvent.click(canvas.getByRole('button', { name: 'warte' }));

    expect(args.onAdd).toHaveBeenNthCalledWith(1, 'ich');
    expect(args.onAdd).toHaveBeenNthCalledWith(2, 'warte');
    expect(
      within(answerLine)
        .getAllByRole('button')
        .map((tile) => tile.textContent),
    ).toEqual(['Ich', 'warte']);
    expect(canvas.getAllByRole('button')).toHaveLength(allTiles.length);

    await userEvent.click(
      within(answerLine).getByRole('button', { name: 'Ich' }),
    );

    expect(args.onRemove).toHaveBeenCalledWith('ich');
    expect(
      within(answerLine)
        .getAllByRole('button')
        .map((tile) => tile.textContent),
    ).toEqual(['warte']);
  },
};
