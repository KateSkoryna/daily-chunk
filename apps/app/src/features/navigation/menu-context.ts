import { createContext, useContext } from 'react';

type MenuContextValue = { openMenu: () => void };

export const MenuContext = createContext<MenuContextValue>({
  openMenu: () => undefined,
});

export function useMenu() {
  return useContext(MenuContext);
}
