import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { derLetzteZug } from '../../mocks/lesson-tasks';
import { StoryText } from './StoryText';
import { storyTextMeta } from './StoryText.meta';

const meta = {
  title: 'Components/StoryText',
  component: StoryText,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(storyTextMeta) } },
    controls: { include: ['activeWord'] },
  },
  args: {
    text: derLetzteZug.text,
    marks: [
      { word: 'Bahnhof', tone: 'masc' },
      { word: 'verspätet', tone: 'none' },
    ],
    activeWord: null,
    onWordPress: fn(),
  },
  argTypes: {
    activeWord: {
      control: 'select',
      options: [null, 'Bahnhof', 'verspätet'],
      description: 'The word whose card is open; it gets a dim fill.',
    },
  },
  render: (args) => (
    <View className="p-gutter">
      <StoryText {...args} />
    </View>
  ),
} satisfies Meta<typeof StoryText>;

export default meta;

type Story = StoryObj<typeof StoryText>;

export const Default: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);
    const station = await canvas.findByRole('button', { name: 'Bahnhof' });
    const late = canvas.getByRole('button', { name: 'verspätet' });

    expect(getComputedStyle(station).textDecorationLine).toBe('none');
    expect(getComputedStyle(station).color).not.toBe(
      getComputedStyle(station.parentElement!).color,
    );
    expect(getComputedStyle(late).textDecorationLine).toBe('none');
    expect(getComputedStyle(late).color).not.toBe(
      getComputedStyle(station).color,
    );
    expect(getComputedStyle(late).color).not.toBe(
      getComputedStyle(late.parentElement!).color,
    );
    expect(canvasElement.textContent).toContain(derLetzteZug.text);
    if (args.activeWord === null) {
      expect(getComputedStyle(station).backgroundColor).toMatch(
        /, 0\)$|transparent/,
      );
    }

    await userEvent.click(station);
    expect((args.onWordPress as ReturnType<typeof fn>).mock.calls[0]?.[0]).toBe(
      'Bahnhof',
    );
  },
};

export const MarkedOnly: Story = {
  args: {
    text: derLetzteZug.text,
    marks: [
      { word: 'läuft', tone: 'retry' },
      { word: 'Zu', tone: 'retry' },
      { word: 'Taschenlampe', tone: 'retry' },
    ],
    onWordPress: undefined,
  },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const word = await canvas.findByText('läuft');

    expect(canvas.queryByRole('button')).toBeNull();
    expect(canvas.queryByText('Zu')).toBeNull();
    expect(canvas.queryByText('Taschenlampe')).toBeNull();
    expect(getComputedStyle(word).textDecorationLine).toBe('underline');
    expect(getComputedStyle(word).color).toBe(
      getComputedStyle(word).textDecorationColor,
    );
    expect(getComputedStyle(word).color).not.toBe(
      getComputedStyle(word.parentElement!).color,
    );
  },
};
