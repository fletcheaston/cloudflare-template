import type { Env } from "./index";

let _env: Env | null = null;

export function setCfEnv(env: Env) {
  _env = env;
}

export function getCfEnv(): Env | null {
  return _env;
}
