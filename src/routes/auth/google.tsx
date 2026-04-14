import { createFileRoute } from "@tanstack/react-router";

import { $initiateGoogleAuth } from "@/lib/server/auth";

export const Route = createFileRoute("/auth/google")({
  loader: () => $initiateGoogleAuth(),
});
