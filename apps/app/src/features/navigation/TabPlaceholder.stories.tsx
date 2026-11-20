import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import { TabPlaceholder } from './TabPlaceholder';
import { tabPlaceholderMeta } from './TabPlaceholder.meta';
import { MenuContext } from './menu-context';

const openMenu = fn();

const meta = {
  title: 'Screens/TabPlaceholder',
  component: TabPlaceholder,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(tabPlaceholderMeta) } },
    controls: { include: ['titleKey'] },
  },
  args: { titleKey: 'nav.lessons' },
  argTypes: {
    titleKey: {
      control: 'select',
      options: ['nav.home', 'nav.lessons', 'nav.score', 'nav.stats'],
      description: 'The i18n key of the tab name',
    },
  },
  decorators: [
    (Story) => (
      <MenuContext.Provider value={{ openMenu }}>
        <Story />
      </MenuContext.Provider>
    ),
  ],
} satisfies Meta<typeof TabPlaceholder>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement, args, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);

    expect(
      canvas.getByRole('heading', { name: t(args.titleKey) }),
    ).toBeTruthy();

    await userEvent.click(canvas.getByRole('button', { name: t('nav.menu') }));

    expect(openMenu).toHaveBeenCalledTimes(1);
  },
};
