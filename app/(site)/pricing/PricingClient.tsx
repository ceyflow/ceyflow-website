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
        <Link href={quoteHref(interest)} className="text-xl font-bold text-brand-700 hover:underline">Get a quotation →</Link>
        <p className="mt-1 text-sm text-slate-500">Setup + monthly fee, tailored to your business</p>
      </div>
    );
  }
  return (
    <div className="mt-6 space-y-1">
      <p className="text-3xl font-extrabold tracking-tight">
        {shortMoney(monthly, cur)}<span className="text-base font-medium text-slate-500"> / month</span>
      </p>
      <p className="text-sm text-slate-500">Setup: {shortMoney(setup, cur)}</p>
    </div>
  );
}

function TablePrice({ setup, monthly, cur, interest }: { setup: number | null; monthly: number | null; cur: string; interest: string }) {
  if (setup === null || monthly === null) {
    return <Link href={quoteHref(interest)} className="font-medium text-brand-700 hover:underline">Get a quotation</Link>;
  }
  return <span>{shortMoney(setup, cur)} setup · {shortMoney(monthly, cur)}/mo</span>;
}

export function PricingClient() {
  const s = useSettings();
  const cur = s.currency || "LKR";
  const packages = usePackages();
  const bundles = useBundles();
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Simple packages, one monthly fee</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Each system has a one-time setup fee and a monthly subscription that covers hosting, support and small
            changes. Bundles save you money when you need more than one.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4">
        <div className="grid gap-6 md:grid-cols-3">
          {bundles.map((b) => (
            <div key={b.id} className={`card relative flex flex-col p-7 ${b.highlight ? "border-brand-600 ring-2 ring-brand-600" : ""}`}>
              {b.highlight ? (
                <span className="absolute -top-3 left-7 rounded-full bg-brand-700 px-3 py-1 text-xs font-semibold text-white">Most popular</span>
              ) : null}
              <h2 className="font-display text-xl font-bold">{b.name}</h2>
              <p className="mt-1 text-sm font-medium text-brand-700">{b.includes}</p>
              <p className="mt-3 text-sm text-slate-600">{b.description}</p>
              <BundlePrice setup={b.setup_fee} monthly={b.monthly_fee} cur={cur} interest={`${b.name} bundle`} />
              <Link
                href={quoteHref(`${b.name} bundle`)}
                className={`mt-7 ${b.highlight ? "btn-primary" : "btn-secondary"} py-2.5`}
              >
                Choose {b.name}
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-bold">Individual systems</h2>
        <div className="card mt-6 overflow-x-auto">
          <table className="table">
            <thead>
              <tr><th>System</th><th>Best for</th><th>Pricing</th><th></th></tr>
            </thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold"><Link href={`/systems#${p.slug}`} className="hover:text-brand-700">{p.name}</Link></td>
                  <td className="text-slate-600">{p.best_for}</td>
                  <td className="whitespace-nowrap"><TablePrice setup={p.setup_fee} monthly={p.monthly_fee} cur={cur} interest={p.name} /></td>
                  <td className="text-right"><Link href={quoteHref(p.name)} className="btn-secondary btn-sm">Select</Link></td>
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
