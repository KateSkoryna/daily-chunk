import type { Profile } from './profile';

export type ProfileStorage = {
  get: () => Promise<Profile | undefined>;
  save: (profile: Profile) => Promise<void>;
};

export type Storage = {
  profile: ProfileStorage;
};
