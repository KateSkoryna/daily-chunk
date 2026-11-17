export const supportedNativeLanguages = ['ru', 'en'] as const;

export type NativeLanguage = (typeof supportedNativeLanguages)[number];
