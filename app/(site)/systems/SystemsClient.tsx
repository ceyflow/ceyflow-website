"use client";
import Link from "next/link";
import { usePackages } from "../../../lib/publicData";
import { SystemIcon } from "../../../components/SystemIcon";

export function SystemsClient() {
  const packages = usePackages();
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="display max-w-3xl text-5xl md:text-7xl">Four systems, built around how you work</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Every system is a web app your team opens in a browser, with your branding, staff logins and access control.
            Everything listed here is already running in production.
          </p>
          <nav aria-label="Systems" className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-[15px] font-semibold">
            {packages.map((p) => (
              <a key={p.slug} href={`#${p.slug}`} className="text-brand-700 underline decoration-brand-200 underline-offset-4 hover:decoration-brand-700">{p.name}</a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-12">
        <div className="overflow-x-auto">
          <table className="table min-w-[640px]">
            <thead><tr><th>System</th><th>Solves</th><th>Best for</th><th></th></tr></thead>
            <tbody>
              {packages.map((p) => (
                <tr key={p.slug}>
                  <td className="font-bold">{p.name}</td>
                  <td className="text-slate-600">{p.solves}</td>
                  <td className="text-slate-600">{p.best_for}</td>
                  <td className="text-right"><a href={`#${p.slug}`} className="font-semibold text-brand-700 hover:underline">Details</a></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        {packages.map((p) => (
          <section key={p.slug} id={p.slug} className="scroll-mt-20 border-t-2 border-ink py-10 md:py-14">
            <div className="grid gap-8 md:grid-cols-12 md:gap-12">
              <div className="md:col-span-5">
                <SystemIcon slug={p.slug} />
                <h2 className="headline mt-4 text-3xl md:text-4xl">{p.name}</h2>
                <p className="mt-3 text-slate-600">{p.description}</p>
                <dl className="mt-6 space-y-4 text-[15px]">
                  <div><dt className="font-bold">Solves</dt><dd className="text-slate-600">{p.solves}</dd></div>
                  <div><dt className="font-bold">Best for</dt><dd className="text-slate-600">{p.best_for}</dd></div>
                  <div><dt className="font-bold">Timeline</dt><dd className="text-slate-600">{p.timeline}</dd></div>
                </dl>
              </div>
              <div className="md:col-span-7">
                <h3 className="font-bold">What you get</h3>
                <ul className="mt-3 divide-y divide-line border-y border-line">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-3 py-3 text-slate-700">
                      <svg className="mt-1 h-4 w-4 flex-none text-brand-700" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-8 8a1 1 0 01-1.4 0l-4-4a1 1 0 011.4-1.4L8 12.6l7.3-7.3a1 1 0 011.4 0z" clipRule="evenodd" /></svg>
                      {f}
                    </li>
                  ))}
                </ul>
                {p.note && <p className="mt-5 border-l-2 border-accent pl-4 text-[15px] text-slate-600">{p.note}</p>}
                <div className="mt-7 flex flex-wrap gap-3">
                  <Link href={`/contact?interest=${encodeURIComponent(p.name)}`} className="cta-quiet">Ask about {p.name}</Link>
                  <Link href="/pricing" className="inline-flex items-center px-2 py-3 text-[15px] font-semibold text-brand-700 hover:underline">See pricing</Link>
                </div>
              </div>
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
