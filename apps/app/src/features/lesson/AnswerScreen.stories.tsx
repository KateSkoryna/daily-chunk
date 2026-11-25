import {
  answerTiles,
  expectedAnswerWord,
  mistakesBeforeHint,
} from '@daily-chunk/core';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { lessonStepNames } from '../../lib/lesson-step-names';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { answerExercises } from '../../mocks/lesson-tasks';
import {
  AnswerScreen,
  type AnswerScreenProps,
  type AnswerTile,
} from './AnswerScreen';
import { answerScreenMeta } from './AnswerScreen.meta';

const exercise = answerExercises[3] as (typeof answerExercises)[number];
const answerWordsInOrder = exercise.answer.split(' ');
const allTiles = answerTiles(exercise.answer, 'story');

function AnswerDemo(props: AnswerScreenProps) {
  const [placed, setPlaced] = useState<AnswerTile[]>(props.placed);
  const [wrongTileId, setWrongTileId] = useState(props.wrongTileId);
  const [mistakesInRow, setMistakesInRow] = useState(0);
  const pool = allTiles.filter(
    (tile) => !placed.some((placedTile) => placedTile.id === tile.id),
  );
  const expectedWord = expectedAnswerWord(exercise.answer, placed.length);
  const hintTileId =
    props.hintTileId ??
    (mistakesInRow >= mistakesBeforeHint
      ? pool.find((tile) => tile.text === expectedWord)?.id
      : undefined);

  return (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <AnswerScreen
            {...props}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
            placed={placed}
            pool={props.pool.length === 0 ? [] : pool}
            wrongTileId={wrongTileId}
            hintTileId={hintTileId}
            translation={exercise.translations[appLanguage]}
            onTilePress={(id) => {
              const tile = pool.find((candidate) => candidate.id === id);
              if (!tile) return;
              if (tile.text === expectedWord) {
                setPlaced((current) => [...current, tile]);
                setWrongTileId(undefined);
                setMistakesInRow(0);
              } else {
                setWrongTileId(id);
                setMistakesInRow((current) => current + 1);
              }
              props.onTilePress(id);
            }}
          />
        )}
      </WithText>
    </View>
  );
}

function wordsAfter(count: number): AnswerTile[] {
  return answerWordsInOrder
    .slice(0, count)
    .map((text, index) => ({ id: `${index}`, text }));
}

const meta = {
  title: 'Screens/Answer',
  component: AnswerScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(answerScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.answer,
    question: exercise.question,
    questionNumber: 4,
    questionCount: 4,
    placed: [],
    pool: allTiles,
    rightAnswer: exercise.answer,
    translation: exercise.translations.en,
    isLast: false,
    taskNames: [],
    onTaskSelect: fn(),
    onTilePress: fn(),
    onNext: fn(),
    onBack: fn(),
    onClose: fn(),
  },
  render: (args: AnswerScreenProps) => <AnswerDemo {...args} />,
} satisfies Meta<typeof AnswerScreen>;

export default meta;

type Story = StoryObj<typeof AnswerScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const translation = exercise.translations[appLanguageOf(globals)];
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('group', {
      name: t('sentenceBuilder.answer'),
    });

    expect(canvas.getByText(exercise.question)).toBeTruthy();
    expect(
      canvas.getByText(t('answer.question', { current: 4, total: 4 })),
    ).toBeTruthy();
    expect(canvas.queryByText(translation)).toBeNull();

    for (const word of answerWordsInOrder) {
      await userEvent.click(canvas.getByRole('button', { name: word }));
    }

    expect(
      within(group)
        .getAllByText(/./)
        .map((tile) => tile.textContent),
    ).toEqual(answerWordsInOrder);
    expect(await canvas.findByText(t('answer.right'))).toBeTruthy();
    expect(canvas.getByText(translation)).toBeTruthy();
    expect(args.onTilePress).toHaveBeenCalledTimes(answerWordsInOrder.length);

    await userEvent.click(
      canvas.getByRole('button', { name: t('answer.next') }),
    );
    expect(args.onNext).toHaveBeenCalledTimes(1);
  },
};

export const WrongWord: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('group', {
      name: t('sentenceBuilder.answer'),
    });
    const wrongWord = answerWordsInOrder[3] as string;

    await userEvent.click(
      await canvas.findByRole('button', { name: wrongWord }),
    );

    expect(canvas.getByText(t('answer.notThis'))).toBeTruthy();
    expect(
      canvas.getByRole('button', {
        name: t('answer.wrongTile', { word: wrongWord }),
      }),
    ).toBeTruthy();
    expect(within(group).queryAllByText(/./)).toHaveLength(0);

    await userEvent.click(
      canvas.getByRole('button', {
        name: t('answer.wrongTile', { word: wrongWord }),
      }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: answerWordsInOrder[0] as string }),
    );

    expect(canvas.queryByText(t('answer.notThis'))).toBeNull();
    expect(within(group).getAllByText(/./)).toHaveLength(1);
  },
};

export const HintAfterThreeMistakes: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const wrongWord = answerWordsInOrder[3] as string;
    const nextWord = answerWordsInOrder[0] as string;

    for (let tap = 0; tap < mistakesBeforeHint; tap += 1) {
      await userEvent.click(
        await canvas.findByRole('button', {
          name: new RegExp(`^${wrongWord}`),
        }),
      );
    }

    expect(canvas.getByText(t('answer.hint'))).toBeTruthy();
    expect(
      canvas.getByRole('button', {
        name: t('answer.hintTile', { word: nextWord }),
      }),
    ).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', {
        name: t('answer.hintTile', { word: nextWord }),
      }),
    );

    expect(canvas.queryByText(t('answer.hint'))).toBeNull();
  },
};

export const HalfBuilt: Story = {
  args: {
    placed: wordsAfter(4),
    pool: allTiles.filter(
      (tile) => !wordsAfter(4).some((placed) => placed.id === tile.id),
    ),
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const group = await canvas.findByRole('group', {
      name: t('sentenceBuilder.answer'),
    });

    expect(within(group).queryAllByRole('button')).toHaveLength(0);
    expect(within(group).getAllByText(/./)).toHaveLength(4);
    expect(canvas.queryByText(t('answer.right'))).toBeNull();
  },
};

export const LastQuestionDone: Story = {
  args: {
    placed: wordsAfter(answerWordsInOrder.length),
    pool: [],
    isLast: true,
  },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(await canvas.findByText(t('answer.right'))).toBeTruthy();
    expect(
      canvas.getByRole('button', { name: t('lesson.nextSection') }),
    ).toBeTruthy();
  },
};
