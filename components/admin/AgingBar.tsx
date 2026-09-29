import Link from "next/link";
import { money } from "../../lib/format";

const COLORS = ["bg-emerald-500", "bg-amber-500", "bg-orange-500", "bg-rose-600"];

export function AgingBar({
  buckets, currency, hrefFor,
}: {
  buckets: { label: string; amount: number }[];
  currency: string;
  hrefFor?: (label: string) => string;
}) {
  const total = Math.max(1, buckets.reduce((s, b) => s + b.amount, 0));

  return (
    <div>
      <div className="flex h-3 overflow-hidden rounded-full bg-slate-100">
        {buckets.map((b, i) => {
          const width = `${(b.amount / total) * 100}%`;
          const cls = `${COLORS[i % COLORS.length]} h-full`;
          return hrefFor ? (
            <Link key={b.label} href={hrefFor(b.label)} className={cls} style={{ width }} title={`${b.label}: ${money(b.amount, currency)}`} />
          ) : (
            <span key={b.label} className={cls} style={{ width }} title={`${b.label}: ${money(b.amount, currency)}`} />
          );
        })}
      </div>
      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
        {buckets.map((b, i) => (
          <span key={b.label} className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${COLORS[i % COLORS.length]}`} />
            {b.label}: <span className="font-medium text-slate-700">{money(b.amount, currency)}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
