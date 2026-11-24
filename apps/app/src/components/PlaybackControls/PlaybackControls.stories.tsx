import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { PlaybackControls } from './PlaybackControls';
import { playbackControlsMeta } from './PlaybackControls.meta';

const meta = {
  title: 'Components/PlaybackControls',
  component: PlaybackControls,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(playbackControlsMeta) } },
    controls: { include: ['isPlaying'] },
  },
  args: {
    speedLabel: '',
    isPlaying: false,
    playLabel: '',
    pauseLabel: '',
    onSpeedPress: fn(),
    onTogglePlay: fn(),
  },
  argTypes: {
    isPlaying: {
      control: 'boolean',
      description:
        'Whether the clip is playing: the middle button shows pause.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <PlaybackControls
            {...args}
            speedLabel={t('listen.speed', { speed: 0.75 })}
            playLabel={t('listen.play')}
            pauseLabel={t('listen.pause')}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof PlaybackControls>;

export default meta;

type Story = StoryObj<typeof PlaybackControls>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const speed = await canvas.findByRole('button', {
      name: t('listen.speed', { speed: 0.75 }),
    });
    const toggle = canvas.getByRole('button', {
      name: args.isPlaying ? t('listen.pause') : t('listen.play'),
    });

    expect(toRem(toggle.getBoundingClientRect().width)).toBe(3.5);
    expect(toRem(toggle.getBoundingClientRect().height)).toBe(3.5);
    expect(toRem(speed.getBoundingClientRect().height)).toBe(3.5);
    expect(speed.getBoundingClientRect().right).toBeLessThan(
      toggle.getBoundingClientRect().left,
    );

    await userEvent.click(speed);
    await userEvent.click(toggle);

    expect(args.onSpeedPress).toHaveBeenCalledTimes(1);
    expect(args.onTogglePlay).toHaveBeenCalledTimes(1);
  },
};

export const Playing: Story = {
  args: { isPlaying: true },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    expect(
      await canvas.findByRole('button', { name: t('listen.pause') }),
    ).toBeTruthy();
    expect(canvas.queryByRole('button', { name: t('listen.play') })).toBeNull();
  },
};
