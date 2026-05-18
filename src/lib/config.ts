export const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8050"
).replace(/\/$/, "");

export const AUTH_URL = (
  process.env.NEXT_PUBLIC_AUTH_URL || "https://auth.marketmaker.cc/api/v1"
).replace(/\/$/, "");

/** Service name used in JWT `services` claim for this app. */
export const SERVICE_NAME = "popularity";
