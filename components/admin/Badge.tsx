export const statusColors: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-sky-100 text-sky-700",
  accepted: "bg-emerald-100 text-emerald-700",
  declined: "bg-red-100 text-red-700",
  expired: "bg-amber-100 text-amber-700",
  paid: "bg-emerald-100 text-emerald-700",
  "partially paid": "bg-amber-100 text-amber-700",
  overdue: "bg-rose-100 text-rose-700",
  void: "bg-slate-100 text-slate-500",
  new: "bg-sky-100 text-sky-700",
  contacted: "bg-amber-100 text-amber-700",
  converted: "bg-emerald-100 text-emerald-700",
  closed: "bg-slate-100 text-slate-500",
};

export function Badge({ value }: { value: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusColors[value] || "bg-slate-100 text-slate-600"}`}>
      {value}
    </span>
  );
}
