import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { StepIndicator } from './StepIndicator';
import { stepIndicatorMeta } from './StepIndicator.meta';

const meta = {
  title: 'Components/StepIndicator',
  component: StepIndicator,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(stepIndicatorMeta) } },
    controls: { include: ['current'] },
  },
  args: { steps: [], current: 1, label: '' },
  argTypes: {
    current: {
      control: 'inline-radio',
      options: [1, 2],
      description: 'The current part, counting from 1.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <StepIndicator
            {...args}
            steps={[t('listen.stepListen'), t('listen.stepRepeat')]}
            label={t('listen.steps')}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof StepIndicator>;

export default meta;

type Story = StoryObj<typeof StepIndicator>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const bar = await canvas.findByRole('progressbar', {
      name: t('listen.steps'),
    });
    const first = canvas.getByText(`1 · ${t('listen.stepListen')}`);
    const second = canvas.getByText(`2 · ${t('listen.stepRepeat')}`);
    const current = args.current ?? 1;
    const [activeLabel, otherLabel] =
      current === 1 ? [first, second] : [second, first];

    expect(bar.getAttribute('aria-valuenow')).toBe(String(current));
    expect(bar.getAttribute('aria-valuemax')).toBe('2');
    expect(getComputedStyle(activeLabel).color).not.toBe(
      getComputedStyle(otherLabel).color,
    );
    expect(
      getComputedStyle(activeLabel.parentElement!).backgroundColor,
    ).not.toBe(getComputedStyle(otherLabel.parentElement!).backgroundColor);
    expect(first.parentElement!.getBoundingClientRect().width).toBeCloseTo(
      second.parentElement!.getBoundingClientRect().width,
      0,
    );
  },
};

export const SecondStep: Story = {
  args: { current: 2 },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const bar = await canvas.findByRole('progressbar', {
      name: t('listen.steps'),
    });
    const second = canvas.getByText(`2 · ${t('listen.stepRepeat')}`);
    const first = canvas.getByText(`1 · ${t('listen.stepListen')}`);

    expect(bar.getAttribute('aria-valuenow')).toBe('2');
    expect(getComputedStyle(second.parentElement!).backgroundColor).not.toBe(
      getComputedStyle(first.parentElement!).backgroundColor,
    );
  },
};
