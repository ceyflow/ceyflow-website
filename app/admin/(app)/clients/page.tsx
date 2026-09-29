"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getClients, getDocuments, deleteClient, type Client, type DocWithTotals } from "../../../../lib/adminData";
import { adminBase } from "../../../../lib/adminBase";

export default function ClientsPage() {
  const base = adminBase();
  const [clients, setClients] = useState<Client[]>([]);
  const [invoices, setInvoices] = useState<DocWithTotals[]>([]);

  useEffect(() => {
    getClients().then(setClients);
    getDocuments("invoice").then(setInvoices);
  }, []);

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    try {
      await deleteClient(id);
      setClients((cs) => cs.filter((c) => c.id !== id));
    } catch {
      alert("Couldn't delete this client — they have quotations or invoices. Remove those first.");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Clients</h1>
        <Link href={`${base}/clients/new`} className="btn-primary">New client</Link>
      </div>
      <div className="card overflow-x-auto">
        {clients.length === 0 ? (
          <p className="p-8 text-center text-sm text-slate-500">No clients yet. Add one, or convert a website inquiry.</p>
        ) : (
          <table className="table">
            <thead><tr><th>Name</th><th>Company</th><th>Contact</th><th className="text-right">Outstanding</th><th></th></tr></thead>
            <tbody>
              {clients.map((c) => {
                const owed = invoices.filter((i) => i.client_id === c.id && i.status !== "void").reduce((a, i) => a + i.balance, 0);
                return (
                  <tr key={c.id}>
                    <td><Link href={`${base}/clients/view?id=${c.id}`} className="font-medium text-brand-700 hover:underline">{c.name}</Link></td>
                    <td className="text-slate-600">{c.company}</td>
                    <td className="text-slate-600">{c.email || c.phone}</td>
                    <td className={`text-right ${owed > 0 ? "font-medium text-amber-700" : "text-slate-400"}`}>
                      {owed > 0 ? owed.toLocaleString("en-LK", { minimumFractionDigits: 2 }) : "—"}
                    </td>
                    <td className="text-right">
                      <button onClick={() => handleDelete(c.id, c.name)} className="text-slate-400 hover:text-red-600" aria-label={`Delete ${c.name}`}>✕</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
