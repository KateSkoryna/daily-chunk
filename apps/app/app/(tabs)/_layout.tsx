import { useTranslation } from '@daily-chunk/i18n';
import { Tabs, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';

import { Drawer } from '../../src/components/Drawer/Drawer';
import { ScreenEdgesContext } from '../../src/components/Screen/screen-edges';
import { TabBar } from '../../src/components/TabBar/TabBar';
import { drawerItems } from '../../src/features/navigation/drawer-items';
import { mainTabs } from '../../src/features/navigation/main-tabs';
import { MenuContext } from '../../src/features/navigation/menu-context';

const tabScreenEdges = { top: true, bottom: false };

export default function TabsLayout() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menu = useMemo(() => ({ openMenu: () => setIsMenuOpen(true) }), []);

  return (
    <MenuContext.Provider value={menu}>
      <ScreenEdgesContext.Provider value={tabScreenEdges}>
        <Tabs
          screenOptions={{ headerShown: false }}
          tabBar={({ state, navigateToTab, insets }) => (
            <TabBar
              tabs={mainTabs(t)}
              activeKey={state.routes[state.index]!.name}
              onSelect={(name) =>
                navigateToTab(
                  state.routes.find((route) => route.name === name)!.key,
                )
              }
              accessibilityLabel={t('nav.main')}
              bottomInset={insets.bottom}
            />
          )}
        >
          <Tabs.Screen name="index" />
          <Tabs.Screen name="lessons" />
          <Tabs.Screen name="score" />
          <Tabs.Screen name="stats" />
        </Tabs>
      </ScreenEdgesContext.Provider>
      <Drawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        title={t('app.name')}
        closeLabel={t('menu.close')}
        accessibilityLabel={t('menu.title')}
      >
        {drawerItems.map((item) => (
          <Drawer.Item
            key={item.key}
            label={t(item.labelKey)}
            icon={item.icon}
            onPress={() => {
              setIsMenuOpen(false);
              router.push(item.href);
            }}
          />
        ))}
      </Drawer>
    </MenuContext.Provider>
  );
}
