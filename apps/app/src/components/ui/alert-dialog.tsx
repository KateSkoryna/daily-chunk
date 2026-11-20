import * as AlertDialogPrimitive from '@rn-primitives/alert-dialog';
import type { ComponentProps } from 'react';
import { View, type ViewProps } from 'react-native';

import { cn } from '../../lib/utils';
import { HardShadow } from '../../theme/HardShadow/HardShadow';
import { Text } from './text';

const AlertDialog = AlertDialogPrimitive.Root;
const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

function AlertDialogContent({
  children,
  className,
}: {
  children: ViewProps['children'];
  className?: string;
}) {
  return (
    <AlertDialogPrimitive.Portal>
      <AlertDialogPrimitive.Overlay className="absolute inset-0 items-center justify-center bg-background/80 px-gutter web:fixed">
        <HardShadow className="w-full max-w-sm">
          <AlertDialogPrimitive.Content
            className={cn(
              'w-full gap-4 border-2 border-border bg-popover p-4',
              className,
            )}
          >
            {children}
          </AlertDialogPrimitive.Content>
        </HardShadow>
      </AlertDialogPrimitive.Overlay>
    </AlertDialogPrimitive.Portal>
  );
}

function AlertDialogTitle(
  props: Omit<ComponentProps<typeof AlertDialogPrimitive.Title>, 'asChild'>,
) {
  return (
    <AlertDialogPrimitive.Title asChild {...props}>
      <Text variant="display-btn">{props.children}</Text>
    </AlertDialogPrimitive.Title>
  );
}

function AlertDialogDescription(
  props: Omit<
    ComponentProps<typeof AlertDialogPrimitive.Description>,
    'asChild'
  >,
) {
  return (
    <AlertDialogPrimitive.Description asChild {...props}>
      <Text variant="body" className="text-muted-foreground">
        {props.children}
      </Text>
    </AlertDialogPrimitive.Description>
  );
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return <View className={cn('gap-3', className)} {...props} />;
}

const AlertDialogAction = AlertDialogPrimitive.Action;
const AlertDialogCancel = AlertDialogPrimitive.Cancel;

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogTrigger,
};
