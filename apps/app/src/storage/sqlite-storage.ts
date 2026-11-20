import type { Storage } from '@daily-chunk/core';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseAsync } from 'expo-sqlite';

import migrations from '../../drizzle/migrations';
import { toProfile, toProfileRow } from './profile-row';
import { profileTable } from './schema';

export async function createSqliteStorage(
  databaseName = 'daily-chunk.db',
): Promise<Storage> {
  const sqlite = await openDatabaseAsync(databaseName);
  const database = drizzle(sqlite);
  await migrate(database, migrations);

  return {
    profile: {
      get: async () => {
        const [row] = await database.select().from(profileTable).limit(1);
        return row ? toProfile(row) : undefined;
      },
      save: async (profile) => {
        const row = toProfileRow(profile);
        await database
          .insert(profileTable)
          .values(row)
          .onConflictDoUpdate({ target: profileTable.id, set: row });
      },
    },
  };
}
