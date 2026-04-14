# Removing auth

If your app doesn't need sign-in, you can strip the entire auth layer. It's
scoped tightly enough that the deletion is mechanical.

## Files to delete

```
src/lib/auth.ts
src/lib/session.ts
src/lib/getSecret.ts
src/lib/requireAuth.ts
src/lib/server/auth.ts
src/routes/auth/google.tsx
src/routes/auth/callback.tsx
src/routes/auth/logout.tsx
```

The `src/routes/auth/` directory will be empty; delete it too.

## Schema changes

In `src/db/schema.ts`, delete:

- the `users` table
- the `sessions` table
- the `userId` column on `notes` (or whatever tables you kept)
- the `User` and `Session` type exports

Then regenerate the migration:

```bash
npm run db:generate
```

## Code changes

### `src/db/index.ts`
Remove the Google/session secrets from the `Env` type:

```ts
export type Env = {
  DB: D1Database;
};
```

### `src/lib/server/notes.ts` (and any other server-fn file)
Drop the `requireAuth()` calls and the `userId` filters. Server functions
become a plain DB access layer.

### `src/routes/index.tsx`
Replace the auth check + redirect with whatever your landing page should
render. If you still have a `/home` route, either merge it into `/` or
delete it.

### `src/routes/home.tsx`
Delete the user-header block and the `getCurrentUser` server function. The
logout `<form>` goes too.

### `wrangler.jsonc`
You can remove these secrets from your Cloudflare configuration:

```bash
wrangler secret delete GOOGLE_CLIENT_ID
wrangler secret delete GOOGLE_CLIENT_SECRET
wrangler secret delete SESSION_SECRET
```

### `.env.example` and `.env.local`
Delete the three `GOOGLE_*` / `SESSION_SECRET` lines.

### `package.json`
Remove `arctic` from `dependencies`, then `npm install`.

## Sanity check

```bash
npm run build
npm test
```

A successful build confirms no stale imports remain.
