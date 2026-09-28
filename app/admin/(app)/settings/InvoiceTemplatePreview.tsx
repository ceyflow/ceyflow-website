export type InvoiceLogoAlign = "left" | "center" | "right";

const SAMPLE_ITEMS = [
  { description: "Website design & build", qty: 1, unitPrice: 150000 },
  { description: "Monthly hosting & support", qty: 3, unitPrice: 8000 },
];

export function InvoiceTemplatePreview({
  align,
  showNotes,
  showTerms,
  showPaymentDetails,
  logo,
  companyName,
  companyAddress,
  companyEmail,
  companyPhone,
  bankDetails,
  currency,
}: {
  align: InvoiceLogoAlign;
  showNotes: boolean;
  showTerms: boolean;
  showPaymentDetails: boolean;
  logo?: string;
  companyName?: string;
  companyAddress?: string;
  companyEmail?: string;
  companyPhone?: string;
  bankDetails?: string;
  currency?: string;
}) {
  const cur = currency || "LKR";
  const money = (n: number) => `${cur} ${n.toLocaleString("en-LK", { minimumFractionDigits: 2 })}`;
  const subtotal = SAMPLE_ITEMS.reduce((a, it) => a + it.qty * it.unitPrice, 0);
  const logoAlignClass = align === "center" ? "mx-auto" : align === "right" ? "ml-auto" : "";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className={
          align === "center"
            ? "flex flex-col items-center gap-3 border-b border-slate-100 pb-4 text-center"
            : `flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-4 ${align === "right" ? "flex-row-reverse" : ""}`
        }
      >
        <div className={align === "right" ? "text-right" : undefined}>
          {logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logo} alt="" className={`mb-1.5 h-8 w-auto object-contain ${logoAlignClass}`} />
          ) : (
            <div className={`mb-1.5 flex h-8 w-20 items-center justify-center rounded bg-slate-100 text-[9px] text-slate-400 ${logoAlignClass}`}>
              LOGO
            </div>
          )}
          <p className="font-display text-sm font-extrabold text-brand-800">{companyName || "Your company"}</p>
          <p className="mt-0.5 text-xs text-slate-500">{companyAddress || "Company address"}</p>
          <p className="text-xs text-slate-500">{companyEmail || "you@company.com"} · {companyPhone || "+94 xx xxx xxxx"}</p>
        </div>
        <div className={align === "center" ? "" : align === "right" ? "text-left" : "text-right"}>
          <p className="text-lg font-bold uppercase tracking-wide text-slate-800">Invoice</p>
          <p className="mt-0.5 text-xs text-slate-500">INV-0001</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">Billed to</p>
          <p className="mt-0.5 font-semibold text-slate-700">Sample Client Ltd</p>
          <p className="text-slate-500">client@example.com</p>
        </div>
        <div className="sm:text-right">
          <p><span className="text-slate-500">Issue date:</span> 01 Jan 2026</p>
          <p><span className="text-slate-500">Due date:</span> 15 Jan 2026</p>
        </div>
      </div>

      <table className="mt-4 w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-left text-[10px] tracking-wide text-slate-400 uppercase">
            <th className="py-1.5 font-semibold">Description</th>
            <th className="py-1.5 text-right font-semibold">Qty</th>
            <th className="py-1.5 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {SAMPLE_ITEMS.map((it) => (
            <tr key={it.description} className="border-b border-slate-50">
              <td className="py-1.5">{it.description}</td>
              <td className="py-1.5 text-right">{it.qty}</td>
              <td className="py-1.5 text-right">{money(it.qty * it.unitPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3 flex justify-end">
        <div className="w-full max-w-[160px] border-t border-slate-200 pt-1.5 text-right text-xs font-bold">
          Total {money(subtotal)}
        </div>
      </div>

      {showNotes && <p className="mt-4 text-xs text-slate-600">Thanks for your business — let us know if you have any questions.</p>}
      {showTerms && (
        <div className="mt-3 border-t border-slate-100 pt-3 text-[10px] text-slate-500">
          <p className="mb-0.5 font-semibold text-slate-600">Terms</p>
          <p>Payment due within 14 days.</p>
        </div>
      )}
      {showPaymentDetails && (
        <div className="mt-2 text-[10px] text-slate-500">
          <p className="mb-0.5 font-semibold text-slate-600">Payment details</p>
          <p className="whitespace-pre-line">{bankDetails || "Bank name, account number..."}</p>
        </div>
      )}
    </div>
  );
}
