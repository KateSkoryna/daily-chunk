import { useTranslation } from '@daily-chunk/i18n';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';
import { Button } from '../../components/ui/button';
import { Text } from '../../components/ui/text';

type LeaveLessonDialogProps = {
  isOpen: boolean;
  onLeave: () => void;
  onClose: () => void;
};

function LeaveLessonDialog({
  isOpen,
  onLeave,
  onClose,
}: LeaveLessonDialogProps) {
  const { t } = useTranslation();

  return (
    <AlertDialog
      open={isOpen}
      onOpenChange={(isOpening) => {
        if (!isOpening) {
          onClose();
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogTitle>{t('leaveLesson.title')}</AlertDialogTitle>
        <AlertDialogDescription>{t('leaveLesson.body')}</AlertDialogDescription>
        <AlertDialogFooter>
          <AlertDialogAction asChild>
            <Button variant="destructive" onPress={onLeave}>
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
  );
}

export { LeaveLessonDialog };
export type { LeaveLessonDialogProps };
