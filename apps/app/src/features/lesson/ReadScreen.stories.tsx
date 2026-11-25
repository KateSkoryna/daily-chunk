import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { displayedWord } from '../../lib/displayed-word';
import { lessonStepNames } from '../../lib/lesson-step-names';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { lessonThirteen, stepXpDemo } from '../../mocks/lesson';
import { derLetzteZug } from '../../mocks/lesson-tasks';
import { demoWords, fahrkarte } from '../../mocks/words';
import { ReadScreen, type ReadScreenProps } from './ReadScreen';
import { readScreenMeta } from './ReadScreen.meta';

function ReadDemo({
  activeWord,
  isTranslationShown,
  onWordPress,
  onTranslationToggle,
  ...props
}: ReadScreenProps) {
  const [openWord, setOpenWord] = useState(activeWord);
  const [isShown, setIsShown] = useState(isTranslationShown);

  return (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <ReadScreen
            {...props}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
            text={derLetzteZug.text}
            highlightedWords={derLetzteZug.highlightedWords}
            translation={derLetzteZug.translations[appLanguage]}
            isTranslationShown={isShown}
            nativeLanguage={appLanguage}
            activeWord={openWord}
            onWordPress={(word) => {
              setOpenWord(word === openWord ? null : word);
              onWordPress(word);
            }}
            onTranslationToggle={() => {
              setIsShown((isOn) => !isOn);
              onTranslationToggle();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Screens/Read',
  component: ReadScreen,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: { description: { component: metaToMarkdown(readScreenMeta) } },
    controls: { disable: true },
  },
  args: {
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.read,
    text: derLetzteZug.text,
    highlightedWords: derLetzteZug.highlightedWords,
    translation: derLetzteZug.translations.en,
    isTranslationShown: false,
    words: demoWords,
    nativeLanguage: 'en',
    activeWord: fahrkarte.lemma,
    taskNames: [],
    onTaskSelect: fn(),
    onWordPress: fn(),
    onTranslationToggle: fn(),
    isListening: false,
    onPlayText: fn(),
    onPlayWord: fn(),
    onBack: fn(),
    onClose: fn(),
    onStartQuiz: fn(),
  },
  render: (args) => <ReadDemo {...args} />,
} satisfies Meta<typeof ReadScreen>;

export default meta;

type Story = StoryObj<typeof ReadScreen>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const card = await canvas.findByRole('group', {
      name: t('wordPopover.label', { word: displayedWord(fahrkarte) }),
    });
    const translation = derLetzteZug.translations[nativeLanguage];

    const stepper = canvas.getByRole('toolbar', {
      name: t('lesson.stepLabel', {
        step: '03',
        task: t('lesson.tasks.read'),
      }),
    });
    const segments = within(stepper).getAllByRole('button');

    expect(segments).toHaveLength(6);
    expect(segments[2]).toHaveAttribute('aria-current', 'step');
    expect(canvas.getByText(t('read.hint'))).toBeTruthy();
    expect(canvas.queryByText(translation)).toBeNull();
    expect(
      canvas
        .getByRole('button', { name: 'Fahrkarte' })
        .compareDocumentPosition(card) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(canvas.queryByRole('switch')).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: t('read.translation') }),
    );
    expect(args.onTranslationToggle).toHaveBeenCalledTimes(1);
    const shownTranslation = await canvas.findByText(translation);
    expect(getComputedStyle(shownTranslation).fontSize).toBe(
      getComputedStyle(
        canvas.getByRole('button', { name: 'Bahnhof' }).parentElement!,
      ).fontSize,
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('read.translation') }),
    );
    expect(canvas.queryByText(translation)).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.listen') }),
    );
    expect(args.onPlayText).toHaveBeenCalledTimes(1);

    await userEvent.click(segments[4]!);
    expect(args.onTaskSelect).toHaveBeenCalledWith(5);

    await userEvent.click(canvas.getByRole('button', { name: 'Bahnhof' }));
    expect(args.onWordPress).toHaveBeenCalledWith('Bahnhof');
    expect(
      await canvas.findByRole('group', {
        name: t('wordPopover.label', { word: 'der Bahnhof' }),
      }),
    ).toBeTruthy();
    const stationCard = await canvas.findByRole('group', {
      name: t('wordPopover.label', { word: 'der Bahnhof' }),
    });
    const stationBox = canvas
      .getByRole('button', { name: 'Bahnhof' })
      .getBoundingClientRect();
    const stationCardBox = stationCard.getBoundingClientRect();

    const cardCenter = document.elementFromPoint(
      stationCardBox.left + stationCardBox.width / 2,
      stationCardBox.top + stationCardBox.height / 2,
    );

    expect(stationCard.contains(cardCenter)).toBe(true);
    expect(stationCardBox.top - stationBox.bottom).toBeGreaterThanOrEqual(0);
    expect(stationCardBox.top - stationBox.bottom).toBeLessThan(
      stationBox.height,
    );
    expect(canvas.queryByRole('group', { name: /Fahrkarte/ })).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', {
        name: t('wordPopover.play', { word: 'der Bahnhof' }),
      }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('read.startQuiz') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );

    expect(args.onPlayWord).toHaveBeenCalledTimes(1);
    expect(args.onStartQuiz).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
  },
};

export const TranslationShown: Story = {
  args: { activeWord: null, isTranslationShown: true },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);

    expect(
      await canvas.findByText(derLetzteZug.translations[nativeLanguage]),
    ).toBeTruthy();
    expect(
      canvas
        .getByRole('button', { name: t('read.translation') })
        .getAttribute('aria-expanded'),
    ).toBe('true');
  },
};

export const NoWordOpen: Story = {
  args: { activeWord: null },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const words = await canvas.findAllByRole('button', {
      name: /^(Bahnhof|verspätet|Fahrkarte|Gleis)$/,
    });

    expect(words).toHaveLength(4);
    expect(canvas.queryByRole('group')).toBeNull();
  },
};

export const NarrowScreen: Story = {
  args: { activeWord: null },
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const listen = await canvas.findByRole('button', {
      name: t('common.listen'),
    });
    const translation = canvas.getByRole('button', {
      name: t('read.translation'),
    });

    expect(translation.getBoundingClientRect().top).toBe(
      listen.getBoundingClientRect().top,
    );
    expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth,
    );
  },
};
