import { createFileRoute } from "@tanstack/react-router";

import { $handleCallback } from "@/lib/server/auth";

export const Route = createFileRoute("/auth/callback")({
  head: () => ({
    meta: [{ name: "robots", content: "noindex" }],
  }),
  loader: () => $handleCallback(),
});
