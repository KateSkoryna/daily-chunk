import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { ArticleChip } from '../ArticleChip/ArticleChip';
import { PartOfSpeechChip } from './PartOfSpeechChip';
import { partOfSpeechChipMeta } from './PartOfSpeechChip.meta';

const meta = {
  title: 'Components/PartOfSpeechChip',
  component: PartOfSpeechChip,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(partOfSpeechChipMeta) } },
    controls: { disable: true },
  },
  args: { label: '' },
  render: () => (
    <View className="flex-row gap-3 p-gutter">
      <WithText>
        {(t) => (
          <>
            <ArticleChip gender="masc" targetLanguage="de" />
            <PartOfSpeechChip label={t('partOfSpeech.short.adjective')} />
          </>
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof PartOfSpeechChip>;

export default meta;

type Story = StoryObj<typeof PartOfSpeechChip>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const label = await canvas.findByText(t('partOfSpeech.short.adjective'));
    const chip = label.parentElement as HTMLElement;
    const article = (await canvas.findByText('der'))
      .parentElement as HTMLElement;
    const style = getComputedStyle(chip);

    expect(style.borderTopStyle).toBe('dashed');
    expect(toRem(style.borderTopWidth)).toBe(0.125);
    expect(toRem(chip.getBoundingClientRect().height)).toBe(2);
    expect(chip.getBoundingClientRect().height).toBe(
      article.getBoundingClientRect().height,
    );
    expect(getComputedStyle(label).color).toBe(style.borderTopColor);
  },
};
