import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { TutorQuote, type TutorQuoteVariant } from './TutorQuote';
import { tutorQuoteMeta } from './TutorQuote.meta';

const variants = ['start', 'pass', 'fail'] as const;

const tabKeys = {
  start: 'tutor.says',
  pass: 'tutor.approves',
  fail: 'tutor.sighs',
} as const;

const lineKeys = {
  start: 'tutor.startLine',
  pass: 'tutor.passLine',
  fail: 'tutor.failLine',
} as const;

const meta = {
  title: 'Components/TutorQuote',
  component: TutorQuote,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(tutorQuoteMeta) } },
  },
  args: { variant: 'start' },
  argTypes: {
    variant: {
      control: 'select',
      options: variants,
      description: 'start is yellow, pass is green with ✓, fail is red with ✗.',
    },
  },
  render: ({ variant = 'start' }) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <TutorQuote variant={variant} tabLabel={t(tabKeys[variant])}>
            {t(lineKeys[variant])}
          </TutorQuote>
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof TutorQuote>;

export default meta;

type Story = StoryObj<typeof TutorQuote>;

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
  parameters: { controls: { include: ['variant'] } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const variant = args.variant ?? 'start';
    const { box } = await inspectQuote(
      canvasElement,
      t(tabKeys[variant]),
      variant,
    );
    const style = getComputedStyle(box);

    expect(toRem(style.paddingTop)).toBe(1.5);
    expect(toRem(style.paddingLeft)).toBe(0.875);
    expect(toRem(style.paddingBottom)).toBe(0.875);
    expect(
      await within(canvasElement).findByText(t(lineKeys[variant])),
    ).toBeTruthy();
  },
};

export const AllVariants: Story = {
  parameters: { controls: { disable: true } },
  render: () => (
    <View className="gap-6 p-gutter">
      <WithText>
        {(t) =>
          variants.map((variant) => (
            <TutorQuote
              key={variant}
              variant={variant}
              tabLabel={t(tabKeys[variant])}
            >
              {t(lineKeys[variant])}
            </TutorQuote>
          ))
        }
      </WithText>
    </View>
  ),
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const tabs = [];
    for (const variant of variants) {
      tabs.push(
        await inspectQuote(canvasElement, t(tabKeys[variant]), variant),
      );
    }
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
