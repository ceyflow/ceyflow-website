"use client";
import { showcaseStore } from "@/lib/showcaseData";

export default function ShowcaseCustomers() {
  const customers = showcaseStore.getCustomers();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Customers</h1>
        <p className="mt-1 text-sm text-slate-500">Everyone who has ordered from you.</p>
      </div>

      <div className="space-y-2 sm:hidden">
        {customers.map((c) => (
          <div key={c.id} className="rounded-lg border border-slate-200 bg-white p-3">
            <div className="flex items-center justify-between gap-2">
              <span className="truncate text-sm font-medium text-slate-900">{c.name}</span>
              <span className="flex-none text-xs text-slate-500">{c.totalOrders} order{c.totalOrders === 1 ? "" : "s"}</span>
            </div>
            <p className="mt-0.5 truncate text-xs text-slate-500">{c.phone} · {c.city}</p>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-xl border border-slate-200 bg-white sm:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-4 py-2.5">Name</th>
              <th className="border-b border-slate-200 px-4 py-2.5">Phone</th>
              <th className="border-b border-slate-200 px-4 py-2.5">City</th>
              <th className="border-b border-slate-200 px-4 py-2.5 text-right">Orders</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-4 py-2.5 font-medium text-slate-900">{c.name}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600">{c.phone}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600">{c.city}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-right text-slate-600">{c.totalOrders}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
