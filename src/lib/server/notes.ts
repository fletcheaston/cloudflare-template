import { createServerFn } from "@tanstack/react-start";

import { and, desc, eq } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db/getDb";
import { notes } from "@/db/schema";
import { requireAuth } from "@/lib/requireAuth";

const createNoteSchema = z.object({
  title: z.string().min(1).max(200),
  body: z.string().max(10_000).default(""),
});

const deleteNoteSchema = z.object({
  id: z.string().min(1),
});

export const $listNotes = createServerFn({ method: "GET" }).handler(async () => {
  const user = await requireAuth();
  const db = await getDb();
  return db
    .select()
    .from(notes)
    .where(eq(notes.userId, user.id))
    .orderBy(desc(notes.createdAt))
    .all();
});

export const $createNote = createServerFn({ method: "POST" })
  .inputValidator(createNoteSchema)
  .handler(async ({ data }) => {
    const user = await requireAuth();
    const db = await getDb();
    const id = crypto.randomUUID();
    await db.insert(notes).values({
      id,
      userId: user.id,
      title: data.title,
      body: data.body,
    });
    return { id };
  });

export const $deleteNote = createServerFn({ method: "POST" })
  .inputValidator(deleteNoteSchema)
  .handler(async ({ data }) => {
    const user = await requireAuth();
    const db = await getDb();
    await db
      .delete(notes)
      .where(and(eq(notes.id, data.id), eq(notes.userId, user.id)));
    return { ok: true };
  });
