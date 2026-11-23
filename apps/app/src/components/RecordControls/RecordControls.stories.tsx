import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { RecordControls } from './RecordControls';
import { recordControlsMeta } from './RecordControls.meta';

const meta = {
  title: 'Components/RecordControls',
  component: RecordControls,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(recordControlsMeta) } },
    controls: { include: ['state'] },
  },
  args: {
    state: 'idle',
    recordLabel: '',
    stopLabel: '',
    playRecordingLabel: '',
    recordAgainLabel: '',
    onRecord: fn(),
    onPlayRecording: fn(),
  },
  argTypes: {
    state: {
      control: 'inline-radio',
      options: ['idle', 'recording', 'done'],
      description: 'What the buttons show.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <RecordControls
            {...args}
            recordLabel={t('listen.recordRepeat')}
            stopLabel={t('listen.stopRecording')}
            playRecordingLabel={t('listen.playRecording')}
            recordAgainLabel={t('listen.recordAgain')}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof RecordControls>;

export default meta;

type Story = StoryObj<typeof RecordControls>;

export const Default: Story = {
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const record = await canvas.findByRole('button', {
      name: t('listen.recordRepeat'),
    });

    expect(canvas.getAllByRole('button')).toHaveLength(1);
    await userEvent.click(record);
    expect(args.onRecord).toHaveBeenCalledTimes(1);
  },
};

export const Recording: Story = {
  args: { state: 'recording' },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const stop = await canvas.findByRole('button', {
      name: t('listen.stopRecording'),
    });

    await userEvent.click(stop);
    expect(args.onRecord).toHaveBeenCalledTimes(1);
  },
};

export const Recorded: Story = {
  args: { state: 'done' },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const playRecording = await canvas.findByRole('button', {
      name: t('listen.playRecording'),
    });
    const recordAgain = canvas.getByRole('button', {
      name: t('listen.recordAgain'),
    });

    expect(playRecording.getBoundingClientRect().right).toBeLessThan(
      recordAgain.getBoundingClientRect().left,
    );
    await userEvent.click(playRecording);
    await userEvent.click(recordAgain);

    expect(args.onPlayRecording).toHaveBeenCalledTimes(1);
    expect(args.onRecord).toHaveBeenCalledTimes(1);
  },
};
