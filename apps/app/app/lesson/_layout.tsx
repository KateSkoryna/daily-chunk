import {
  Stack,
  useNavigation,
  type NavigationAction,
  usePreventRemove,
  usePathname,
} from 'expo-router';
import { useEffect, useState } from 'react';

import { LeaveLessonDialog } from '../../src/features/navigation/LeaveLessonDialog';

export default function LessonLayout() {
  const navigation = useNavigation();
  const isDoneScreen = usePathname() === '/lesson/done';
  const [askedAction, setAskedAction] = useState<NavigationAction | null>(null);
  const [leavingAction, setLeavingAction] = useState<NavigationAction | null>(
    null,
  );

  usePreventRemove(!isDoneScreen && leavingAction === null, ({ data }) =>
    setAskedAction(data.action),
  );

  useEffect(() => {
    if (leavingAction) {
      navigation.dispatch(leavingAction);
    }
  }, [leavingAction, navigation]);

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <LeaveLessonDialog
        isOpen={askedAction !== null}
        onLeave={() => setLeavingAction(askedAction)}
        onClose={() => setAskedAction(null)}
      />
    </>
  );
}
