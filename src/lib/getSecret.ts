import { getCfEnv } from "@/db/cf-env";

type SecretName = "GOOGLE_CLIENT_ID" | "GOOGLE_CLIENT_SECRET" | "SESSION_SECRET";

export function getSecret(name: SecretName): string {
  const cfEnv = getCfEnv();
  if (cfEnv && cfEnv[name]) {
    return cfEnv[name];
  }
  return process.env[name] ?? "";
}
