import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { getSessionCookie, getSessionUser } from "@/lib/session";

const getAuthState = createServerFn({ method: "GET" }).handler(async () => {
  const request = getRequest();
  const sessionId = getSessionCookie(request);
  if (!sessionId) return { authenticated: false as const };

  const { getDb } = await import("@/db/getDb");
  const db = await getDb();
  const user = await getSessionUser(db, sessionId);
  if (!user) return { authenticated: false as const };

  return { authenticated: true as const };
});

export const Route = createFileRoute("/")({
  loader: async () => {
    const auth = await getAuthState();
    if (auth.authenticated) {
      throw redirect({ to: "/home" });
    }
    return auth;
  },
  component: Landing,
});

function Landing() {
  return (
    <main className="mx-auto flex min-h-[80dvh] max-w-xl flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="mb-4 text-5xl font-bold tracking-tight">__APP_NAME__</h1>
      <p className="text-muted-foreground mb-10 text-lg">
        A Cloudflare Workers app scaffolded from a template.
      </p>
      <a
        href="/auth/google"
        className="bg-primary text-primary-foreground hover:bg-primary/90 inline-block rounded-md px-6 py-3 text-sm font-medium shadow-sm transition"
      >
        Sign in with Google
      </a>
    </main>
  );
}
