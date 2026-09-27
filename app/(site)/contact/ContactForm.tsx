"use client";
import { useActionState } from "react";
import { submitInquiry, type ContactState } from "./actions";

export function ContactForm({ interest, message = "", options }: { interest: string; message?: string; options: string[] }) {
  const [state, action, pending] = useActionState<ContactState, FormData>(submitInquiry, { ok: false });
  if (state.ok) {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl font-bold">Thank you!</p>
        <p className="mt-2 text-slate-600">We have your message and will get back to you within one working day.</p>
      </div>
    );
  }
  return (
    <form action={action} className="card space-y-4 p-6 md:p-8">
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
      {state.error && <p className="text-sm text-red-600">{state.error}</p>}
      <button className="btn-primary w-full py-3 text-base" disabled={pending}>{pending ? "Sending..." : "Send message"}</button>
    </form>
  );
}
