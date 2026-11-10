import { createInstance, type i18n } from 'i18next';
import { initReactI18next } from 'react-i18next';
import { resources } from './resources';
import { defaultAppLanguage, type AppLanguage } from './app-language';

export function createI18n(appLanguage: AppLanguage): i18n {
  const instance = createInstance();
  instance.use(initReactI18next).init({
    lng: appLanguage,
    fallbackLng: defaultAppLanguage,
    resources,
    interpolation: { escapeValue: false },
    initAsync: false,
  });
  return instance;
}
