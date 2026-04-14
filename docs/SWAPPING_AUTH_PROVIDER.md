# Swapping the OAuth provider

Arctic exposes a uniform API across providers, so swapping Google for
GitHub, Apple, Discord, etc. is a small, bounded change.

## 1. Install the provider (if needed)

Arctic ships all provider classes in the single `arctic` package that's
already installed. No extra install needed.

## 2. Update `src/lib/auth.ts`

Change the class name, the secret names, and the scopes. For GitHub:

```ts
import { GitHub } from "arctic";

export function getGitHubOAuth(env: {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
}) {
  const baseUrl = process.env.VITE_BASE_URL ?? "http://localhost:3000";
  return new GitHub(
    env.GITHUB_CLIENT_ID,
    env.GITHUB_CLIENT_SECRET,
    `${baseUrl}/auth/callback`,
  );
}
```

## 3. Update `src/lib/server/auth.ts`

Replace `getGoogleOAuth` with `getGitHubOAuth`, swap the scopes, and update
how you derive user identity from the provider response.

Google gives you a signed ID token with `sub`, `email`, `name`, and
`picture` — no extra network call. GitHub doesn't return an ID token; you
need to call the GitHub API with the access token to fetch profile + email:

```ts
const tokens = await github.validateAuthorizationCode(code);
const userResponse = await fetch("https://api.github.com/user", {
  headers: { Authorization: `Bearer ${tokens.accessToken()}` },
});
const profile = await userResponse.json();
// profile.id, profile.login, profile.email, profile.avatar_url, ...
```

Read the provider docs at <https://arcticjs.dev> for each provider's
specific shape.

## 4. Update the schema

In `src/db/schema.ts`, rename `googleSub` to match the new provider (e.g.
`githubId`, `appleSub`). Then regenerate:

```bash
npm run db:generate
```

## 5. Update secret names

Rename the secrets in:

- `src/lib/getSecret.ts` — the `SecretName` union
- `.env.example`, `.env.local`
- Cloudflare secrets: `wrangler secret put GITHUB_CLIENT_ID`, etc.
- `src/db/index.ts` — the `Env` type

## 6. Update the landing page

In `src/routes/index.tsx`, change the href and button text:

```tsx
<a href="/auth/github">Sign in with GitHub</a>
```

Rename `src/routes/auth/google.tsx` → `src/routes/auth/github.tsx`.

## 7. Update provider redirect URI

Register the new redirect URI in the provider's developer console:

- Local: `http://localhost:3000/auth/callback`
- Prod: `https://__APP_NAME__.fletcheaston.com/auth/callback`

## Multiple providers

If you want to support more than one provider at once, duplicate the
`$initiateXxxAuth` server function and the `src/routes/auth/<provider>.tsx`
route for each. The `/auth/callback` route can dispatch on a `provider`
query parameter or a separate callback path per provider.
