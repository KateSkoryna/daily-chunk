import type { Storage } from '@daily-chunk/core';
import { asc } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import { openDatabaseAsync } from 'expo-sqlite';

import migrations from '../../drizzle/migrations';
import { toProfile, toProfileRow } from './profile-row';
import { toLesson, toLessonRow } from './lesson-row';
import { lessonTable, profileTable, wordTable } from './schema';
import { toWord, toWordRow } from './word-row';

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
    words: {
      list: async () => {
        const rows = await database
          .select()
          .from(wordTable)
          .orderBy(asc(wordTable.createdAt), asc(wordTable.id));
        return rows.map(toWord);
      },
      saveMany: async (words) => {
        for (const word of words) {
          const row = toWordRow(word);
          await database
            .insert(wordTable)
            .values(row)
            .onConflictDoUpdate({ target: wordTable.id, set: row });
        }
      },
    },
    lessons: {
      list: async () => {
        const rows = await database
          .select()
          .from(lessonTable)
          .orderBy(asc(lessonTable.number));
        return rows.map(toLesson);
      },
      save: async (lesson) => {
        const row = toLessonRow(lesson);
        await database
          .insert(lessonTable)
          .values(row)
          .onConflictDoUpdate({ target: lessonTable.id, set: row });
      },
    },
  };
}
