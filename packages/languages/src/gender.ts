export const genderRoles = ['masc', 'fem', 'neut', 'plural'] as const;

export type GenderRole = (typeof genderRoles)[number];

export type PickerGender = Exclude<GenderRole, 'plural'>;
