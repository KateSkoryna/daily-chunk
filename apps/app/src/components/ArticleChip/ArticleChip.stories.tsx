import {
  genderRoles,
  getTargetLanguagePack,
  supportedTargetLanguages,
  type GenderRole,
  type TargetLanguage,
} from '@daily-chunk/languages';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { ArticleChip } from './ArticleChip';
import { articleChipMeta } from './ArticleChip.meta';

const meta = {
  title: 'Components/ArticleChip',
  component: ArticleChip,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(articleChipMeta) } },
  },
  args: { gender: 'masc', targetLanguage: 'de' },
  argTypes: {
    gender: {
      control: 'select',
      options: genderRoles,
      description:
        'The gender role. The language pack turns it into the article word.',
    },
    targetLanguage: {
      control: 'select',
      options: supportedTargetLanguages,
      description: 'The language being learned.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <ArticleChip {...args} />
    </View>
  ),
} satisfies Meta<typeof ArticleChip>;

export default meta;

type Story = StoryObj<typeof meta>;

function isTransparent(colour: string) {
  return colour === 'transparent' || /,\s*0\)$/.test(colour);
}

function labelOf(gender: GenderRole, targetLanguage: TargetLanguage) {
  const pack = getTargetLanguagePack(targetLanguage);
  return gender === 'plural' ? pack.pluralTagLabel : pack.articles[gender];
}

export const Default: Story = {
  parameters: { controls: { include: ['gender', 'targetLanguage'] } },
  play: async ({ canvasElement, args }) => {
    const label = await within(canvasElement).findByText(
      labelOf(args.gender, args.targetLanguage),
    );
    const chip = label.parentElement as HTMLElement;
    const style = getComputedStyle(chip);

    expect(toRem(chip.getBoundingClientRect().height)).toBe(2);
    expect(toRem(style.paddingLeft)).toBe(0.625);
    if (args.gender === 'plural') {
      expect(style.borderTopStyle).toBe('dashed');
      expect(toRem(style.borderTopWidth)).toBe(0.125);
      expect(isTransparent(style.backgroundColor)).toBe(true);
    } else {
      expect(toRem(style.borderTopWidth)).toBe(0);
      expect(isTransparent(style.backgroundColor)).toBe(false);
    }
  },
};

export const AllGenders: Story = {
  parameters: { controls: { disable: true } },
  render: ({ targetLanguage }) => (
    <View className="gap-2 p-gutter">
      {genderRoles.map((gender) => (
        <ArticleChip
          key={gender}
          gender={gender}
          targetLanguage={targetLanguage}
        />
      ))}
    </View>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const fills = new Set<string>();

    for (const gender of genderRoles) {
      const label = await canvas.findByText(
        labelOf(gender, args.targetLanguage),
      );
      const chip = label.parentElement as HTMLElement;

      expect(toRem(chip.getBoundingClientRect().height)).toBe(2);
      if (gender !== 'plural') {
        fills.add(getComputedStyle(chip).backgroundColor);
      }
    }

    expect(fills.size).toBe(3);
  },
};
