import type { ReactNode } from 'react';
import { Modal, Pressable, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { HardShadow } from '../../theme/HardShadow/HardShadow';
import { LogoBadge } from '../LogoBadge/LogoBadge';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { TopBar } from '../TopBar/TopBar';
import { Text } from '../ui/text';

type DrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  closeLabel: string;
  accessibilityLabel: string;
  children: ReactNode;
};

type DrawerPanelProps = Omit<DrawerProps, 'isOpen'>;

function DrawerPanel({
  onClose,
  title,
  closeLabel,
  accessibilityLabel,
  children,
}: DrawerPanelProps) {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={closeLabel}
        onPress={onClose}
        className="absolute inset-0 bg-background/80"
      />
      <HardShadow className="absolute inset-y-0 left-0 w-4/5 max-w-xs">
        <View
          role="navigation"
          aria-label={accessibilityLabel}
          style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
          className="flex-1 border-r-2 border-primary bg-popover"
        >
          <View className="flex-1 gap-5 px-5 pb-6 pt-screen-top">
            <TopBar
              left={
                <View className="flex-row items-center gap-2.5">
                  <LogoBadge accessibilityLabel={title} />
                  <Text variant="display-btn-sm">{title}</Text>
                </View>
              }
              right={
                <TopBar.Button
                  icon="cross"
                  onPress={onClose}
                  accessibilityLabel={closeLabel}
                />
              }
            />
            <View accessibilityRole="list">{children}</View>
          </View>
        </View>
      </HardShadow>
    </View>
  );
}

function Drawer({ isOpen, ...panelProps }: DrawerProps) {
  return (
    <Modal
      visible={isOpen}
      transparent
      statusBarTranslucent
      navigationBarTranslucent
      animationType="none"
      onRequestClose={panelProps.onClose}
    >
      <SafeAreaProvider>
        <DrawerPanel {...panelProps} />
      </SafeAreaProvider>
    </Modal>
  );
}

type DrawerItemProps = {
  label: string;
  icon: IconName;
  badge?: string;
  onPress: () => void;
};

function DrawerItem({ label, icon, badge, onPress }: DrawerItemProps) {
  return (
    <View role="listitem" className="border-b-2 border-border">
      <PressableFocus
        accessibilityRole="link"
        onPress={onPress}
        className="min-h-touch flex-row items-center gap-3.5 px-2"
      >
        <Icon name={icon} decorative className="text-ring" />
        <Text variant="label" className="flex-1">
          {label}
        </Text>
        {badge ? (
          <View className="bg-highlight px-1.5">
            <Text variant="caption" className="text-primary-foreground">
              {badge}
            </Text>
          </View>
        ) : null}
      </PressableFocus>
    </View>
  );
}

Drawer.Item = DrawerItem;

export { Drawer };
export type { DrawerItemProps, DrawerProps };
