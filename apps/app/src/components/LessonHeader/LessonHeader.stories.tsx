import type { Meta, StoryObj } from '@storybook/react-native-web-vite';
import { View } from 'react-native';
import { expect, fn, userEvent, within } from 'storybook/test';

import { metaToMarkdown } from '../../lib/meta-to-markdown';
import { textFor, WithText } from '../../lib/story-text';
import { Icon } from '../Icon/Icon';
import { Button } from '../ui/button';
import { LessonHeader } from './LessonHeader';
import { lessonHeaderMeta } from './LessonHeader.meta';

const onClose = fn();
const onBack = fn();

const meta = {
  title: 'Components/LessonHeader',
  component: LessonHeader,
  tags: ['autodocs'],
  parameters: {
    docs: { description: { component: metaToMarkdown(lessonHeaderMeta) } },
    controls: { disable: true },
  },
  args: {
    left: null,
    lessonLabel: '',
    stepLabel: '',
    xpLabel: '',
    stepCount: 7,
    currentStep: 1,
  },
  render: (args) => (
    <View className="p-gutter">
      <WithText>
        {(t) => (
          <LessonHeader
            {...args}
            left={
              <Button
                variant="ghost"
                accessibilityLabel={t('common.back')}
                onPress={onBack}
              >
                <Icon name="back" decorative />
              </Button>
            }
            right={
              <Button
                variant="ghost"
                accessibilityLabel={t('lesson.quit')}
                onPress={onClose}
              >
                <Icon name="cross" decorative />
              </Button>
            }
            lessonLabel={t('lesson.title', { number: 13 })}
            stepLabel={t('lesson.stepLabel', {
              step: '01',
              task: t('lesson.tasks.flashcards'),
            })}
            xpLabel={t('lesson.xpEarned', { count: 0 })}
          />
        )}
      </WithText>
    </View>
  ),
} satisfies Meta<typeof LessonHeader>;

export default meta;

type Story = StoryObj<typeof LessonHeader>;

export const Default: Story = {
  play: async ({ canvasElement, globals }) => {
    const t = textFor(globals);
    const canvas = within(canvasElement);
    const stepLabel = t('lesson.stepLabel', {
      step: '01',
      task: t('lesson.tasks.flashcards'),
    });
    const quit = await canvas.findByRole('button', { name: t('lesson.quit') });
    const lesson = canvas.getByText(t('lesson.title', { number: 13 }));
    const bar = canvas.getByRole('progressbar', { name: stepLabel });

    expect(bar.getAttribute('aria-valuenow')).toBe('1');
    expect(canvas.getByText(t('lesson.xpEarned', { count: 0 }))).toBeTruthy();
    const back = canvas.getByRole('button', { name: t('common.back') });

    expect(back.getBoundingClientRect().right).toBeLessThan(
      lesson.getBoundingClientRect().left,
    );
    expect(lesson.getBoundingClientRect().right).toBeLessThan(
      quit.getBoundingClientRect().left,
    );
    expect(quit.getBoundingClientRect().bottom).toBeLessThan(
      bar.getBoundingClientRect().top,
    );

    await userEvent.click(quit);
    await userEvent.click(back);
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(onBack).toHaveBeenCalledTimes(1);
  },
};
