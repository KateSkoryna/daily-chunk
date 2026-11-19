import {
  createI18n,
  useTranslation,
  type AppLanguage,
} from '@daily-chunk/i18n';
import type { ReactNode } from 'react';

export type Translate = ReturnType<typeof useTranslation>['t'];

export function WithText({
  children,
}: {
  children: (translate: Translate, appLanguage: AppLanguage) => ReactNode;
}) {
  const { t, i18n } = useTranslation();
  return children(t, i18n.language as AppLanguage);
}

export function appLanguageOf(globals: Record<string, unknown>) {
  return (globals.appLanguage ?? 'en') as AppLanguage;
}

export function textFor(globals: Record<string, unknown>) {
  return createI18n(appLanguageOf(globals)).t;
}
