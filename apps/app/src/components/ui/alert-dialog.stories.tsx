import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { expect, userEvent, waitFor, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from './alert-dialog';
import { alertDialogMeta } from './alert-dialog.meta';
import { Button } from './button';
import { Text } from './text';

function AlertDialogDemo({ open }: { open: boolean }) {
  const [isOpen, setIsOpen] = useState(open);

  return (
    <WithText>
      {(t) => (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogContent>
            <AlertDialogTitle>{t('leaveLesson.title')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('leaveLesson.body')}
            </AlertDialogDescription>
            <AlertDialogFooter>
              <AlertDialogAction asChild>
                <Button variant="destructive">
                  <Text>{t('leaveLesson.leave')}</Text>
                </Button>
              </AlertDialogAction>
              <AlertDialogCancel asChild>
                <Button variant="secondary">
                  <Text>{t('leaveLesson.stay')}</Text>
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </WithText>
  );
}

const meta = {
  title: 'Components/AlertDialog',
  component: AlertDialogDemo,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(alertDialogMeta) } },
    controls: { include: ['open'] },
  },
  args: { open: true },
  argTypes: {
    open: { control: 'boolean', description: 'Whether the dialog is shown' },
  },
  render: (args) => <AlertDialogDemo key={String(args.open)} {...args} />,
} satisfies Meta<typeof AlertDialogDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ globals }) => {
    const t = textFor(globals);
    const page = within(document.body);
    const dialog = await page.findByRole('alertdialog');

    expect(within(dialog).getByText(t('leaveLesson.title'))).toBeTruthy();

    await userEvent.keyboard('{Escape}');

    await waitFor(() => expect(page.queryByRole('alertdialog')).toBe(null));
  },
};
