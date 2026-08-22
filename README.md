# Ticket Bounty

## `.env` files

The repo has three environment files, each with a different purpose:

| File               | Who reads it                                                     | What it's for                                                                                     |
| ------------------ | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------- |
| `.env`              | Next.js (`npm run dev` / `build` / `start`) and Prisma Client at runtime | Variables for the app running locally (e.g. `DATABASE_URL`, `RESEND_API_KEY`, `INNGEST_DEV`)          |
| `.env.development`  | `migrate:dev`, `migrate:deploy`, `seed:dev` scripts (via `dotenv-cli`) | Development database — separate `DATABASE_URL`/`DIRECT_URL` so migrations and seeding target the dev database |
| `.env.production`   | `migrate:prod`, `seed:prod` scripts (via `dotenv-cli`)              | Production database — use with the awareness that changes are irreversible                          |

All three are git-ignored (`.gitignore`) and need to be created locally by hand (no one commits them).

`DIRECT_URL` next to `DATABASE_URL` is useful when the database sits behind a connection pooler (e.g. Neon, Supabase) — migrations and seeding then connect directly (`DIRECT_URL`), while the app connects through the pooler at runtime (`DATABASE_URL`).

## First-time local setup

1. **Install dependencies.**

   ```bash
   npm install
   ```

   After installation, `postinstall` → `prisma generate` runs automatically (see below), so the Prisma client is ready right away.

2. **Fill in `.env` and `.env.development`** with real values (at minimum `DATABASE_URL` pointing to your local/dev Postgres database, `RESEND_API_KEY`, and `INNGEST_DEV=1` if you want to use the local Inngest Dev Server).

3. **Migrate the development database** (see [Database migrations](#prisma--database-migrations)):

   ```bash
   npm run migrate:dev -- migration-name
   ```

4. **(Optional) seed the database with initial data** (see [Database seeding](#prisma--database-seeding)):

   ```bash
   npm run seed:dev
   ```

5. **Start the app:**

   ```bash
   npm run dev
   ```

6. **(Optional) run the Inngest Dev Server in a separate terminal**, if you're using features that send events through `inngest.send(...)` (see [Inngest](#inngest--local-dev-server)):

   ```bash
   npm run inngest:dev
   ```

## Prisma — generating the client

```bash
npx prisma generate
```

Generates the typed Prisma client (`generated/prisma`) from `prisma/schema.prisma`. You need to rerun it whenever the schema changes — in practice the `postinstall` script does this for you after every `npm install`, and `migrate:dev`/`migrate:deploy`/`migrate:prod` do it automatically too. Running it manually is useful when you edit `schema.prisma` without creating a new migration.

## Prisma — database migrations

A migration is a set of database schema changes saved as a SQL file in `prisma/migrations`.

**Locally (development environment)** — creates a new migration file based on the diff in `schema.prisma`, applies it to the dev database right away, and regenerates the Prisma client:

```bash
npm run migrate:dev -- migration-name
```

Use this only locally — it's the only script that actually *creates* new migrations.

**Applying existing migrations on a dev/staging environment** (e.g. after `git pull`, when someone else added a migration) — doesn't create new files, just replays what's already in `prisma/migrations`:

```bash
npm run migrate:deploy
```

**In production** — same idea as `migrate:deploy`, but targets `.env.production`. It only applies migrations already saved in `prisma/migrations`, nothing is created:

```bash
npm run migrate:prod
```

## Prisma — database seeding

Seeding fills the database with sample/initial data defined in `prisma/seed.ts`.

```bash
npm run seed:dev
```

```bash
npm run seed:prod
```

Run `seed:prod` very deliberately — it acts on the production database from `.env.production`.

## React Email — previewing email templates

```bash
npm run email
```

Opens a browser preview of the templates in `src/emails` (email verification, password reset, email change, welcome) without sending real messages.

## Inngest — local dev server

If `INNGEST_DEV=1` is set in `.env` or any `.env.*` file, the Inngest SDK sends
events to a local Inngest Dev Server (`http://localhost:8288`) instead of
Inngest Cloud. You must have it running locally, otherwise actions that call
`inngest.send(...)` (e.g. sign-up) will fail with a `fetch failed` error.

```bash
npm run inngest:dev
```

Run this alongside `npm run dev`.
