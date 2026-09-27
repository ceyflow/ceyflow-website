"use client";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "./supabaseClient";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  return { session, loading };
}

export async function signIn(email: string, password: string) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return error ? error.message : null;
}

export async function signOut() {
  await supabase.auth.signOut();
}

export async function changePassword(email: string, current: string, next: string) {
  // Supabase's updateUser() doesn't re-check the current password on its own,
  // so we confirm it the same way sign-in does before applying the change.
  const check = await supabase.auth.signInWithPassword({ email, password: current });
  if (check.error) return "Current password is incorrect.";
  const { error } = await supabase.auth.updateUser({ password: next });
  return error ? error.message : null;
}
