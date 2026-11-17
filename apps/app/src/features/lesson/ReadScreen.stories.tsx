import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { displayedWord } from '../../lib/displayed-word';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { stepXpDemo } from '../../mocks/lesson';
import { derLetzteZug } from '../../mocks/lesson-tasks';
import { demoWords, fahrkarte } from '../../mocks/words';
import { ReadScreen, type ReadScreenProps } from './ReadScreen';
import { readScreenMeta } from './ReadScreen.meta';

function ReadDemo({
  showTranslation,
  activeWord,
  onToggleTranslation,
  onWordPress,
  ...props
}: ReadScreenProps) {
  const [translationShown, setTranslationShown] = useState(showTranslation);
  const [openWord, setOpenWord] = useState(activeWord);

  return (
    <View className="min-h-screen">
      <WithText>
        {(_t, appLanguage) => (
          <ReadScreen
            {...props}
            nativeLanguage={appLanguage}
            showTranslation={translationShown}
            activeWord={openWord}
            onToggleTranslation={() => {
              setTranslationShown(!translationShown);
              onToggleTranslation();
            }}
            onWordPress={(word) => {
              const isOpen =
                word.word === openWord?.word &&
                word.paragraphIndex === openWord.paragraphIndex;
              setOpenWord(isOpen ? null : word);
              onWordPress(word);
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
    xp: stepXpDemo.read,
    title: derLetzteZug.title,
    paragraphs: derLetzteZug.paragraphs,
    words: demoWords,
    nativeLanguage: 'en',
    showTranslation: false,
    activeWord: { word: fahrkarte.lemma, paragraphIndex: 1 },
    onToggleTranslation: fn(),
    onWordPress: fn(),
    onPlayWord: fn(),
    onBack: fn(),
    onContinue: fn(),
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
    const firstTranslation = args.paragraphs[0]!.translations[nativeLanguage];
    const toggleOff = canvas.getByRole('switch', {
      name: t('read.translationOff', {
        language: nativeLanguage.toUpperCase(),
      }),
    });

    expect(
      canvas
        .getByRole('progressbar', {
          name: t('lesson.stepLabel', {
            step: '03',
            task: t('lesson.tasks.read'),
          }),
        })
        .getAttribute('aria-valuenow'),
    ).toBe('3');
    expect(canvas.getByText(t('read.hint'))).toBeTruthy();
    expect(canvas.queryByText(firstTranslation)).toBeNull();
    expect(card.parentElement!.previousElementSibling?.textContent).toContain(
      'Fahrkarte',
    );

    await userEvent.click(toggleOff);
    expect(args.onToggleTranslation).toHaveBeenCalledTimes(1);
    expect(await canvas.findByText(firstTranslation)).toBeTruthy();
    expect(
      canvas
        .getByRole('switch', {
          name: t('read.translationOn', {
            language: nativeLanguage.toUpperCase(),
          }),
        })
        .getAttribute('aria-checked'),
    ).toBe('true');

    await userEvent.click(canvas.getByRole('button', { name: 'Bahnhof' }));
    expect(args.onWordPress).toHaveBeenCalledWith({
      word: 'Bahnhof',
      paragraphIndex: 0,
    });
    expect(
      await canvas.findByRole('group', {
        name: t('wordPopover.label', { word: 'der Bahnhof' }),
      }),
    ).toBeTruthy();
    expect(canvas.queryByRole('group', { name: /Fahrkarte/ })).toBeNull();

    await userEvent.click(
      canvas.getByRole('button', {
        name: t('wordPopover.play', { word: 'der Bahnhof' }),
      }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('read.readAloud') }),
    );
    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );

    expect(args.onPlayWord).toHaveBeenCalledTimes(1);
    expect(args.onContinue).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
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
