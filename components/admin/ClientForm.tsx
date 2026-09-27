"use client";
import { saveClient, type ClientState } from "../../lib/actions";
import { SubmitButton } from "./SubmitButton";
import type { Client } from "../../lib/db";
import { useActionState } from "react";

export function ClientForm({ client }: { client?: Client }) {
  const [state, action] = useActionState<ClientState, FormData>(saveClient, {});
  return (
    <form action={action} className="card max-w-2xl space-y-4 p-6">
      {client && <input type="hidden" name="id" value={client.id} />}
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Name *</label><input name="name" defaultValue={client?.name} required className="input" /></div>
        <div><label className="label">Company</label><input name="company" defaultValue={client?.company} className="input" /></div>
        <div><label className="label">Email</label><input name="email" type="email" defaultValue={client?.email} className="input" /></div>
        <div><label className="label">Phone</label><input name="phone" defaultValue={client?.phone} className="input" /></div>
      </div>
      <div><label className="label">Address</label><input name="address" defaultValue={client?.address} className="input" /></div>
      <div><label className="label">Notes</label><textarea name="notes" defaultValue={client?.notes} rows={3} className="input" /></div>
      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      <SubmitButton>{client ? "Save changes" : "Create client"}</SubmitButton>
    </form>
  );
}
