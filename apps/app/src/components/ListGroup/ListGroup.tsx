import { Children, isValidElement, type ReactNode } from 'react';
import { View } from 'react-native';

import { cn } from '../../lib/utils';
import { PressableFocus } from '../PressableFocus/PressableFocus';

type ListGroupProps = {
  children: ReactNode;
  className?: string;
};

function ListGroup({ children, className }: ListGroupProps) {
  const rows = Children.toArray(children);

  return (
    <View
      accessibilityRole="list"
      className={cn('border-2 border-border', className)}
    >
      {rows.map((row, index) => (
        <View
          key={isValidElement(row) ? row.key : index}
          role="listitem"
          className={index > 0 ? 'border-t-2 border-border' : undefined}
        >
          {row}
        </View>
      ))}
    </View>
  );
}

type ListRowProps = {
  left?: ReactNode;
  right?: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  children: ReactNode;
};

function ListRow({
  left,
  right,
  onPress,
  accessibilityLabel,
  children,
}: ListRowProps) {
  const content = (
    <View className="min-h-touch flex-row items-center gap-3 bg-card px-3 py-2.5">
      {left}
      <View className="min-w-0 flex-1">{children}</View>
      {right}
    </View>
  );

  if (!onPress) {
    return content;
  }

  return (
    <PressableFocus
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
    >
      {content}
    </PressableFocus>
  );
}

ListGroup.Row = ListRow;

export { ListGroup };
export type { ListGroupProps, ListRowProps };
