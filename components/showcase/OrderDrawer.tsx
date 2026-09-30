"use client";
import { useState } from "react";
import { CHECKLIST_LABELS, ORDER_STAGES, showcaseStore, smsTemplateFor, type ShowcaseOrder } from "@/lib/showcaseData";
import { useShowcaseStaff } from "@/lib/showcaseStaffContext";
import { StagePill, PriorityPill } from "./Pills";
import { DeliveryTracker, CourierTimeline } from "./DeliveryTracker";
import { nextToastId, type SmsToastMessage } from "./SmsToast";

export function OrderDrawer({
  order, onClose, onSms,
}: {
  order: ShowcaseOrder;
  onClose: () => void;
  onSms: (toast: SmsToastMessage) => void;
}) {
  const { staff } = useShowcaseStaff();
  const [noteDraft, setNoteDraft] = useState("");
  const isFinal = order.stage >= 3;
  const nextLabel = order.stage === 0 ? "Start processing" : order.stage === 1 ? "Mark invoiced & checked" : "Mark picked up by delivery";
  const canPack = staff.role === "Admin" || staff.role === "Packer";

  function advance() {
    const result = showcaseStore.advanceStage(order.id);
    if (result?.smsSent) {
      onSms({ id: nextToastId(), text: smsTemplateFor(result.order, result.order.stage) });
    }
  }

  function submitNote(e: React.FormEvent) {
    e.preventDefault();
    showcaseStore.addTeamNote(order.id, staff.name, noteDraft);
    setNoteDraft("");
  }

  return (
    <div className="fixed inset-0 z-40">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-white shadow-2xl">
        <div className="bg-gradient-to-br from-indigo-700 to-indigo-500 px-5 py-5 text-white">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-indigo-100">{order.orderNumber}</p>
              <h2 className="mt-0.5 font-display text-lg font-bold">{order.customerName}</h2>
            </div>
            <button onClick={onClose} className="rounded-full p-1 text-indigo-100 hover:bg-white/10 hover:text-white" aria-label="Close">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
            </button>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <StagePill stage={order.stage} />
            <PriorityPill priority={order.priority} />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          <div className="rounded-lg border border-slate-200 p-4">
            <DeliveryTracker order={order} />
            <CourierTimeline order={order} />
          </div>

          <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Product</dt><dd className="mt-0.5 text-slate-700">{order.product} × {order.qty}</dd></div>
            <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Phone</dt><dd className="mt-0.5 text-slate-700">{order.phone}</dd></div>
            <div className="col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Delivery address</dt><dd className="mt-0.5 text-slate-700">{order.address}</dd></div>
            {order.trackingNumber && (
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Tracking #</dt><dd className="mt-0.5 text-slate-700">{order.trackingNumber}</dd></div>
            )}
            {order.notes && (
              <div className="col-span-2"><dt className="text-xs font-semibold uppercase tracking-wide text-slate-400">Notes</dt><dd className="mt-0.5 text-slate-700">{order.notes}</dd></div>
            )}
          </dl>

          {!isFinal && (
            <div className="mt-5 rounded-lg border border-slate-200 p-4">
              <p className="mb-2.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Production checklist {!canPack && <span className="normal-case text-slate-400">(packers &amp; admin only)</span>}
              </p>
              <ul className="space-y-2">
                {CHECKLIST_LABELS.map((label, i) => (
                  <li key={label}>
                    <label className={`flex items-center gap-2.5 text-sm ${canPack ? "cursor-pointer text-slate-700" : "cursor-not-allowed text-slate-400"}`}>
                      <input
                        type="checkbox"
                        checked={order.checklist[i]}
                        disabled={!canPack}
                        onChange={() => showcaseStore.toggleChecklistItem(order.id, i)}
                        className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-400 disabled:opacity-50"
                      />
                      <span className={order.checklist[i] ? "line-through decoration-slate-400" : ""}>{label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Team notes</p>
            <ul className="space-y-2.5">
              {order.teamNotes.length === 0 && <li className="text-xs text-slate-400">No internal notes yet.</li>}
              {order.teamNotes.map((n) => (
                <li key={n.id} className="rounded-lg bg-slate-50 px-3 py-2 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-slate-700">{n.author}</span>
                    <span className="text-slate-400">{new Date(n.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</span>
                  </div>
                  <p className="mt-0.5 text-slate-600">{n.text}</p>
                </li>
              ))}
            </ul>
            <form onSubmit={submitNote} className="mt-2.5 flex gap-2">
              <input
                value={noteDraft}
                onChange={(e) => setNoteDraft(e.target.value)}
                placeholder={`Add a note as ${staff.name}…`}
                className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-xs outline-none focus:border-indigo-400"
              />
              <button type="submit" disabled={!noteDraft.trim()} className="flex-none rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 disabled:opacity-50">Add</button>
            </form>
          </div>

          <div className="mt-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Status history</p>
            <ul className="space-y-1.5 border-l-2 border-slate-100 pl-3">
              {order.history.map((h, i) => (
                <li key={i} className="text-xs text-slate-500">
                  <span className="font-medium text-slate-700">{ORDER_STAGES[h.stage].label}</span> — {new Date(h.at).toLocaleString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 p-4">
          {isFinal ? (
            <p className="text-center text-sm text-slate-500">Delivered — nothing left to do.</p>
          ) : (
            <button onClick={advance} className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700">
              {nextLabel} →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
