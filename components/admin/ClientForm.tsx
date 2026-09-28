"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveClient, type Client } from "../../lib/adminData";

export function ClientForm({ client }: { client?: Client }) {
  const [error, setError] = useState<string | undefined>();
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setPending(true);
    setError(undefined);
    const result = await saveClient({
      id: client?.id,
      name: String(fd.get("name") || ""),
      company: String(fd.get("company") || ""),
      email: String(fd.get("email") || ""),
      phone: String(fd.get("phone") || ""),
      address: String(fd.get("address") || ""),
      notes: String(fd.get("notes") || ""),
    });
    setPending(false);
    if (result.error) { setError(result.error); return; }
    if (!client) router.push(`/admin/clients/view?id=${result.id}`);
    else router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-2xl space-y-4 p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><label className="label">Name *</label><input name="name" defaultValue={client?.name} required className="input" /></div>
        <div><label className="label">Company</label><input name="company" defaultValue={client?.company} className="input" /></div>
        <div><label className="label">Email</label><input name="email" type="email" defaultValue={client?.email} className="input" /></div>
        <div><label className="label">Phone</label><input name="phone" defaultValue={client?.phone} className="input" /></div>
      </div>
      <div><label className="label">Address</label><input name="address" defaultValue={client?.address} className="input" /></div>
      <div><label className="label">Notes</label><textarea name="notes" defaultValue={client?.notes} rows={3} className="input" /></div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button className="btn-primary" disabled={pending} type="submit">{pending ? "Saving..." : client ? "Save changes" : "Create client"}</button>
    </form>
  );
}
