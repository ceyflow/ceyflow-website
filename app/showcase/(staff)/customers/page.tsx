"use client";
import { useState } from "react";
import { showcaseStore } from "@/lib/showcaseData";
import { nextToastId, SmsToast, type SmsToastMessage } from "@/components/showcase/SmsToast";

export default function ShowcaseCustomers() {
  const customers = showcaseStore.getCustomers();
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [message, setMessage] = useState("");
  const [toasts, setToasts] = useState<SmsToastMessage[]>([]);

  function toggle(id: number) {
    setSelected((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected((s) => (s.size === customers.length ? new Set() : new Set(customers.map((c) => c.id))));
  }

  function sendBroadcast() {
    if (!message.trim() || selected.size === 0) return;
    setToasts((ts) => [...ts, { id: nextToastId(), text: `Broadcast (simulated) sent to ${selected.size} customer${selected.size === 1 ? "" : "s"}: "${message.trim()}"` }]);
    setMessage("");
    setSelected(new Set());
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">Everyone who has ordered from you. Select a few to send a bulk SMS.</p>
      </div>

      {customers.length === 0 ? (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-400">No customers yet — they'll show up here once orders come in.</p>
      ) : (
        <>
      <div className="space-y-2 sm:hidden">
        {customers.map((c) => (
          <label key={c.id} className="flex items-center gap-3 rounded-lg border border-slate-200 bg-white p-3">
            <input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" />
            <span className="min-w-0 flex-1">
              <span className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-medium text-slate-900">{c.name}</span>
                <span className="flex-none text-xs text-slate-500">{c.totalOrders} order{c.totalOrders === 1 ? "" : "s"}</span>
              </span>
              <span className="mt-0.5 block truncate text-xs text-slate-500">{c.phone} · {c.city}</span>
            </span>
          </label>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-4 py-2.5"><input type="checkbox" checked={selected.size === customers.length} onChange={toggleAll} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" /></th>
              <th className="border-b border-slate-200 px-4 py-2.5">Name</th>
              <th className="border-b border-slate-200 px-4 py-2.5">Phone</th>
              <th className="border-b border-slate-200 px-4 py-2.5">City</th>
              <th className="border-b border-slate-200 px-4 py-2.5 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-4 py-2.5"><input type="checkbox" checked={selected.has(c.id)} onChange={() => toggle(c.id)} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400" /></td>
                <td className="border-b border-slate-100 px-4 py-2.5 font-medium text-slate-900">{c.name}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600">{c.phone}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600">{c.city}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-right text-slate-600">{c.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
        </>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-2 text-sm font-semibold text-slate-900">Bulk SMS {selected.size > 0 && <span className="font-normal text-slate-500">— {selected.size} selected</span>}</p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="e.g. We're open this Poya day — orders placed today ship tomorrow."
            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <button onClick={sendBroadcast} disabled={!message.trim() || selected.size === 0} className="flex-none rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">Send</button>
        </div>
      </div>

      <SmsToast toasts={toasts} onDismiss={(id) => setToasts((ts) => ts.filter((t) => t.id !== id))} />
    </div>
  );
}
