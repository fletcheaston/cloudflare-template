import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { requireAuth } from "@/lib/requireAuth";
import { $listNotes } from "@/lib/server/notes";
import { NoteForm } from "@/components/NoteForm";
import { NoteList } from "@/components/NoteList";
import { Button } from "@/components/ui/button";

const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
  const user = await requireAuth();
  return {
    id: user.id,
    email: user.email,
    displayName: user.displayName,
    avatarUrl: user.avatarUrl,
  };
});

export const Route = createFileRoute("/home")({
  loader: async () => {
    const [user, notes] = await Promise.all([getCurrentUser(), $listNotes()]);
    return { user, notes };
  },
  component: Home,
});

function Home() {
  const { user, notes } = Route.useLoaderData();
  const router = useRouter();

  return (
    <main className="mx-auto max-w-2xl px-4 py-12">
      <header className="mb-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt=""
              className="size-10 rounded-full"
            />
          ) : null}
          <div>
            <div className="font-medium">{user.displayName}</div>
            <div className="text-muted-foreground text-sm">{user.email}</div>
          </div>
        </div>
        <form method="POST" action="/auth/logout">
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </header>

      <section className="mb-10">
        <h2 className="mb-4 text-lg font-semibold">New note</h2>
        <NoteForm onCreated={() => router.invalidate()} />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Your notes</h2>
        <NoteList notes={notes} onDeleted={() => router.invalidate()} />
      </section>
    </main>
  );
}
