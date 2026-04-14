# __APP_NAME__

<!--
  Stub. Fill this in with context Claude Code should know every time it opens
  this repo: the product's purpose, the stack, key invariants, who the users
  are, and anything non-obvious about the architecture.

  Template ships with:
  - TanStack Start (React 19) + TanStack Router, server functions via `createServerFn`
  - Cloudflare Workers runtime, Wrangler for deploy
  - D1 (SQLite) in prod, better-sqlite3 locally; Drizzle ORM for both
  - Arctic + Google OAuth for sign-in, cookie-backed sessions
  - Tailwind v4 + Radix primitives (shadcn-style) for UI

  Invariants worth stating to Claude:
  - Every query that touches user data must be scoped by `userId`
  - Server functions live in `src/lib/server/` and are the only boundary that
    talks to the DB
  - Secrets are read via `getSecret(...)`, which falls back between Cloudflare
    env bindings and `process.env`
-->
