import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { useState } from 'react';
import { expect, fn, userEvent, waitFor, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor } from '../../lib/story-text';
import {
  LeaveLessonDialog,
  type LeaveLessonDialogProps,
} from './LeaveLessonDialog';
import { leaveLessonDialogMeta } from './LeaveLessonDialog.meta';

function LeaveLessonDialogDemo({
  isOpen,
  onLeave,
  onClose,
}: LeaveLessonDialogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(isOpen);

  return (
    <LeaveLessonDialog
      isOpen={isDialogOpen}
      onLeave={onLeave}
      onClose={() => {
        setIsDialogOpen(false);
        onClose();
      }}
    />
  );
}

const meta = {
  title: 'Components/LeaveLessonDialog',
  component: LeaveLessonDialogDemo,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(leaveLessonDialogMeta) } },
    controls: { include: ['isOpen'] },
  },
  args: { isOpen: true, onLeave: fn(), onClose: fn() },
  argTypes: {
    isOpen: {
      control: 'boolean',
      description:
        'Whether the dialog is shown. The lesson layout owns this state.',
    },
  },
  render: (args) => (
    <LeaveLessonDialogDemo key={String(args.isOpen)} {...args} />
  ),
} satisfies Meta<typeof LeaveLessonDialogDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, globals }) => {
    const t = textFor(globals);
    const page = within(document.body);
    const dialog = await page.findByRole('alertdialog');

    expect(within(dialog).getByText(t('leaveLesson.title'))).toBeTruthy();
    expect(within(dialog).getByText(t('leaveLesson.body'))).toBeTruthy();

    await userEvent.click(
      within(dialog).getByRole('button', { name: t('leaveLesson.stay') }),
    );

    expect(args.onClose).toHaveBeenCalledTimes(1);
    expect(args.onLeave).not.toHaveBeenCalled();
    await waitFor(() => expect(page.queryByRole('alertdialog')).toBe(null));
  },
};

export const LeavePressed: Story = {
  play: async ({ args, globals }) => {
    const t = textFor(globals);
    const dialog = await within(document.body).findByRole('alertdialog');

    await userEvent.click(
      within(dialog).getByRole('button', { name: t('leaveLesson.leave') }),
    );

    expect(args.onLeave).toHaveBeenCalledTimes(1);
  },
};
