import { createClient } from "@supabase/supabase-js";
import { mockSupabase } from "./mockSupabaseClient";

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

const realSupabase = createClient(url || "https://placeholder.supabase.co", anonKey || "placeholder-anon-key", {
  auth: { persistSession: true, autoRefreshToken: true },
});

// /demo/* is a public, login-free sandbox for showing prospects a fully working
// admin without touching real data — it runs entirely on the in-memory mock
// client instead of Supabase. `window` is undefined during the static export's
// build-time prerender, so this always resolves to the real client there (the
// prerendered shell is empty anyway; every admin/demo page is "use client" and
// only reads data after hydration, when `window` is available).
const isDemo = typeof window !== "undefined" && window.location.pathname.split("/").includes("demo");

export const supabase = (isDemo ? mockSupabase : realSupabase) as typeof realSupabase;
