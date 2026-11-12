import {
  genderRoles,
  getTargetLanguagePack,
  supportedTargetLanguages,
} from '@daily-chunk/languages';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textVariants } from '../tokens';
import { Noun } from './Noun';
import { nounMeta } from './Noun.meta';

const meta = {
  title: 'Components/Noun',
  component: Noun,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(nounMeta) } },
  },
  args: {
    gender: 'masc',
    targetLanguage: 'de',
    variant: 'word-xl',
    children: 'Bahnhof',
  },
  argTypes: {
    gender: {
      control: 'select',
      options: genderRoles,
      description:
        'The gender role. The language pack turns it into the article.',
    },
    targetLanguage: {
      control: 'select',
      options: supportedTargetLanguages,
      description: 'The language being learned.',
    },
    variant: {
      control: 'select',
      options: textVariants,
      description: 'The text style of the whole word.',
    },
    children: {
      control: 'text',
      description: 'The noun, without its article.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <Noun {...args} />
    </View>
  ),
} satisfies Meta<typeof Noun>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  parameters: {
    controls: { include: ['gender', 'variant', 'children'] },
  },
  play: async ({ canvasElement, args }) => {
    const { articles } = getTargetLanguagePack(args.targetLanguage);
    const article = articles[args.gender];
    const articleElement = await within(canvasElement).findByText(article);
    const word = articleElement.parentElement!;

    expect(word.textContent).toBe(`${article} ${args.children}`);
    expect(getComputedStyle(articleElement).color).not.toBe(
      getComputedStyle(word).color,
    );
  },
};
