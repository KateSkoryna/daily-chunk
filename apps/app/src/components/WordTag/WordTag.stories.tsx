import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import { bahnhof, fahrkarte, verspaetet } from '../../mocks/words';
import { WordTag } from './WordTag';
import { wordTagMeta } from './WordTag.meta';

const meta = {
  title: 'Components/WordTag',
  component: WordTag,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(wordTagMeta) } },
    controls: { disable: true },
  },
  args: { word: bahnhof },
  render: (args) => (
    <View className="flex-row gap-3 p-gutter">
      <WordTag {...args} />
      <WordTag word={fahrkarte} />
      <WordTag word={verspaetet} />
    </View>
  ),
} satisfies Meta<typeof WordTag>;

export default meta;

type Story = StoryObj<typeof WordTag>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(await canvas.findByText('der')).toBeTruthy();
    expect(canvas.getByText('die')).toBeTruthy();
    expect(canvas.getByText(t('partOfSpeech.short.adjective'))).toBeTruthy();
    expect(canvas.queryByText('das')).toBeNull();
  },
};
