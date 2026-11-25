import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
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
          onRemove?.(id);
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
    controls: { disable: true },
  },
  args: {
    answer: [],
    pool: allTiles,
    onAdd: fn(),
    onRemove: fn(),
  },
  render: ({ onAdd, onRemove }) => (
    <WithText>
      {(t) => (
        <BuilderDemo
          answerLabel={t('sentenceBuilder.answer')}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      )}
    </WithText>
  ),
} satisfies Meta<typeof SentenceBuilder>;

export default meta;

type Story = StoryObj<typeof SentenceBuilder>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const answerLine = await canvas.findByRole('group', {
      name: t('sentenceBuilder.answer'),
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

export const WrongAndHintTiles: Story = {
  args: {
    answer: [{ id: 'ich', text: 'Ich' }],
    pool: [
      { id: 'bin', text: 'bin', status: 'wrong', label: 'bin, not this one' },
      {
        id: 'warte',
        text: 'warte',
        status: 'hint',
        label: 'warte, the next word',
      },
      { id: 'am', text: 'am' },
    ],
    onRemove: undefined,
  },
  render: (args) => (
    <WithText>
      {(t) => (
        <View className="p-gutter">
          <SentenceBuilder
            {...args}
            answerLabel={t('sentenceBuilder.answer')}
          />
        </View>
      )}
    </WithText>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const wrong = await canvas.findByRole('button', {
      name: 'bin, not this one',
    });
    const hint = canvas.getByRole('button', { name: 'warte, the next word' });

    expect(getComputedStyle(wrong).borderTopColor).not.toBe(
      getComputedStyle(canvas.getByRole('button', { name: 'am' }))
        .borderTopColor,
    );
    expect(getComputedStyle(hint).borderTopColor).not.toBe(
      getComputedStyle(wrong).borderTopColor,
    );
    expect(wrong.querySelector('svg')).not.toBeNull();
    expect(hint.querySelector('svg')).not.toBeNull();
    expect(canvas.queryAllByRole('button', { name: 'Ich' })).toHaveLength(0);

    await userEvent.click(hint);
    expect(args.onAdd).toHaveBeenCalledWith('warte');
  },
};
