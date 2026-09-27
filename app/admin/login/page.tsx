"use client";
import { useActionState } from "react";
import { login, type LoginState } from "../../../lib/actions";
import { Logo } from "../../../components/Logo";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <p className="mb-6 text-center text-sm text-slate-500">Staff login</p>
        <form action={action} className="space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" autoFocus /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="input" /></div>
          {state.error && <p className="text-sm text-red-600">{state.error}</p>}
          <button className="btn-primary w-full py-2.5" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
