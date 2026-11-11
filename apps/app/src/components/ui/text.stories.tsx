import type { AppLanguage } from '@daily-chunk/i18n';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { typeSpecimens } from '../../mocks/type-specimens';
import { textVariants, type TextVariant } from '../tokens';
import { Text } from './text';

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

const meta = {
  title: 'Primitives/Text',
  component: Text,
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

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

function toRem(lengthInPixels: string) {
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return parseFloat(lengthInPixels) / rootFontSize;
}

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

export const AllVariantsEnglish: Story = {
  render: () => <AllVariants appLanguage="en" />,
  play: async ({ canvasElement }) => {
    await expectVariantStyles(canvasElement, 'en');
  },
};

export const AllVariantsRussian: Story = {
  render: () => <AllVariants appLanguage="ru" />,
  play: async ({ canvasElement }) => {
    await expectVariantStyles(canvasElement, 'ru');
  },
};
