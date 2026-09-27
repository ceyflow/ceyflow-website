"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "../../../lib/authClient";
import { Logo } from "../../../components/Logo";

export default function LoginPage() {
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(undefined);
    const err = await signIn(String(fd.get("email") || ""), String(fd.get("password") || ""));
    setPending(false);
    if (err) setError("Incorrect email or password.");
    else router.replace("/admin");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="card w-full max-w-sm p-8">
        <div className="mb-6 flex justify-center"><Logo /></div>
        <p className="mb-6 text-center text-sm text-slate-500">Staff login</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" required className="input" autoFocus /></div>
          <div><label className="label" htmlFor="password">Password</label><input id="password" name="password" type="password" required className="input" /></div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full py-2.5" disabled={pending}>{pending ? "Signing in..." : "Sign in"}</button>
        </form>
      </div>
    </div>
  );
}
