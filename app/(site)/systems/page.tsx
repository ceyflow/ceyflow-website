import Link from "next/link";
import { getPackages } from "../../../lib/db";
import { SystemIcon } from "../../../components/SystemIcon";

export const metadata = { title: "Systems" };

export default function Systems() {
  const packages = getPackages();
  return (
    <>
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Our systems</h1>
          <p className="mt-4 max-w-2xl text-lg text-slate-600">
            Every system is a web app your team opens in a browser, with your branding, staff logins and access control.
            Everything listed here is already running in production.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {packages.map((p) => (
              <a key={p.slug} href={`#${p.slug}`} className="rounded-full bg-white px-3 py-1.5 text-sm font-medium text-slate-700 ring-1 ring-slate-200 hover:ring-brand-500">{p.name}</a>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-12">
        <div className="card overflow-x-auto">
          <table className="table">
            <thead><tr><th>System</th><th>Solves</th><th>Best for</th><th></th></tr></thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.slug}>
                  <td className="font-semibold">{p.name}</td>
                  <td className="text-slate-600">{p.solves}</td>
                  <td className="text-slate-600">{p.best_for}</td>
                  <td className="text-right"><a href={`#${p.slug}`} className="text-brand-700 hover:underline">Details</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto max-w-6xl space-y-8 px-4 py-12">
        {packages.map((p) => (
          <section key={p.slug} id={p.slug} className="card scroll-mt-24 p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-5">
              <div className="md:col-span-2">
                <SystemIcon slug={p.slug} />
                <h2 className="mt-4 font-display text-2xl font-bold">{p.name}</h2>
                <p className="mt-2 text-slate-600">{p.description}</p>
                <dl className="mt-6 space-y-3 text-sm">
                  <div><dt className="font-semibold">Solves</dt><dd className="text-slate-600">{p.solves}</dd></div>
                  <div><dt className="font-semibold">Best for</dt><dd className="text-slate-600">{p.best_for}</dd></div>
                  <div><dt className="font-semibold">Timeline</dt><dd className="text-slate-600">{p.timeline}</dd></div>
                </dl>
              </div>
              <div className="md:col-span-3">
                <p className="mb-3 text-sm font-semibold text-slate-500 uppercase tracking-wide">What you get</p>
                <ul className="space-y-3">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 text-slate-700">
                      <svg className="mt-0.5 h-5 w-5 flex-none text-brand-600" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {p.note && <p className="mt-5 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">{p.note}</p>}
                <div className="mt-6 flex gap-3">
                  <Link href={`/contact?interest=${encodeURIComponent(p.name)}`} className="btn-primary">Ask about {p.name}</Link>
                  <Link href="/pricing" className="btn-secondary">See pricing</Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
