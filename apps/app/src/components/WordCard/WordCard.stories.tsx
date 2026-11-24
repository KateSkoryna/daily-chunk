import { useAppLanguage } from '@daily-chunk/i18n';
import { getTargetLanguagePack } from '@daily-chunk/languages';
import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { AccessibilityInfo, View } from 'react-native';
import { expect, fn, spyOn, userEvent, waitFor, within } from 'storybook/test';

import { isDesktopViewport, toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import { bahnhofCard } from '../../mocks/word-cards';
import { Noun } from '../Noun/Noun';
import { TipButton } from '../TipButton/TipButton';
import { TipCard } from '../TipCard/TipCard';
import { Text } from '../ui/text';
import { flipDurationInMs } from './flip-duration';
import { WordCard, type WordCardProps } from './WordCard';
import { wordCardMeta } from './WordCard.meta';

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

function WordCardDemo({ isFlipped, onFlip, corner, overlay }: WordCardProps) {
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
        corner={corner}
        overlay={overlay}
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

    expect(card.getBoundingClientRect().height).toBeCloseTo(
      card.getBoundingClientRect().width,
      0,
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

export const WithCorner: Story = {
  args: {
    corner: <TipButton word="Bahnhof" isOpen={false} onToggle={fn()} />,
  },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const card = await canvas.findByTestId('word-card-front');
    const surface = card.closest('button')!;
    const lamp = await canvas.findByRole('button', {
      name: t('tip.button', { word: 'Bahnhof' }),
    });
    const corner = lamp.getBoundingClientRect();
    const bounds = surface.getBoundingClientRect();

    expect(corner.right).toBeLessThanOrEqual(bounds.right);
    expect(corner.top).toBeGreaterThanOrEqual(bounds.top);
    expect(surface.contains(lamp)).toBe(false);

    await userEvent.click(lamp);
    expect(args.onFlip).not.toHaveBeenCalled();
    expect(card.getAttribute('aria-hidden')).not.toBe('true');
  },
};

async function expectPopoverPlacement(
  canvasElement: HTMLElement,
  globals: Parameters<typeof textFor>[0],
) {
  const t = textFor(globals);
  const canvas = within(canvasElement);
  const surface = (await canvas.findByTestId('word-card-front')).closest(
    'button',
  )!;
  const lamp = await canvas.findByRole('button', {
    name: t('tip.button', { word: 'Bahnhof' }),
  });
  const popover = await canvas.findByRole('group', { name: t('tip.card') });
  const card = surface.getBoundingClientRect();
  const popoverBox = popover.getBoundingClientRect();

  if (isDesktopViewport()) {
    expect(popoverBox.left).toBeGreaterThanOrEqual(card.right);
    expect(popoverBox.top).toBeGreaterThanOrEqual(card.top);
    expect(popoverBox.right).toBeLessThanOrEqual(window.innerWidth);
  } else {
    expect(popoverBox.top).toBeGreaterThanOrEqual(
      lamp.getBoundingClientRect().bottom,
    );
    expect(popoverBox.left).toBeGreaterThanOrEqual(card.left);
    expect(popoverBox.right).toBeLessThanOrEqual(card.right);
    expect(popoverBox.bottom).toBeLessThanOrEqual(card.bottom);
  }
  expect(
    canvas.getByTestId('word-card-front').getBoundingClientRect().height,
  ).toBe(card.height);
}

function InFlashcardColumn(props: WordCardProps) {
  return (
    <View className="items-center">
      <View className="w-full max-w-flashcard-desktop">
        <WordCardDemo {...props} />
      </View>
    </View>
  );
}

const overlayArgs = {
  corner: <TipButton word="Bahnhof" isOpen onToggle={fn()} />,
  overlay: <TipCard tip="No article before a number." />,
};

export const WithOverlay: Story = {
  args: overlayArgs,
  render: (args) => <InFlashcardColumn {...args} />,
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    await expectPopoverPlacement(canvasElement, globals);
  },
};

export const WithOverlayOnPhone: Story = {
  args: overlayArgs,
  render: (args) => <InFlashcardColumn {...args} />,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    expect(isDesktopViewport()).toBe(false);
    await expectPopoverPlacement(canvasElement, globals);
  },
};
