import { createFileRoute } from "@tanstack/react-router";

import { $logout } from "@/lib/server/auth";

export const Route = createFileRoute("/auth/logout")({
  loader: () => $logout(),
  component: () => null,
});
