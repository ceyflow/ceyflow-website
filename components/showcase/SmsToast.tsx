"use client";
import { useEffect, useState } from "react";

export type SmsToastMessage = { id: number; text: string };

let counter = 0;
export function nextToastId() {
  return ++counter;
}

export function SmsToast({ toasts, onDismiss }: { toasts: SmsToastMessage[]; onDismiss: (id: number) => void }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-20 z-40 flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:pr-6">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onDismiss }: { toast: SmsToastMessage; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 5000);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  return (
    <div className="pointer-events-auto flex max-w-sm items-start gap-2.5 rounded-xl border border-emerald-200 bg-white p-3 shadow-lg">
      <span className="mt-0.5 flex h-6 w-6 flex-none items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-emerald-700">SMS sent (simulated)</p>
        <p className="mt-0.5 text-xs text-slate-600">{toast.text}</p>
      </div>
    </div>
  );
}
