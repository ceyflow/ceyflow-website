"use client";
import { useState } from "react";
import { HYGIENE_CHECKLIST_LABELS, showcaseStore } from "@/lib/showcaseData";
import { useShowcaseBatches } from "@/lib/useShowcaseOrders";
import { useShowcaseStaff } from "@/lib/showcaseStaffContext";
import { BatchStagePill } from "@/components/showcase/Pills";
import { LiveElapsed } from "@/components/showcase/LiveElapsed";

export default function ShowcaseProduction() {
  const batches = useShowcaseBatches();
  const { staff } = useShowcaseStaff();
  const canPack = staff.role === "Admin" || staff.role === "Packer";
  const [form, setForm] = useState({ item: "", qty: "1", notes: "" });

  function startBatch(e: React.FormEvent) {
    e.preventDefault();
    if (!form.item.trim()) return;
    showcaseStore.addBatch({ item: form.item.trim(), qty: Number(form.qty) || 1, notes: form.notes.trim() });
    setForm({ item: "", qty: "1", notes: "" });
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Production batches</h1>
        <p className="mt-1 text-sm text-slate-500">Hamper assembly, tracked from raw components to dispatch-ready.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {batches.map((b) => {
          const isFinal = b.stage >= 3;
          const nextLabel = ["Start assembling", "Send for hygiene & QC", "Mark ready for dispatch"][b.stage];
          return (
            <div key={b.id} className="rounded-xl border border-slate-200 bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-xs font-medium text-slate-400">{b.batchNumber}</p>
                  <p className="font-display text-base font-bold text-slate-900">{b.item} × {b.qty}</p>
                </div>
                <BatchStagePill stage={b.stage} />
              </div>
              <p className="mt-2 text-xs text-slate-500">
                In this stage for <LiveElapsed since={b.stageStartedAt} className="font-semibold text-slate-700" /> · started <LiveElapsed since={b.startedAt} className="font-semibold text-slate-700" /> ago
              </p>
              {b.notes && <p className="mt-2 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">{b.notes}</p>}

              <div className="mt-3 rounded-lg border border-slate-100 p-3">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-400">
                  Hygiene &amp; QC checklist {!canPack && <span className="normal-case text-slate-400">(packers &amp; admin only)</span>}
                </p>
                <ul className="space-y-1.5">
                  {HYGIENE_CHECKLIST_LABELS.map((label, i) => (
                    <li key={label}>
                      <label className={`flex items-center gap-2 text-xs ${canPack ? "cursor-pointer text-slate-700" : "cursor-not-allowed text-slate-400"}`}>
                        <input
                          type="checkbox"
                          checked={b.checklist[i]}
                          disabled={!canPack}
                          onChange={() => showcaseStore.toggleBatchChecklistItem(b.id, i)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 disabled:opacity-50"
                        />
                        <span className={b.checklist[i] ? "line-through decoration-slate-400" : ""}>{label}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {!isFinal && (
                <button
                  onClick={() => showcaseStore.advanceBatch(b.id)}
                  className="mt-3 w-full rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {nextLabel} →
                </button>
              )}
            </div>
          );
        })}
      </div>

      <form onSubmit={startBatch} className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">Start a new batch</p>
        <div className="grid gap-2 sm:grid-cols-[1fr_100px]">
          <input
            value={form.item}
            onChange={(e) => setForm((f) => ({ ...f, item: e.target.value }))}
            placeholder="e.g. Gift hamper — Classic (large)"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
          <input
            value={form.qty}
            onChange={(e) => setForm((f) => ({ ...f, qty: e.target.value }))}
            type="number"
            min={1}
            placeholder="Qty"
            className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
          />
        </div>
        <input
          value={form.notes}
          onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
          placeholder="Notes (optional)"
          className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
        />
        <button type="submit" disabled={!form.item.trim()} className="mt-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-40">Start batch</button>
      </form>
    </div>
  );
}
