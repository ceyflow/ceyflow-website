"use client";
import { useShowcaseStaffDirectory } from "@/lib/useShowcaseOrders";
import { useShowcaseStaff } from "@/lib/showcaseStaffContext";

export function StaffSwitcher({ className = "" }: { className?: string }) {
  const directory = useShowcaseStaffDirectory();
  const { staff, setStaff } = useShowcaseStaff();

  return (
    <label className={`block ${className}`}>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Signed in as</span>
      <select
        value={staff.id}
        onChange={(e) => {
          const next = directory.find((s) => s.id === Number(e.target.value));
          if (next) setStaff(next);
        }}
        className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-indigo-400"
      >
        {directory.map((s) => (
          <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
        ))}
      </select>
    </label>
  );
}
