import type { GenderRole, PickerGender } from './gender';

export type TargetLanguagePack = {
  articles: Record<GenderRole, string>;
  pluralTagLabel: string;
  pluralCaption: string;
  pickerGenders: readonly PickerGender[];
};
