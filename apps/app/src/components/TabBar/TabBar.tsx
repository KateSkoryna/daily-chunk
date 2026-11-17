import { View } from 'react-native';

import { Icon } from '../Icon/Icon';
import type { IconName } from '../Icon/icon-shapes';
import { PressableFocus } from '../PressableFocus/PressableFocus';
import { Text, TextClassContext } from '../ui/text';

type TabBarTab = {
  key: string;
  label: string;
  icon: IconName;
  badge?: number;
};

type TabBarProps = {
  tabs: TabBarTab[];
  activeKey: string;
  onSelect: (key: string) => void;
  accessibilityLabel: string;
  bottomInset?: number;
};

function TabBar({
  tabs,
  activeKey,
  onSelect,
  accessibilityLabel,
  bottomInset = 0,
}: TabBarProps) {
  return (
    <View
      accessibilityRole="tablist"
      accessibilityLabel={accessibilityLabel}
      className="flex-row border-t-2 border-border bg-background"
      style={{ paddingBottom: bottomInset }}
    >
      {tabs.map((tab) => {
        const isActive = tab.key === activeKey;

        return (
          <TextClassContext.Provider
            key={tab.key}
            value={isActive ? 'text-primary' : 'text-muted-foreground'}
          >
            <PressableFocus
              accessibilityRole="tab"
              aria-selected={isActive}
              onPress={() => onSelect(tab.key)}
              className="h-tabbar flex-1 items-center justify-center gap-0.5"
            >
              {isActive ? (
                <View
                  testID="tab-active-bar"
                  className="absolute inset-x-0 -top-0.5 border-t-3 border-primary"
                />
              ) : null}
              <View>
                <Icon name={tab.icon} decorative />
                {tab.badge ? (
                  <View className="absolute -right-4 -top-1 min-w-4 items-center bg-highlight px-1">
                    <Text variant="caption" className="text-primary-foreground">
                      {tab.badge}
                    </Text>
                  </View>
                ) : null}
              </View>
              <Text
                variant="caption"
                numberOfLines={1}
                className="max-w-full tracking-[0.125rem]"
              >
                {tab.label}
              </Text>
            </PressableFocus>
          </TextClassContext.Provider>
        );
      })}
    </View>
  );
}

export { TabBar };
export type { TabBarProps, TabBarTab };
