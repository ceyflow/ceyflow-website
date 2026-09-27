"use client";
import { useEffect, useState } from "react";
import { supabase } from "./supabaseClient";
import { SEED_PACKAGES, SEED_BUNDLES, SEED_SETTINGS } from "./seed-data";

export type Package = {
  id: number; slug: string; name: string; tagline: string; solves: string; best_for: string;
  description: string; features: string[]; timeline: string; note: string;
  setup_fee: number | null; monthly_fee: number | null; sort: number; active: boolean;
};
export type Bundle = {
  id: number; name: string; includes: string; description: string;
  setup_fee: number | null; monthly_fee: number | null; highlight: boolean; sort: number;
};
export type Settings = Record<string, string>;

// Bundled with the page (no network) so first paint always shows real content,
// even before the Supabase fetch below resolves — and if it never does (offline,
// misconfigured project), the site still reads correctly instead of showing blanks.
const FALLBACK_PACKAGES: Package[] = SEED_PACKAGES.map((p, i) => ({
  id: i + 1, slug: p.slug, name: p.name, tagline: p.tagline, solves: p.solves, best_for: p.bestFor,
  description: p.description, features: p.features, timeline: p.timeline, note: p.note,
  setup_fee: null, monthly_fee: null, sort: i, active: true,
}));
const FALLBACK_BUNDLES: Bundle[] = SEED_BUNDLES.map((b, i) => ({
  id: i + 1, name: b.name, includes: b.includes, description: b.description,
  setup_fee: null, monthly_fee: null, highlight: b.highlight, sort: i,
}));
const FALLBACK_SETTINGS: Settings = { ...SEED_SETTINGS };

export function usePackages(onlyActive = true) {
  const [packages, setPackages] = useState<Package[]>(() =>
    onlyActive ? FALLBACK_PACKAGES.filter((p) => p.active) : FALLBACK_PACKAGES
  );
  useEffect(() => {
    let cancelled = false;
    supabase.from("packages").select("*").order("sort").then(({ data, error }) => {
      if (cancelled || error || !data) return;
      const rows = data as Package[];
      setPackages(onlyActive ? rows.filter((p) => p.active) : rows);
    });
    return () => { cancelled = true; };
  }, [onlyActive]);
  return packages;
}

export function useBundles() {
  const [bundles, setBundles] = useState<Bundle[]>(FALLBACK_BUNDLES);
  useEffect(() => {
    let cancelled = false;
    supabase.from("bundles").select("*").order("sort").then(({ data, error }) => {
      if (!cancelled && !error && data) setBundles(data as Bundle[]);
    });
    return () => { cancelled = true; };
  }, []);
  return bundles;
}

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(FALLBACK_SETTINGS);
  useEffect(() => {
    let cancelled = false;
    supabase.from("settings").select("key, value").then(({ data, error }) => {
      if (cancelled || error || !data) return;
      setSettings(Object.fromEntries((data as { key: string; value: string }[]).map((r) => [r.key, r.value])));
    });
    return () => { cancelled = true; };
  }, []);
  return settings;
}
