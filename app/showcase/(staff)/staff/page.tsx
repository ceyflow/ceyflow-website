"use client";
import { useState } from "react";
import { showcaseStore, type StaffMember } from "@/lib/showcaseData";
import { useShowcaseStaffDirectory } from "@/lib/useShowcaseOrders";
import { useShowcaseStaff } from "@/lib/showcaseStaffContext";

const ROLES: StaffMember["role"][] = ["Admin", "Packer", "Dispatcher"];

export default function ShowcaseStaff() {
  const directory = useShowcaseStaffDirectory();
  const { staff: current } = useShowcaseStaff();
  const [name, setName] = useState("");
  const [role, setRole] = useState<StaffMember["role"]>("Packer");
  const canManage = current.role === "Admin";

  function addStaff(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    showcaseStore.addStaffMember(name, role);
    setName("");
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-display text-2xl font-bold text-slate-900">Staff</h1>
        <p className="mt-1 text-sm text-slate-500">Everyone with access, and what they're allowed to do.</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
              <th className="border-b border-slate-200 px-4 py-2.5">Name</th>
              <th className="border-b border-slate-200 px-4 py-2.5">Role</th>
              <th className="border-b border-slate-200 px-4 py-2.5">Can do</th>
            </tr>
          </thead>
          <tbody>
            {directory.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50">
                <td className="border-b border-slate-100 px-4 py-2.5 font-medium text-slate-900">{s.name}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-slate-600">{s.role}</td>
                <td className="border-b border-slate-100 px-4 py-2.5 text-xs text-slate-500">
                  {s.role === "Admin" && "Everything — checklists, resolving complaints, adding staff"}
                  {s.role === "Packer" && "Update production/order checklists, add team notes"}
                  {s.role === "Dispatcher" && "Advance orders, view checklists (read-only)"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <p className="mb-3 text-sm font-semibold text-slate-900">Add a staff member</p>
        {canManage ? (
          <form onSubmit={addStaff} className="flex flex-col gap-2 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full name"
              className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400"
            />
            <select value={role} onChange={(e) => setRole(e.target.value as StaffMember["role"])} className="rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-400">
              {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <button type="submit" disabled={!name.trim()} className="flex-none rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-40">Add</button>
          </form>
        ) : (
          <p className="text-xs text-slate-400">Only Admin can add staff in this demo. Switch to "You (Owner)" in the sidebar to try it.</p>
        )}
      </div>
    </div>
  );
}
