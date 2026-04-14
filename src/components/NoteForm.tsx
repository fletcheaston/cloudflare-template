import { useState } from "react";

import { useForm } from "@tanstack/react-form";

import { z } from "zod";

import { $createNote } from "@/lib/server/notes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const schema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  body: z.string().max(10_000).default(""),
});

export function NoteForm({ onCreated }: { onCreated: () => void }) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: { title: "", body: "" },
    validators: { onChange: schema },
    onSubmit: async ({ value, formApi }) => {
      setError(null);
      try {
        await $createNote({ data: value });
        formApi.reset();
        onCreated();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create note");
      }
    },
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="space-y-4"
    >
      <form.Field name="title">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Title</Label>
            <Input
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="A short title"
            />
            {field.state.meta.errors.length > 0 ? (
              <p className="text-destructive text-sm">
                {field.state.meta.errors
                  .map((e) => (typeof e === "string" ? e : e?.message))
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field name="body">
        {(field) => (
          <div className="space-y-2">
            <Label htmlFor={field.name}>Body</Label>
            <Textarea
              id={field.name}
              name={field.name}
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              placeholder="Optional body text"
              rows={4}
            />
          </div>
        )}
      </form.Field>

      {error ? <p className="text-destructive text-sm">{error}</p> : null}

      <form.Subscribe selector={(s) => [s.canSubmit, s.isSubmitting]}>
        {([canSubmit, isSubmitting]) => (
          <Button type="submit" disabled={!canSubmit}>
            {isSubmitting ? "Saving…" : "Save note"}
          </Button>
        )}
      </form.Subscribe>
    </form>
  );
}
