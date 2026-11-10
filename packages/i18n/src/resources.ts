import en from './locales/en.json';
import ru from './locales/ru.json';
import type { AppLanguage } from './app-language';

export const resources = {
  en: { translation: en },
  ru: { translation: ru },
} as const satisfies Record<AppLanguage, { translation: object }>;

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: (typeof resources)['en'];
  }
}
