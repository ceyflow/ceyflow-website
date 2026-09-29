"use client";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClient, getDocuments, deleteClient, type Client, type DocWithTotals } from "../../../../../lib/adminData";
import { ClientForm } from "../../../../../components/admin/ClientForm";
import { Badge } from "../../../../../components/admin/Badge";
import { money, date } from "../../../../../lib/format";
import { adminBase } from "../../../../../lib/adminBase";

function ClientView() {
  const base = adminBase();
  const id = Number(useSearchParams().get("id"));
  const router = useRouter();
  const [client, setClient] = useState<Client | undefined | null>(null);
  const [docs, setDocs] = useState<DocWithTotals[]>([]);

  useEffect(() => {
    getClient(id).then((c) => setClient(c ?? undefined));
    Promise.all([getDocuments("quote"), getDocuments("invoice")]).then(([quotes, invoices]) => {
      setDocs([...quotes, ...invoices].filter((d) => d.client_id === id).sort((a, b) => (a.issue_date < b.issue_date ? 1 : -1)));
    });
  }, [id]);

  if (client === null) return null;
  if (client === undefined) return <p className="text-sm text-slate-500">Client not found.</p>;

  async function handleDelete() {
    if (!confirm("Delete this client? This cannot be undone.")) return;
    try {
      await deleteClient(client!.id);
      router.push(`${base}/clients`);
    } catch {
      alert("Couldn't delete this client — they have quotations or invoices. Remove those first.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">{client.name}</h1>
        <button onClick={handleDelete} className="btn-danger btn-sm">Delete client</button>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ClientForm client={client} />
        <div className="card p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Quotations & invoices</p>
            <div className="flex gap-2">
              <Link href={`${base}/quotes/new?client=${client.id}`} className="btn-secondary btn-sm">New quote</Link>
              <Link href={`${base}/invoices/new?client=${client.id}`} className="btn-primary btn-sm">New invoice</Link>
            </div>
          </div>
          {docs.length === 0 ? (
            <p className="py-6 text-center text-sm text-slate-500">No documents yet for this client.</p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {docs.map((d) => (
                <li key={`${d.type}-${d.id}`} className="flex items-center justify-between py-2.5 text-sm">
                  <div>
                    <Link href={`${base}/${d.type}s/view?id=${d.id}`} className="font-medium text-brand-700 hover:underline">{d.number}</Link>
                    <span className="ml-2 text-xs text-slate-500 capitalize">{d.type}</span>
                    <p className="text-xs text-slate-500">{date(d.issue_date)}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{money(d.total)}</span>
                    <Badge value={d.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ClientPage() {
  return (
    <Suspense>
      <ClientView />
    </Suspense>
  );
}
