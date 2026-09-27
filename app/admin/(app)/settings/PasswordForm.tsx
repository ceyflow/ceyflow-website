"use client";
import { useState } from "react";
import { changePassword, useSession } from "../../../../lib/authClient";

export function PasswordForm() {
  const { session } = useSession();
  const [error, setError] = useState<string | undefined>();
  const [ok, setOk] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!session?.user.email) return;
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(undefined);
    setOk(false);
    const err = await changePassword(session.user.email, String(fd.get("current") || ""), String(fd.get("next") || ""));
    setPending(false);
    if (err) setError(err);
    else { setOk(true); e.currentTarget.reset(); }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-md space-y-4 p-6">
      <p className="font-semibold">Change password</p>
      <div><label className="label">Current password</label><input name="current" type="password" required className="input" /></div>
      <div><label className="label">New password</label><input name="next" type="password" required minLength={6} className="input" /></div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      {ok && <p className="text-sm text-emerald-600">Password updated.</p>}
      <button className="btn-secondary" disabled={pending} type="submit">{pending ? "Saving..." : "Update password"}</button>
    </form>
  );
}
