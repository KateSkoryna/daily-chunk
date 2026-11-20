import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { PlaceholderScreen } from './PlaceholderScreen';
import { placeholderScreenMeta } from './PlaceholderScreen.meta';

const meta = {
  title: 'Screens/Placeholder',
  component: PlaceholderScreen,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(placeholderScreenMeta) } },
    controls: { include: ['buttonIcon'] },
  },
  args: {
    title: '',
    buttonLabel: '',
    buttonIcon: 'menu',
    onButtonPress: fn(),
  },
  argTypes: {
    buttonIcon: {
      control: 'select',
      options: ['menu', 'back', 'cross'],
      description: 'The icon of the top-corner button',
    },
  },
  render: (args) => (
    <WithText>
      {(t) => (
        <PlaceholderScreen
          {...args}
          title={t('nav.lessons')}
          buttonLabel={t(
            args.buttonIcon === 'menu' ? 'nav.menu' : 'common.back',
          )}
        />
      )}
    </WithText>
  ),
} satisfies Meta<typeof PlaceholderScreen>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole('heading', { name: t('nav.lessons') }),
    ).toBeTruthy();
    expect(canvas.getByText(t('placeholder.comingSoon'))).toBeTruthy();

    await userEvent.click(canvas.getByRole('button', { name: t('nav.menu') }));

    expect(args.onButtonPress).toHaveBeenCalledTimes(1);
  },
};

export const WithBackButton: Story = {
  args: { buttonIcon: 'back' },
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole('button', { name: t('common.back') }),
    );

    expect(args.onButtonPress).toHaveBeenCalledTimes(1);
  },
};
