// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from './meta/_journal.json';
import m0000 from './0000_create_profile.sql';
import m0001 from './0001_create_words.sql';
import m0002 from './0002_create_lessons.sql';
import m0003 from './0003_add_word_tip.sql';
import m0004 from './0004_add_profile_level.sql';

  export default {
    journal,
    migrations: {
      m0000,
m0001,
m0002,
m0003,
m0004
    }
  }
  