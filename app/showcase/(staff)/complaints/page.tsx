"use client";
import { useState } from "react";
import { showcaseStore, type ComplaintStatus } from "@/lib/showcaseData";
import { useShowcaseComplaints } from "@/lib/useShowcaseOrders";
import { useShowcaseStaff } from "@/lib/showcaseStaffContext";
import { ComplaintStatusPill } from "@/components/showcase/Pills";

export default function ShowcaseComplaints() {
  const complaints = useShowcaseComplaints();
  const { staff } = useShowcaseStaff();
  const [openId, setOpenId] = useState<number | null>(null);
  const [resolutionDraft, setResolutionDraft] = useState("");
  const canResolve = staff.role === "Admin";

  const open = complaints.filter((c) => c.status !== "Resolved").length;

  function startProgress(id: number) {
    showcaseStore.setComplaintStatus(id, "In progress");
  }

  function resolve(id: number) {
    showcaseStore.setComplaintStatus(id, "Resolved", resolutionDraft.trim() || "Marked resolved.");
    setResolutionDraft("");
    setOpenId(null);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Complaints desk</h1>
        <p className="mt-1 text-sm text-slate-500">{open} open of {complaints.length} total — a running log of customer issues, in one place.</p>
      </div>

      {complaints.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-200 bg-white py-8 text-center text-sm text-slate-400">No complaints yet — nice. New ones will show up here.</p>
      )}

      <div className="space-y-3">
        {complaints.map((c) => {
          const isOpen = openId === c.id;
          return (
            <div key={c.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <button onClick={() => setOpenId(isOpen ? null : c.id)} className="flex w-full items-start justify-between gap-3 p-4 text-left">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{c.subject}</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">
                    {c.customerName} · {c.phone}{c.orderNumber ? ` · ${c.orderNumber}` : " · no linked order"}
                  </p>
                </div>
                <ComplaintStatusPill status={c.status} />
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50 p-4">
                  <p className="text-sm text-slate-700">{c.details}</p>
                  {c.resolution && (
                    <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800"><span className="font-semibold">Resolution:</span> {c.resolution}</p>
                  )}
                  {c.status !== "Resolved" && (
                    canResolve ? (
                      <div className="mt-3 space-y-2">
                        {c.status === "Open" && (
                          <button onClick={() => startProgress(c.id)} className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100">Mark in progress</button>
                        )}
                        <textarea
                          value={resolutionDraft}
                          onChange={(e) => setResolutionDraft(e.target.value)}
                          placeholder="How was this resolved?"
                          rows={2}
                          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
                        />
                        <button onClick={() => resolve(c.id)} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-700">Mark resolved</button>
                      </div>
                    ) : (
                      <p className="mt-3 text-xs text-slate-400">Only Admin can change a complaint's status in this demo.</p>
                    )
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
