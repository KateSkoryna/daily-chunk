import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { displayedWord } from '../../lib/displayed-word';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
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
        {(_t, appLanguage) => (
          <FlashcardsScreen
            {...props}
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
    cards: demoWords,
    cardIndex: 0,
    isFlipped: false,
    nativeLanguage: 'en',
    onFlip: fn(),
    onListen: fn(),
    onAgain: fn(),
    onKnewIt: fn(),
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
    const word = args.cards[0]!;
    const front = await canvas.findByTestId('word-card-front');
    const back = canvas.getByTestId('word-card-back');
    const card = canvas.getByRole('button', { name: new RegExp(word.lemma) });

    expect(
      canvas.getByText(t('flashcards.cardCount', { current: 1, total: 4 })),
    ).toBeTruthy();
    expect(within(front).getByText(displayedWord(word))).toBeTruthy();
    expect(within(front).getByText(word.forms!)).toBeTruthy();
    expect(
      within(front).getByText(word.translations[nativeLanguage]!),
    ).toBeTruthy();
    expect(back.getAttribute('aria-hidden')).toBe('true');
    expect(toRem(card.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      22.5,
    );
    expect(
      canvas.getByRole('progressbar', {
        name: t('lesson.stepLabel', {
          step: '01',
          task: t('lesson.tasks.flashcards'),
        }),
      }),
    ).toBeTruthy();

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
      canvas.getByRole('button', { name: t('flashcards.again') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('flashcards.knewIt') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );

    expect(args.onListen).toHaveBeenCalledTimes(1);
    expect(args.onAgain).toHaveBeenCalledTimes(1);
    expect(args.onKnewIt).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const WordWithoutArticle: Story = {
  args: { cards: [verspaetet], cardIndex: 0 },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const front = await canvas.findByTestId('word-card-front');
    const tag = within(front).getByText(t('partOfSpeech.short.adjective'));

    expect(getComputedStyle(tag.parentElement!).borderTopStyle).toBe('dashed');
    expect(within(front).getByText('verspätet')).toBeTruthy();
    expect(
      within(front).getByText(args.cards[0]!.translations[nativeLanguage]!),
    ).toBeTruthy();
    expect(within(front).queryByText(/die |der |das /)).toBeNull();
    expect(
      canvas.getByText(t('flashcards.cardCount', { current: 1, total: 1 })),
    ).toBeTruthy();
  },
};
