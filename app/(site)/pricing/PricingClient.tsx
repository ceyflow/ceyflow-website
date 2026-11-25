"use client";
import Link from "next/link";
import { usePackages, useBundles, useSettings } from "../../../lib/publicData";
import { shortMoney } from "../../../lib/format";

function quoteHref(interest: string) {
  return `/contact?interest=${encodeURIComponent(interest)}`;
}

function BundlePrice({ setup, monthly, cur, interest }: { setup: number | null; monthly: number | null; cur: string; interest: string }) {
  if (setup === null || monthly === null) {
    return (
      <div className="mt-6">
        <Link href={quoteHref(interest)} className="headline text-2xl text-brand-700 hover:underline">Get a quotation</Link>
        <p className="mt-1 text-sm text-slate-500">Setup + monthly fee, tailored to your business</p>
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-1">
      <p className="headline text-4xl">
        {shortMoney(monthly, cur)}<span className="text-base font-medium text-slate-500"> / month</span>
      </p>
      <p className="text-sm text-slate-500">Setup: {shortMoney(setup, cur)}</p>
    </div>
  );
}

function TablePrice({ setup, monthly, cur, interest }: { setup: number | null; monthly: number | null; cur: string; interest: string }) {
  if (setup === null || monthly === null) {
    return <Link href={quoteHref(interest)} className="font-semibold text-brand-700 hover:underline">Get a quotation</Link>;
  }
  return <span>{shortMoney(setup, cur)} setup, {shortMoney(monthly, cur)}/mo</span>;
}

export function PricingClient() {
  const s = useSettings();
  const cur = s.currency || "LKR";
  const packages = usePackages();
  const bundles = useBundles();
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="display max-w-3xl text-5xl md:text-7xl">One setup fee, one monthly fee</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Each system has a one-time setup fee and a monthly subscription that covers hosting, support and small
            changes. Bundles save you money when you need more than one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {bundles.map((b) => (
            <div
              key={b.id}
              className={`flex flex-col rounded-md border bg-white p-7 ${b.highlight ? "border-ink border-t-[6px]" : "border-line border-t-[6px] border-t-line"}`}
            >
              <h2 className="headline text-3xl">{b.name}</h2>
              <p className="mt-1 text-[15px] font-semibold text-brand-700">{b.includes}</p>
              {b.highlight && <p className="mt-1 text-sm font-semibold text-ink">Recommended</p>}
              <p className="mt-3 text-[15px] text-slate-600">{b.description}</p>
              <BundlePrice setup={b.setup_fee} monthly={b.monthly_fee} cur={cur} interest={`${b.name} bundle`} />
              <div className="mt-auto pt-7">
                <Link href={quoteHref(`${b.name} bundle`)} className={`w-full ${b.highlight ? "cta" : "cta-quiet"}`}>
                  Choose {b.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 md:pb-24">
        <h2 className="headline text-3xl md:text-4xl">Individual systems</h2>
        <div className="mt-6 overflow-x-auto">
          <table className="table min-w-[640px]">
            <thead>
              <tr><th>System</th><th>Best for</th><th>Pricing</th><th></th></tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td className="font-bold"><Link href={`/systems#${p.slug}`} className="hover:text-brand-700">{p.name}</Link></td>
                  <td className="text-slate-600">{p.best_for}</td>
                  <td className="whitespace-nowrap"><TablePrice setup={p.setup_fee} monthly={p.monthly_fee} cur={cur} interest={p.name} /></td>
                  <td className="text-right"><Link href={quoteHref(p.name)} className="cta-quiet cta-sm">Select</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          SMS credits are billed by your SMS gateway. Custom work outside a package is quoted per job.
        </p>
      </section>
    </>
  );
}
