import { useAppLanguage } from '@daily-chunk/i18n';
import { useEffect } from 'react';
import { useStore } from 'zustand';

import { createMockAiService } from '../ai/mock-ai-service';
import { getStorage } from '../storage/app-storage';
import { createAppStore, type AppState } from './app-store';

export const appStore = createAppStore({
  getStorage,
  ai: createMockAiService(),
  now: () => new Date(),
});

export function useAppStore<Selected>(selector: (state: AppState) => Selected) {
  return useStore(appStore, selector);
}

export function useStartAppStore() {
  const { appLanguage } = useAppLanguage();

  useEffect(() => {
    void appStore.getState().load(appLanguage);
  }, [appLanguage]);
}
