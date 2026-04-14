import type { DbClient, Env } from "./index";
import { getDb as getD1Db } from "./index";

export async function getDb(): Promise<DbClient> {
  try {
    const cf = (await import("cloudflare:workers" as string)) as {
      env: Env;
    };
    if (cf.env?.DB) {
      return getD1Db(cf.env);
    }
  } catch {
    // Not in Cloudflare Workers runtime — fall through to local dev
  }

  const { getLocalDb } = await import("./local");
  return (await getLocalDb()) as unknown as DbClient;
}
