import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { displayedWord } from '../../lib/displayed-word';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { appLanguageOf, textFor, WithText } from '../../lib/story-text';
import { fahrkarte, verspaetet } from '../../mocks/words';
import { WordPopover } from './WordPopover';
import { wordPopoverMeta } from './WordPopover.meta';

const meta = {
  title: 'Components/WordPopover',
  component: WordPopover,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(wordPopoverMeta) } },
    controls: { disable: true },
  },
  args: { word: fahrkarte, nativeLanguage: 'en', onPlay: fn() },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(_t, appLanguage) => (
          <WordPopover {...args} nativeLanguage={appLanguage} />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof WordPopover>;

export default meta;

type Story = StoryObj<typeof WordPopover>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const name = displayedWord(args.word);
    const card = await canvas.findByRole('group', {
      name: t('wordPopover.label', { word: name }),
    });
    const play = within(card).getByRole('button', {
      name: t('wordPopover.play', { word: name }),
    });
    const tag = within(card).getByText('die');

    expect(
      within(card).getByText(
        `${args.word.translations[nativeLanguage]} · ${t('confirm.pluralForms', { forms: args.word.forms })}`,
      ),
    ).toBeTruthy();
    expect(getComputedStyle(card).borderTopColor).toBe(
      getComputedStyle(tag.parentElement!).backgroundColor,
    );
    expect(toRem(getComputedStyle(card).borderTopWidth)).toBe(0.125);
    expect(toRem(play.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
      3,
    );
    expect(getComputedStyle(card.previousElementSibling!).position).toBe(
      'absolute',
    );

    await userEvent.click(play);
    expect(args.onPlay).toHaveBeenCalledTimes(1);
  },
};

export const WordWithoutArticle: Story = {
  args: { word: verspaetet },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const nativeLanguage = appLanguageOf(globals);
    const canvas = within(canvasElement);
    const card = await canvas.findByRole('group', {
      name: t('wordPopover.label', { word: 'verspätet' }),
    });

    expect(
      within(card).getByText(t('partOfSpeech.short.adjective')),
    ).toBeTruthy();
    expect(
      within(card).getByText(args.word.translations[nativeLanguage]!),
    ).toBeTruthy();
    expect(within(card).queryByText(/Pl\.|мн\./)).toBeNull();
  },
};
