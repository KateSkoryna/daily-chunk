import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { listenDemo } from '../../mocks/listen';
import { Waveform } from './Waveform';
import { waveformMeta } from './Waveform.meta';

const meta = {
  title: 'Components/Waveform',
  component: Waveform,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(waveformMeta) } },
    controls: { include: ['progress'] },
  },
  args: {
    bars: listenDemo.waveformBars,
    progress: listenDemo.playedSeconds / listenDemo.durationSeconds,
    accessibilityLabel: '',
  },
  argTypes: {
    progress: {
      control: { type: 'range', min: 0, max: 1, step: 0.05 },
      description: 'How much of the clip was played, from 0 to 1.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <Waveform
            {...args}
            accessibilityLabel={t('listen.waveform', {
              played: args.progress * listenDemo.durationSeconds,
              total: listenDemo.durationSeconds,
            })}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof Waveform>;

export default meta;

type Story = StoryObj<typeof Waveform>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const image = await canvas.findByRole('img', {
      name: t('listen.waveform', {
        played: args.progress * listenDemo.durationSeconds,
        total: listenDemo.durationSeconds,
      }),
    });
    const played = within(image).queryAllByTestId('bar-played');
    const unplayed = within(image).queryAllByTestId('bar-unplayed');

    expect(played.length + unplayed.length).toBe(args.bars.length);
    expect(played).toHaveLength(Math.floor(args.bars.length * args.progress));
    if (played.length > 0 && unplayed.length > 0) {
      expect(getComputedStyle(played[0]!).backgroundColor).not.toBe(
        getComputedStyle(unplayed[0]!).backgroundColor,
      );
    }
    expect(toRem(image.getBoundingClientRect().height)).toBe(3);
    const heights = [...played, ...unplayed].map(
      (bar) => bar.getBoundingClientRect().height,
    );
    expect(Math.max(...heights)).toBeGreaterThan(Math.min(...heights));
  },
};
