/**
 * backend-warmup.ts
 *
 * Render free-tier services spin down after ~15 min of inactivity.
 * These utilities detect that and wake the server up automatically.
 */

/** Ping the backend root. Returns true if reachable, false if sleeping/down. */
const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

export async function pingBackend(): Promise<boolean> {
  if (!apiUrl || typeof window === "undefined") return true;
  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      signal: AbortSignal.timeout(5_000),
      mode: "no-cors", // avoids CORS errors; an opaque response = server is up
    });
    // With no-cors, response.type === "opaque" but no throw = server responded
    return res.type === "opaque" || res.ok;
  } catch {
    return false;
  }
}

/** Open the backend URL in a named background tab to wake it up on Render. */
export function openBackendTab() {
  if (apiUrl && typeof window !== "undefined") {
    window.open(apiUrl, "backend-warmup-tab");
  }
}
