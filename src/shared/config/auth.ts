/** Base URL for auth endpoints (no trailing slash). */
export const AUTH_API_BASE =
  process.env.NEXT_PUBLIC_AUTH_API_BASE ??
  "https://origo-api.fly.dev/api/v1";

/**
 * When true (default), register/login are simulated locally with a fake JWT.
 * Set `NEXT_PUBLIC_AUTH_MOCK=false` to call the real API.
 */
export const AUTH_USE_MOCK =
  process.env.NEXT_PUBLIC_AUTH_MOCK !== "false";
