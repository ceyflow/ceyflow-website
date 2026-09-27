import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

if (!url || !anonKey) {
  // createClient() throws on an empty URL, and this module is evaluated during
  // the static export's server-side prerender pass, so a missing env var here
  // would fail the whole build rather than just the (browser-only) network call
  // that actually needs it. Fall back to a placeholder so the build succeeds;
  // the real GitHub Actions build always has the real values baked in instead.
  console.warn("NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set — using a placeholder.");
}

export const supabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true },
});
