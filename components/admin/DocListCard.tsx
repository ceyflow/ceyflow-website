import Link from "next/link";
import type { DocWithTotals } from "../../lib/adminData";
import { Badge } from "./Badge";
import { money, date, displayStatus } from "../../lib/format";

export function DocListCard({ doc, href, currency }: { doc: DocWithTotals; href: string; currency: string }) {
  return (
    <Link href={href} className="block rounded-xl border border-slate-200 bg-white p-4 active:bg-slate-50">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium text-brand-700">{doc.number}</span>
        <Badge value={displayStatus(doc)} />
      </div>
      <p className="mt-1 truncate text-sm text-slate-600">{doc.client_name}</p>
      <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
        <span>{date(doc.issue_date)}</span>
        <span className="font-semibold text-slate-800">{money(doc.total, currency)}</span>
      </div>
    </Link>
  );
}
