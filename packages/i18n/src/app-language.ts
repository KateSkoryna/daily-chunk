export const appLanguages = ['en', 'ru'] as const;

export type AppLanguage = (typeof appLanguages)[number];

export const defaultAppLanguage: AppLanguage = 'en';

function isAppLanguage(languageCode: string): languageCode is AppLanguage {
  return (appLanguages as readonly string[]).includes(languageCode);
}

export function pickAppLanguage(
  deviceLanguageCodes: readonly (string | null | undefined)[],
): AppLanguage {
  const supportedCode = deviceLanguageCodes.find(
    (languageCode): languageCode is AppLanguage =>
      typeof languageCode === 'string' && isAppLanguage(languageCode),
  );
  return supportedCode ?? defaultAppLanguage;
}
