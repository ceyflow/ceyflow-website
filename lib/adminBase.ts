"use client";

// The admin UI is served twice: the real, login-gated /admin/* tree, and the
// public, login-free /demo/* sandbox (see lib/mockSupabaseClient.ts). Both
// trees reuse the exact same page components, so any in-page navigation
// (router.push, <Link>, <a>) must resolve to whichever base it's currently
// running under instead of a hardcoded "/admin".
export function adminBase(): string {
  if (typeof window === "undefined") return "/admin";
  return window.location.pathname.split("/").includes("demo") ? "/demo" : "/admin";
}
