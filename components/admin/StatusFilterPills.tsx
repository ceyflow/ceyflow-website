import { statusColors } from "./Badge";

export function StatusFilterPills({
  options, active, onChange, counts,
}: {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  counts?: Record<string, number>;
}) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1">
      {options.map((opt) => {
        const isActive = opt === active;
        const color = opt === "all" ? "bg-brand-100 text-brand-700" : statusColors[opt] || "bg-slate-100 text-slate-600";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={`flex-none rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition ${
              isActive ? `${color} ring-2 ring-offset-1 ring-brand-300` : `${color} opacity-50 hover:opacity-80`
            }`}
          >
            {opt}
            {counts && counts[opt] !== undefined ? ` (${counts[opt]})` : ""}
          </button>
        );
      })}
    </div>
  );
}
