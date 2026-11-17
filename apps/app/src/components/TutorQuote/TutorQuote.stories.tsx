import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { TutorQuote, type TutorQuoteVariant } from './TutorQuote';
import { tutorQuoteMeta } from './TutorQuote.meta';

const variants = ['start', 'pass', 'fail'] as const;

const meta = {
  title: 'Components/TutorQuote',
  component: TutorQuote,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(tutorQuoteMeta) } },
  },
  args: {
    variant: 'start',
    tabLabel: 'Chunk says',
    children: 'Six tasks. Try to look surprised when they are easy.',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
      description: 'start is yellow, pass is green with ✓, fail is red with ✗.',
    },
    tabLabel: {
      control: 'text',
      description: 'The text on the tab, already translated.',
    },
    children: {
      control: 'text',
      description: 'The tutor’s line, at most 2 short sentences.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <TutorQuote {...args} />
    </View>
  ),
} satisfies Meta<typeof TutorQuote>;

export default meta;

type Story = StoryObj<typeof meta>;

function expectedIconCount(variant: TutorQuoteVariant) {
  return variant === 'start' ? 0 : 1;
}

async function inspectQuote(
  canvasElement: HTMLElement,
  tabLabel: string,
  variant: TutorQuoteVariant,
) {
  const tab = (await within(canvasElement).findByText(tabLabel))
    .parentElement as HTMLElement;
  const box = tab.parentElement as HTMLElement;
  const boxStyle = getComputedStyle(box);
  const boxRect = box.getBoundingClientRect();
  const tabRect = tab.getBoundingClientRect();

  expect(toRem(boxStyle.borderTopWidth)).toBe(0.125);
  expect(boxStyle.borderTopColor).toBe(getComputedStyle(tab).backgroundColor);
  expect(toRem(tabRect.left - boxRect.left)).toBe(0.875);
  expect(tabRect.top).toBeLessThan(boxRect.top);
  expect(tabRect.bottom).toBeGreaterThan(boxRect.top);
  expect(tab.querySelectorAll('svg')).toHaveLength(expectedIconCount(variant));

  return { box, tab };
}

export const Default: Story = {
  parameters: { controls: { include: ['variant', 'tabLabel', 'children'] } },
  play: async ({ canvasElement, args }) => {
    const { box } = await inspectQuote(
      canvasElement,
      args.tabLabel,
      args.variant ?? 'start',
    );
    const style = getComputedStyle(box);

    expect(toRem(style.paddingTop)).toBe(1.5);
    expect(toRem(style.paddingLeft)).toBe(0.875);
    expect(toRem(style.paddingBottom)).toBe(0.875);
    expect(
      await within(canvasElement).findByText(String(args.children)),
    ).toBeTruthy();
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="gap-6 p-gutter">
      <TutorQuote variant="start" tabLabel="Chunk says">
        Six tasks. Try to look surprised.
      </TutorQuote>
      <TutorQuote variant="pass" tabLabel="Chunk approves">
        Correct. Chunk pretends he is not impressed.
      </TutorQuote>
      <TutorQuote variant="fail" tabLabel="Chunk sighs">
        Wrong, but the right answer is right there.
      </TutorQuote>
    </View>
  ),
  play: async ({ canvasElement }) => {
    const tabs = [
      await inspectQuote(canvasElement, 'Chunk says', 'start'),
      await inspectQuote(canvasElement, 'Chunk approves', 'pass'),
      await inspectQuote(canvasElement, 'Chunk sighs', 'fail'),
    ];
    const colours = new Set(
      tabs.map(({ tab }) => getComputedStyle(tab).backgroundColor),
    );

    const heights = new Set(
      tabs.map(({ tab }) => toRem(tab.getBoundingClientRect().height)),
    );

    expect(colours.size).toBe(3);
    expect(heights.size).toBe(1);
  },
};
