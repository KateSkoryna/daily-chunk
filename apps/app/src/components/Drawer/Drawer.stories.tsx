import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { toRem } from '../../lib/browser-rem';
import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Drawer, type DrawerProps } from './Drawer';
import { drawerMeta } from './Drawer.meta';

type DrawerDemoProps = Pick<DrawerProps, 'isOpen' | 'onClose'> & {
  onSelectItem: (label: string) => void;
};

function DrawerDemo({ isOpen, onClose, onSelectItem }: DrawerDemoProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(isOpen);

  return (
    <WithText>
      {(t) => (
        <Drawer
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            onClose();
          }}
          title={t('app.name')}
          closeLabel={t('menu.close')}
          accessibilityLabel={t('menu.title')}
        >
          <Drawer.Item
            label={t('menu.account')}
            icon="account"
            onPress={() => onSelectItem(t('menu.account'))}
          />
          <Drawer.Item
            label={t('menu.review')}
            icon="retry"
            badge="5"
            onPress={() => onSelectItem(t('menu.review'))}
          />
          <Drawer.Item
            label={t('menu.settings')}
            icon="settings"
            onPress={() => onSelectItem(t('menu.settings'))}
          />
        </Drawer>
      )}
    </WithText>
  );
}

const meta = {
  title: 'Components/Drawer',
  component: DrawerDemo,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(drawerMeta) } },
    controls: { include: ['isOpen'] },
  },
  args: { isOpen: true, onClose: fn(), onSelectItem: fn() },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description: 'Whether the drawer is shown. The layout owns this state.',
    },
  },
  render: (args) => <DrawerDemo key={String(args.isOpen)} {...args} />,
} satisfies Meta<typeof DrawerDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, globals }) => {
    const t = textFor(globals);
    const page = within(document.body);
    const navigation = await page.findByRole('navigation', {
      name: t('menu.title'),
    });
    const items = within(navigation).getAllByRole('link');

    expect(items.map((item) => item.textContent)).toEqual([
      t('menu.account'),
      `${t('menu.review')}5`,
      t('menu.settings'),
    ]);
    expect(toRem(navigation.getBoundingClientRect().width)).toBeLessThanOrEqual(
      20,
    );
    for (const item of items) {
      expect(toRem(item.getBoundingClientRect().height)).toBeGreaterThanOrEqual(
        3,
      );
    }

    await userEvent.click(items[1]!);
    expect(args.onSelectItem).toHaveBeenCalledWith(t('menu.review'));

    await userEvent.click(
      within(navigation).getByRole('button', { name: t('menu.close') }),
    );
    expect(args.onClose).toHaveBeenCalledTimes(1);
    await waitFor(() =>
      expect(page.queryByRole('navigation', { name: t('menu.title') })).toBe(
        null,
      ),
    );
  },
};

export const Closed: Story = {
  args: { isOpen: false },
  play: async ({ globals }) => {
    const t = textFor(globals);

    expect(
      within(document.body).queryByRole('navigation', {
        name: t('menu.title'),
      }),
    ).toBe(null);
  },
};
