import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Toggle, type ToggleProps } from './Toggle';
import { toggleMeta } from './Toggle.meta';

function ToggleDemo({ isOn, onToggle }: ToggleProps) {
  const [on, setOn] = useState(isOn);

  return (
    <View className="items-start p-gutter">
      <WithText>
        {(t) => (
          <Toggle
            label={t(on ? 'read.translationOn' : 'read.translationOff', {
              language: 'RU',
            })}
            isOn={on}
            onToggle={() => {
              setOn(!on);
              onToggle();
            }}
          />
        )}
      </WithText>
    </View>
  );
}

const meta = {
  title: 'Components/Toggle',
  component: Toggle,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(toggleMeta) } },
    controls: { include: ['isOn'] },
  },
  args: { label: '', isOn: false, onToggle: fn() },
  argTypes: {
    isOn: {
      control: 'boolean',
      description: 'Whether the option is on. The screen owns this state.',
    },
  },
  render: (args) => <ToggleDemo key={String(args.isOn)} {...args} />,
} satisfies Meta<typeof Toggle>;

export default meta;

type Story = StoryObj<typeof Toggle>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const initial = args.isOn;
    const labelOf = (on: boolean) =>
      t(on ? 'read.translationOn' : 'read.translationOff', { language: 'RU' });
    const toggle = await canvas.findByRole('switch', {
      name: labelOf(initial),
    });
    const borderBefore = getComputedStyle(toggle).borderTopColor;

    expect(toggle.getAttribute('aria-checked')).toBe(String(initial));
    expect(toRem(toggle.getBoundingClientRect().height)).toBe(3.5);
    expect(toRem(getComputedStyle(toggle).borderTopWidth)).toBe(0.125);

    await userEvent.click(toggle);

    expect(args.onToggle).toHaveBeenCalledTimes(1);
    const flipped = canvas.getByRole('switch', { name: labelOf(!initial) });
    expect(flipped.getAttribute('aria-checked')).toBe(String(!initial));
    expect(getComputedStyle(flipped).borderTopColor).not.toBe(borderBefore);
  },
};
