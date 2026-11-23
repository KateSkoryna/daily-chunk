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

function ReadDemo({ activeWord, onWordPress, ...props }: ReadScreenProps) {
  const [openWord, setOpenWord] = useState(activeWord);

  return (
    <View className="min-h-screen">
      <WithText>
        {(t, appLanguage) => (
          <ReadScreen
            {...props}
            taskNames={lessonStepNames(t, appLanguage, 'de')}
            paragraphs={derLetzteZug.paragraphs.map((paragraph) => ({
              text: paragraph.text,
              highlightedWords: paragraph.highlightedWords,
              translation: paragraph.translations[appLanguage],
            }))}
            nativeLanguage={appLanguage}
            activeWord={openWord}
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
    lessonNumber: lessonThirteen.number,
    xp: stepXpDemo.read,
    title: derLetzteZug.title,
    paragraphs: [],
    words: demoWords,
    nativeLanguage: 'en',
    activeWord: { word: fahrkarte.lemma, paragraphIndex: 1 },
    taskNames: [],
    onTaskSelect: fn(),
    onWordPress: fn(),
    onPlayWord: fn(),
    onBack: fn(),
    onClose: fn(),
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
    const firstTranslation =
      derLetzteZug.paragraphs[0]!.translations[nativeLanguage];

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
    expect(canvas.getByText(firstTranslation)).toBeTruthy();
    expect(card.parentElement!.previousElementSibling?.textContent).toContain(
      'Fahrkarte',
    );
    expect(card.parentElement!.nextElementSibling?.textContent).toBe(
      derLetzteZug.paragraphs[1]!.translations[nativeLanguage],
    );
    expect(canvas.queryByRole('switch')).toBeNull();

    await userEvent.click(segments[4]!);
    expect(args.onTaskSelect).toHaveBeenCalledWith(5);

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
    await userEvent.click(
      canvas.getByRole('button', { name: t('lesson.quit') }),
    );

    expect(args.onPlayWord).toHaveBeenCalledTimes(1);
    expect(args.onContinue).toHaveBeenCalledTimes(1);
    expect(args.onBack).toHaveBeenCalledTimes(1);
    expect(args.onClose).toHaveBeenCalledTimes(1);
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
