import type { Storage } from '@daily-chunk/core';

import { createSqliteStorage } from './sqlite-storage';

let storagePromise: Promise<Storage> | undefined;

export function getStorage() {
  storagePromise ??= createSqliteStorage().catch((error: unknown) => {
    storagePromise = undefined;
    throw error;
  });
  return storagePromise;
}
