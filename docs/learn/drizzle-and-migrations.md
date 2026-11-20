# Drizzle, the storage interface and migrations

## What they are

- **ORM (Drizzle)**: describes database tables as TypeScript code and gives typed queries, so you do not write SQL text by hand. Like TypeORM, but plain functions instead of decorated classes.
- **Storage interface** (`packages/core/src/storage.ts`): the list of things the app may ask the storage to do (`profile.get()`, `profile.save(profile)`), all returning Promises. Screens know only this contract, never SQLite or Drizzle.
- **Migration**: a SQL file that changes the database structure from one version to the next. Version 1 creates the `profile` table; a later version adds a column and keeps the user's data.

## Where it lives

- `apps/app/src/storage/schema.ts`: the tables (TypeScript).
- `apps/app/drizzle/*.sql`: the generated migrations, one per change. Do not edit them by hand.
- `apps/app/src/storage/sqlite-storage.ts`: opens the database with the async call (this avoids the first-call timeout on web), runs the migrations, and returns a `Storage`.
- `apps/app/src/storage/profile-row.ts`: turns a `Profile` into a table row and back (tested in `tests/profile-row.test.ts`).
- `apps/app/app/dev/storage-check.tsx`: a developer page that saves and loads the profile; `e2e/storage.mjs` reloads it in a browser.

## How to change the tables

1. Edit `src/storage/schema.ts`.
2. In `apps/app` run `npm run db:generate`. It writes a new `.sql` file and updates `drizzle/migrations.js`.
3. Commit all of it. The app runs new migrations when it opens the database.

Metro bundles `.sql` files as text (`metro.config.js` and the `inline-import` Babel plugin).
