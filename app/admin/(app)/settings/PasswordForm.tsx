"use client";
import { useActionState } from "react";
import { changePassword, type PasswordState } from "../../../../lib/actions";
import { SubmitButton } from "../../../../components/admin/SubmitButton";

export function PasswordForm() {
  const [state, action] = useActionState<PasswordState, FormData>(changePassword, {});
  return (
    <form action={action} className="card max-w-md space-y-4 p-6">
      <p className="font-semibold">Change password</p>
      <div><label className="label">Current password</label><input name="current" type="password" required className="input" /></div>
      <div><label className="label">New password</label><input name="next" type="password" required minLength={6} className="input" /></div>
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state.ok && <p className="text-sm text-emerald-600">Password updated.</p>}
      <SubmitButton className="btn-secondary">Update password</SubmitButton>
    </form>
  );
}
