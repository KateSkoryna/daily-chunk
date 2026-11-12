import { useAppLanguage } from '@daily-chunk/i18n';
import { getTargetLanguagePack } from '@daily-chunk/languages';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { bahnhofCard } from '../../mocks/word-cards';
import { Noun } from '../Noun/Noun';
import { Text } from '../ui/text';
import { flipDurationInMs } from './flip-duration';
import { WordCard, type WordCardProps } from './WordCard';
import { wordCardMeta } from './WordCard.meta';

const desktopMinWidthInRem = 64;
const mobileHeightInRem = 22.5;
const desktopHeightInRem = 26.25;

function BahnhofFront() {
  const { appLanguage } = useAppLanguage();
  const { pluralCaption } = getTargetLanguagePack('de');

  return (
    <View className="flex-1 justify-center gap-2">
      <Noun gender={bahnhofCard.gender} targetLanguage="de">
        {bahnhofCard.noun}
      </Noun>
      <View className="flex-row items-baseline gap-2">
        <Noun gender="plural" targetLanguage="de" variant="word-l">
          {bahnhofCard.pluralNoun}
        </Noun>
        <Text variant="body-sm">{pluralCaption}</Text>
      </View>
      <Text variant="body" className="text-muted-foreground">
        {bahnhofCard.translations[appLanguage]}
      </Text>
    </View>
  );
}

function BahnhofBack() {
  const { appLanguage } = useAppLanguage();

  return (
    <View className="flex-1 justify-center gap-2">
      <Text variant="word-l">{bahnhofCard.example.target}</Text>
      <Text variant="reading" className="text-muted-foreground">
        {bahnhofCard.example.translations[appLanguage]}
      </Text>
    </View>
  );
}

function WordCardDemo({ isFlipped, onFlip }: WordCardProps) {
  const [isCardFlipped, setIsCardFlipped] = useState(isFlipped);

  return (
    <View className="p-gutter">
      <WordCard
        isFlipped={isCardFlipped}
        onFlip={() => {
          setIsCardFlipped(!isCardFlipped);
          onFlip();
        }}
        front={<BahnhofFront />}
        back={<BahnhofBack />}
      />
    </View>
  );
}

const meta = {
  title: 'Components/WordCard',
  component: WordCard,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(wordCardMeta) } },
    controls: { include: ['isFlipped'] },
  },
  args: {
    isFlipped: false,
    onFlip: fn(),
    front: null,
    back: null,
  },
  argTypes: {
    isFlipped: {
      control: 'boolean',
      description: 'Whether the back is shown. The screen owns this state.',
    },
  },
  render: (args) => <WordCardDemo key={String(args.isFlipped)} {...args} />,
} satisfies Meta<typeof WordCard>;

export default meta;

type Story = StoryObj<typeof meta>;

async function sampleWidths(card: HTMLElement, durationInMs: number) {
  const widths = new Set<number>();
  const endsAt = performance.now() + durationInMs;

  while (performance.now() < endsAt) {
    widths.add(Math.round(card.getBoundingClientRect().width));
    await new Promise((resolve) => requestAnimationFrame(resolve));
  }
  return widths;
}

function opacityOf(face: HTMLElement) {
  return Number(getComputedStyle(face).opacity);
}

async function flipAndSample(canvasElement: HTMLElement, args: WordCardProps) {
  const canvas = within(canvasElement);
  const card = await canvas.findByRole('button');
  const restingWidth = Math.round(card.getBoundingClientRect().width);

  await userEvent.click(card);
  expect(args.onFlip).toHaveBeenCalledTimes(1);
  const widths = await sampleWidths(card, flipDurationInMs + 150);

  return {
    canvas,
    widths,
    restingWidth,
    front: await canvas.findByTestId('word-card-front'),
    back: await canvas.findByTestId('word-card-back'),
  };
}

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const visibleText = args.isFlipped
      ? bahnhofCard.example.target
      : bahnhofCard.noun;
    const card = await canvas.findByRole('button', {
      name: new RegExp(visibleText),
    });
    const front = await canvas.findByTestId('word-card-front');
    const back = await canvas.findByTestId('word-card-back');
    const visibleFace = args.isFlipped ? back : front;
    const hiddenFace = args.isFlipped ? front : back;
    const faceStyle = getComputedStyle(visibleFace.firstElementChild!);
    const isDesktop = toRem(window.innerWidth) >= desktopMinWidthInRem;

    expect(toRem(card.getBoundingClientRect().height)).toBe(
      isDesktop ? desktopHeightInRem : mobileHeightInRem,
    );
    expect(toRem(faceStyle.borderTopWidth)).toBe(0.125);
    expect(toRem(faceStyle.paddingLeft)).toBe(1.5);
    expect(getComputedStyle(card.previousElementSibling!).position).toBe(
      'absolute',
    );
    expect(visibleFace.getAttribute('aria-hidden')).not.toBe('true');
    expect(hiddenFace.getAttribute('aria-hidden')).toBe('true');
    expect(opacityOf(visibleFace)).toBe(1);
    expect(opacityOf(hiddenFace)).toBe(0);

    const { widths, restingWidth } = await flipAndSample(canvasElement, args);

    expect(widths.size).toBeGreaterThan(3);
    expect(Math.min(...widths)).toBeLessThan(restingWidth / 2);
    await waitFor(() => {
      expect(hiddenFace.getAttribute('aria-hidden')).not.toBe('true');
      expect(visibleFace.getAttribute('aria-hidden')).toBe('true');
      expect(opacityOf(hiddenFace)).toBe(1);
      expect(opacityOf(visibleFace)).toBe(0);
    });
    expect(Math.round(card.getBoundingClientRect().width)).toBe(restingWidth);
  },
};

export const ReducedMotion: Story = {
  parameters: { controls: { disable: true } },
  beforeEach: () => {
    const spy = spyOn(AccessibilityInfo, 'isReduceMotionEnabled');
    spy.mockResolvedValue(true);
    return () => spy.mockRestore();
  },
  play: async ({ canvasElement, args }) => {
    const { widths, front, back } = await flipAndSample(canvasElement, args);

    expect(widths.size).toBe(1);
    expect(opacityOf(back)).toBe(1);
    expect(opacityOf(front)).toBe(0);
  },
};
