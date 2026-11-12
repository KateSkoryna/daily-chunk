import { appLanguages, type AppLanguage } from '@daily-chunk/i18n';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import type { ComponentProps } from 'react';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { typeSpecimens } from '../../mocks/type-specimens';
import { textVariants, type TextVariant } from '../tokens';
import { Text } from './text';
import { textMeta } from './text.meta';

function AllVariants({ appLanguage }: { appLanguage: AppLanguage }) {
  return (
    <View className="gap-3 p-gutter">
      {textVariants.map((variant) => (
        <View key={variant}>
          <Text variant="caption">{variant}</Text>
          <Text variant={variant}>{typeSpecimens[appLanguage][variant]}</Text>
        </View>
      ))}
    </View>
  );
}

type TextStoryArgs = ComponentProps<typeof Text> & {
  appLanguage: AppLanguage;
};

const meta = {
  title: 'Primitives/Text',
  component: Text,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(textMeta) } },
    controls: { include: ['appLanguage', 'variant', 'children'] },
  },
  args: { appLanguage: 'en', variant: 'body' },
  argTypes: {
    appLanguage: {
      control: 'inline-radio',
      options: appLanguages,
      description:
        'The language of the sample text. Text itself does not read the app language.',
    },
    variant: {
      control: 'select',
      options: textVariants,
      description:
        'The type-scale style: sets font, size, line height and default colour.',
    },
    children: {
      control: 'text',
      description:
        'The text to show. Leave empty to use the sample text for the variant and language.',
    },
  },
} satisfies Meta<TextStoryArgs>;

export default meta;

type Story = StoryObj<TextStoryArgs>;

const fontFamilyNames = {
  display: 'RussoOne_400Regular',
  pixel: 'Handjet_400Regular',
  content: 'IBMPlexSans_400Regular',
  'content-semibold': 'IBMPlexSans_600SemiBold',
};

const expectedVariantStyles = {
  'display-xl': { family: 'display', sizeInRem: null },
  'display-l': { family: 'display', sizeInRem: null },
  'display-num': { family: 'display', sizeInRem: 1.625 },
  'display-btn': { family: 'display', sizeInRem: 1.25 },
  'display-btn-sm': { family: 'display', sizeInRem: 1 },
  label: { family: 'pixel', sizeInRem: 1.5 },
  'label-sm': { family: 'pixel', sizeInRem: 1.25 },
  ui: { family: 'pixel', sizeInRem: 1.375 },
  caption: { family: 'pixel', sizeInRem: 1.125 },
  'word-xl': { family: 'content-semibold', sizeInRem: 2.25 },
  'word-l': { family: 'content-semibold', sizeInRem: 1.375 },
  option: { family: 'content-semibold', sizeInRem: 1.125 },
  chip: { family: 'content-semibold', sizeInRem: 1 },
  reading: { family: 'content', sizeInRem: 1.25 },
  body: { family: 'content', sizeInRem: 1.0625 },
  'body-sm': { family: 'content', sizeInRem: 0.9375 },
} satisfies Record<
  TextVariant,
  { family: keyof typeof fontFamilyNames; sizeInRem: number | null }
>;

async function expectVariantStyles(
  canvasElement: HTMLElement,
  appLanguage: AppLanguage,
) {
  const canvas = within(canvasElement);
  const colours = new Map<TextVariant, string>();

  for (const variant of textVariants) {
    const element = await canvas.findByText(
      typeSpecimens[appLanguage][variant],
    );
    const style = getComputedStyle(element);
    const expected = expectedVariantStyles[variant];

    expect(style.fontFamily).toContain(fontFamilyNames[expected.family]);
    if (expected.sizeInRem !== null) {
      expect(toRem(style.fontSize)).toBe(expected.sizeInRem);
    }
    colours.set(variant, style.color);
  }

  const labelElement = await canvas.findByText(
    typeSpecimens[appLanguage].label,
  );
  expect(toRem(getComputedStyle(labelElement).letterSpacing)).toBe(0.125);
  const smallLabelElement = await canvas.findByText(
    typeSpecimens[appLanguage]['label-sm'],
  );
  expect(toRem(getComputedStyle(smallLabelElement).letterSpacing)).toBe(0.125);

  expect(colours.get('label')).toBe(colours.get('label-sm'));
  expect(colours.get('caption')).toBe(colours.get('body-sm'));
  expect(colours.get('body')).toBe(colours.get('chip'));
  expect(colours.get('label')).not.toBe(colours.get('body'));
  expect(colours.get('display-num')).not.toBe(colours.get('body'));
  expect(colours.get('caption')).not.toBe(colours.get('body'));
}

function sampleText({ appLanguage, variant, children }: TextStoryArgs) {
  return children ?? typeSpecimens[appLanguage][variant ?? 'body'];
}

export const Default: Story = {
  render: ({ appLanguage, ...args }) => (
    <View className="p-gutter">
      <Text {...args}>{sampleText({ appLanguage, ...args })}</Text>
    </View>
  ),
  play: async ({ canvasElement, args }) => {
    const element = await within(canvasElement).findByText(
      String(sampleText(args)),
    );
    const style = getComputedStyle(element);
    const expected = expectedVariantStyles[args.variant ?? 'body'];

    expect(style.fontFamily).toContain(fontFamilyNames[expected.family]);
    if (expected.sizeInRem !== null) {
      expect(toRem(style.fontSize)).toBe(expected.sizeInRem);
    }
  },
};

export const Gallery: Story = {
  parameters: { controls: { include: ['appLanguage'] } },
  render: ({ appLanguage }) => <AllVariants appLanguage={appLanguage} />,
  play: async ({ canvasElement, args }) => {
    await expectVariantStyles(canvasElement, args.appLanguage);
  },
};
