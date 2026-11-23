import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { displayedWord } from '../../lib/displayed-word';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { lessonStepNames } from '../../lib/lesson-step-names';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { demoWords, verspaetet } from '../../mocks/words';
import {
  FlashcardsScreen,
  type FlashcardsScreenProps,
} from './FlashcardsScreen';
import { flashcardsScreenMeta } from './FlashcardsScreen.meta';

function FlashcardsDemo({
  isFlipped,
  onFlip,
  ...props
}: FlashcardsScreenProps) {
  const [flipped, setFlipped] = useState(isFlipped);

  return (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <FlashcardsScreen
            {...props}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
            nativeLanguage={appLanguage}
            isFlipped={flipped}
            onFlip={() => {
              setFlipped(!flipped);
              onFlip();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Screens/Flashcards',
  component: FlashcardsScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(flashcardsScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.flashcards,
    word: demoWords[0]!,
    cardNumber: 2,
    cardTotal: demoWords.length,
    isFirstCard: false,
    isFlipped: false,
    nativeLanguage: 'en',
    onFlip: fn(),
    onListen: fn(),
    onCardSelect: fn(),
    onPrevious: fn(),
    isLastCard: false,
    onNext: fn(),
    onNextSection: fn(),
    taskNames: [],
    onTaskSelect: fn(),
    onBack: fn(),
    onClose: fn(),
  },
  render: (args) => <FlashcardsDemo {...args} />,
} satisfies Meta<typeof FlashcardsScreen>;

export default meta;

type Story = StoryObj<typeof FlashcardsScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const { word } = args;
    const front = await canvas.findByTestId('word-card-front');
    const back = canvas.getByTestId('word-card-back');
    const card = canvas.getByRole('button', { name: new RegExp(word.lemma) });

    expect(
      canvas.getByText(t('flashcards.cardCount', { current: 2, total: 4 })),
    ).toBeTruthy();
    expect(within(front).getByText(word.lemma)).toBeTruthy();
    expect(within(front).queryByText(displayedWord(word))).toBeNull();
    const articleBox = within(front).getByText('der').getBoundingClientRect();
    const lemmaBox = within(front)
      .getByText(word.lemma)
      .getBoundingClientRect();
    expect(articleBox.right).toBeLessThanOrEqual(lemmaBox.left);
    expect(Math.abs(articleBox.top - lemmaBox.top)).toBeLessThan(
      lemmaBox.height,
    );
    expect(within(front).getByText(word.forms!)).toBeTruthy();
    expect(
      within(front).getByText(word.translations[nativeLanguage]!),
    ).toBeTruthy();
    expect(back.getAttribute('aria-hidden')).toBe('true');
    expect(card.getBoundingClientRect().height).toBeCloseTo(
      card.getBoundingClientRect().width,
      0,
    );
    const stepper = canvas.getByRole('toolbar', {
      name: t('lesson.stepLabel', {
        step: '01',
        task: t('lesson.tasks.flashcards'),
      }),
    });
    const segments = within(stepper).getAllByRole('button');

    expect(segments).toHaveLength(6);
    expect(segments[0]).toHaveAttribute('aria-current', 'step');
    await userEvent.click(segments[4]!);
    expect(args.onTaskSelect).toHaveBeenCalledWith(5);

    await userEvent.click(card);
    expect(args.onFlip).toHaveBeenCalledTimes(1);
    expect(front.getAttribute('aria-hidden')).toBe('true');
    await waitFor(() => expect(Number(getComputedStyle(back).opacity)).toBe(1));
    expect(within(back).getByText(word.sentence)).toBeTruthy();
    expect(
      within(back).getByText(word.sentenceTranslations[nativeLanguage]!),
    ).toBeTruthy();

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.listen') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('flashcards.previousCard') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('flashcards.nextCard') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.nextSection') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );

    expect(args.onListen).toHaveBeenCalledTimes(1);
    expect(args.onPrevious).toHaveBeenCalledTimes(1);
    expect(args.onNext).toHaveBeenCalledTimes(1);
    expect(args.onNextSection).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const WordWithoutArticle: Story = {
  args: { word: verspaetet, cardNumber: 1, cardTotal: 1, isFirstCard: true },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const front = await canvas.findByTestId('word-card-front');
    const tag = within(front).getByText(t('partOfSpeech.short.adjective'));

    expect(getComputedStyle(tag.parentElement!).borderTopStyle).toBe('dashed');
    expect(within(front).getByText('verspätet')).toBeTruthy();
    expect(
      within(front).getByText(args.word.translations[nativeLanguage]!),
    ).toBeTruthy();
    expect(within(front).queryByText(/die |der |das /)).toBeNull();
    expect(
      canvas.getByText(t('flashcards.cardCount', { current: 1, total: 1 })),
    ).toBeTruthy();
  },
};

export const FirstCard: Story = {
  args: { cardNumber: 1, isFirstCard: true },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const previous = await canvas.findByRole('button', {
      name: t('flashcards.previousCard'),
    });

    expect(previous.getAttribute('aria-disabled')).toBe('true');
    expect(getComputedStyle(previous).pointerEvents).toBe('none');
    expect(args.onPrevious).not.toHaveBeenCalled();
    expect(
      canvas.getByRole('button', { name: t('flashcards.nextCard') }),
    ).toBeTruthy();
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};

export const LastCard: Story = {
  args: { cardNumber: 4, cardTotal: 4, isLastCard: true },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const next = await canvas.findByRole('button', {
      name: t('flashcards.nextCard'),
    });

    expect(next.getAttribute('aria-disabled')).toBe('true');
    expect(args.onNext).not.toHaveBeenCalled();
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.nextSection') }),
    );
    expect(args.onNextSection).toHaveBeenCalledTimes(1);
  },
};
