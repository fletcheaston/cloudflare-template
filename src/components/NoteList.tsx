import type { Note } from "@/db/schema";
import { $deleteNote } from "@/lib/server/notes";
import { Button } from "@/components/ui/button";

export function NoteList({
  notes,
  onDeleted,
}: {
  notes: Note[];
  onDeleted: () => void;
}) {
  if (notes.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        No notes yet. Create one above.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {notes.map((note) => (
        <li
          key={note.id}
          className="bg-card rounded-md border p-4 shadow-xs"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h3 className="font-medium">{note.title}</h3>
              {note.body ? (
                <p className="text-muted-foreground mt-1 text-sm whitespace-pre-wrap">
                  {note.body}
                </p>
              ) : null}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={async () => {
                await $deleteNote({ data: { id: note.id } });
                onDeleted();
              }}
            >
              Delete
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
