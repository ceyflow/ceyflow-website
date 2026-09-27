"use client";
import { useState } from "react";
import { submitInquiry } from "../../../lib/adminData";

export function ContactForm({ interest, message = "", options }: { interest: string; message?: string; options: string[] }) {
  const [ok, setOk] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (String(fd.get("website") || "")) { setOk(true); return; } // honeypot
    setPending(true);
    setError(undefined);
    const result = await submitInquiry({
      name: String(fd.get("name") || ""), company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""), phone: String(fd.get("phone") || ""),
      interest: String(fd.get("interest") || ""), message: String(fd.get("message") || ""),
    });
    setPending(false);
    if (result.ok) setOk(true); else setError(result.error);
  }

  if (ok) {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl font-bold">Thank you!</p>
        <p className="mt-2 text-slate-600">We have your message and will get back to you within one working day.</p>
      </div>
    );
  }
  return (
    <form onSubmit={handleSubmit} className="card space-y-4 p-6 md:p-8">
      <input type="text" name="website" className="hidden" tabIndex={-1} autoComplete="off" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label" htmlFor="name">Your name *</label><input id="name" name="name" className="input" required /></div>
        <div><label className="label" htmlFor="company">Business name</label><input id="company" name="company" className="input" /></div>
        <div><label className="label" htmlFor="email">Email</label><input id="email" name="email" type="email" className="input" /></div>
        <div><label className="label" htmlFor="phone">Phone / WhatsApp</label><input id="phone" name="phone" className="input" /></div>
      </div>
      <div>
        <label className="label" htmlFor="interest">I'm interested in</label>
        <select id="interest" name="interest" className="input" defaultValue={interest}>
          <option value="">Not sure yet</option>
          {options.map((o) => <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <div>
        <label className="label" htmlFor="message">Tell us about your business</label>
        <textarea id="message" name="message" rows={5} className="input" defaultValue={message} placeholder="What do you sell, how do orders come in, and what's slowing you down?" />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary w-full py-3 text-base" disabled={pending}>{pending ? "Sending..." : "Send message"}</button>
    </form>
  );
}
