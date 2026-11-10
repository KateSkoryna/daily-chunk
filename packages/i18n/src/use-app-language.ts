import { useTranslation } from 'react-i18next';
import { pickAppLanguage, type AppLanguage } from './app-language';

export function useAppLanguage() {
  const { i18n } = useTranslation();
  const appLanguage = pickAppLanguage([i18n.language, i18n.resolvedLanguage]);

  function setAppLanguage(nextAppLanguage: AppLanguage) {
    return i18n.changeLanguage(nextAppLanguage);
  }

  return { appLanguage, setAppLanguage };
}
