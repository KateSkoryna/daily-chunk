import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { derLetzteZug } from '../../mocks/lesson-tasks';
import { StoryText } from './StoryText';
import { storyTextMeta } from './StoryText.meta';

const paragraph = derLetzteZug.paragraphs[0]!;

const meta = {
  title: 'Components/StoryText',
  component: StoryText,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(storyTextMeta) } },
    controls: { include: ['activeWord'] },
  },
  args: {
    text: paragraph.text,
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

    expect(getComputedStyle(station).textDecorationLine).toBe('underline');
    expect(getComputedStyle(station).textDecorationColor).not.toBe(
      getComputedStyle(late).textDecorationColor,
    );
    expect(canvasElement.textContent).toContain(paragraph.text);
    if (args.activeWord === null) {
      expect(getComputedStyle(station).backgroundColor).toMatch(
        /, 0\)$|transparent/,
      );
    }

    await userEvent.click(station);
    expect(args.onWordPress).toHaveBeenCalledWith('Bahnhof');
  },
};

export const MarkedOnly: Story = {
  args: {
    text: derLetzteZug.paragraphs[2]!.text,
    marks: [
      { word: 'läuft', tone: 'retry' },
      { word: 'Zu', tone: 'retry' },
      { word: 'Tasche', tone: 'retry' },
    ],
    onWordPress: undefined,
  },
  parameters: { controls: { disable: true } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const word = await canvas.findByText('läuft');

    expect(canvas.queryByRole('button')).toBeNull();
    expect(canvas.queryByText('Zu')).toBeNull();
    expect(canvas.queryByText('Tasche')).toBeNull();
    expect(getComputedStyle(word).textDecorationLine).toBe('underline');
    expect(getComputedStyle(word).color).toBe(
      getComputedStyle(word).textDecorationColor,
    );
    expect(getComputedStyle(word).color).not.toBe(
      getComputedStyle(word.parentElement!).color,
    );
  },
};
