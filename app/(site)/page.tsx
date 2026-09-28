"use client";
import Link from "next/link";
import { usePackages } from "../../lib/publicData";
import { SystemIcon } from "../../components/SystemIcon";
import { OrderJourney } from "../../components/OrderJourney";
import { PhoneMockup, PhoneScreenSms, PhoneScreenTracking } from "../../components/PhoneMockup";

const tryChips = [
  ["Orders board", "Order Management"],
  ["Courier tracking", "Delivery Tracking"],
  ["SMS reminders", "SMS Automation"],
  ["Production planner", "Inventory and Production"],
  ["Full setup", "Full Operations bundle"],
];

const industries = [
  "COD e-commerce",
  "Cosmetics & personal care",
  "Food & beverage",
  "Fashion & retail",
  "Small manufacturing",
];

const steps = [
  { t: "Free discovery call", d: "We map how your orders, deliveries and production run today." },
  { t: "Clear proposal", d: "The systems you need, your own stages, a timeline and a fixed price." },
  { t: "Build and set up", d: "Your branding, staff logins, courier and SMS gateway connected." },
  { t: "Train and go live", d: "One training session, a short guide, and two weeks of adjustments." },
];

export default function Home() {
  const packages = usePackages();
  return (
    <>
      {/* Hero */}
      <section className="hero-diagonal-bg relative overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 py-16 text-center md:py-20">
          <h1 className="font-display text-4xl leading-tight font-extrabold tracking-tight text-ink md:text-6xl">
            The best <span className="bg-gradient-to-r from-brand-700 via-brand-500 to-accent bg-clip-text text-transparent">operations system</span> for your business
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600">
            Orders, delivery tracking, SMS and production, built around how you already work —{" "}
            <span className="underline decoration-brand-300 decoration-2 underline-offset-2">without hiring an in-house dev team</span>.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-2">
            {packages.map((p) => (
              <Link
                key={p.slug}
                href={`/systems#${p.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:border-brand-300 hover:text-brand-700"
              >
                <SystemIcon slug={p.slug} className="h-6 w-6" />
                {p.name}
              </Link>
            ))}
          </div>

          <form action="/contact" method="get" className="card mx-auto mt-6 max-w-2xl p-5 text-left shadow-xl shadow-brand-900/5">
            <label htmlFor="hero-message" className="sr-only">Tell us about your business</label>
            <textarea
              id="hero-message"
              name="message"
              rows={2}
              placeholder="Tell us how orders come in today, and what's slowing you down..."
              className="w-full resize-none border-0 text-base text-ink placeholder:text-slate-400 focus:outline-none"
            />
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="text-xs text-slate-400">We reply within one working day with a free proposal</span>
              <button type="submit" className="btn-primary px-5 py-2.5">Get a quotation →</button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm">
            <span className="text-slate-500">Try it</span>
            {tryChips.map(([label, interest]) => (
              <Link
                key={label}
                href={`/contact?interest=${encodeURIComponent(interest)}`}
                className="rounded-full bg-slate-100 px-3.5 py-1.5 font-medium text-slate-600 hover:bg-brand-50 hover:text-brand-700"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div className="border-t border-slate-100 bg-white/60 py-8">
          <p className="text-center text-sm font-medium text-slate-500">Built for businesses like these</p>
          <div className="mx-auto mt-4 flex max-w-5xl flex-wrap justify-center gap-3 px-4">
            {industries.map((tag) => (
              <span key={tag} className="rounded-full bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 ring-1 ring-brand-100">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Order journey: scroll-scrubbed Received → Processing → Dispatching → Delivered */}
      <OrderJourney />

      {/* Mobile mockups */}
      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold text-brand-700">On your customers&rsquo; phones</p>
          <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">They always know where their order is</h2>
          <p className="mt-3 text-slate-600">No app to install. Every update and tracking link lands as a plain text message.</p>
        </div>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-10 md:gap-16">
          <PhoneMockup className="md:-rotate-3">
            <PhoneScreenSms />
          </PhoneMockup>
          <PhoneMockup className="md:rotate-3">
            <PhoneScreenTracking />
          </PhoneMockup>
        </div>
      </section>

      {/* Problems */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-bold tracking-tight">What we do</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Four systems, each proven in daily production use. Take one, or combine them into a complete operations
          platform with your logo and your workflow.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {packages.map((p) => (
            <Link key={p.slug} href={`/systems#${p.slug}`} className="card group p-6 transition hover:border-brand-200 hover:shadow-lg hover:shadow-brand-900/5">
              <SystemIcon slug={p.slug} />
              <h3 className="mt-4 text-lg font-bold group-hover:text-brand-700">{p.name}</h3>
              <p className="mt-1 text-slate-600">{p.tagline}</p>
              <p className="mt-4 text-sm text-slate-500"><span className="font-semibold text-slate-700">Solves:</span> {p.solves}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* What running on Ceyflow looks like */}
      <section className="bg-slate-50">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-5">
          <div className="md:col-span-2">
            <p className="text-sm font-semibold text-brand-700">Built from real operations</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight">Proven in daily use, not just on paper</h2>
            <p className="mt-4 text-slate-600">
              Every feature we sell has already run a real business day to day: every order on one board, live courier
              tracking for customers, automatic SMS updates, and batch production with QC and GMP checklists.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:col-span-3">
            {[
              ["Orders", "One board from received to delivered, with printable invoices and labels."],
              ["Tracking", "Customers check live courier status on your own site."],
              ["SMS", "A text goes out automatically when the parcel is picked up."],
              ["Production", "Batches planned from recipes and signed off at every QC step."],
            ].map(([t, d]) => (
              <div key={t} className="card p-5">
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm text-slate-600">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-3xl font-bold tracking-tight">How we work with you</h2>
        <ol className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t}>
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-700 text-sm font-bold text-white">{i + 1}</span>
              <p className="mt-3 font-semibold">{s.t}</p>
              <p className="mt-1 text-sm text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-2xl bg-brand-700 px-8 py-12 text-center text-white md:px-16">
          <h2 className="font-display text-3xl font-bold tracking-tight">Ready to stop chasing orders?</h2>
          <p className="mx-auto mt-3 max-w-xl text-brand-100">Tell us how your business runs today and we will show you what Ceyflow would look like for you. The first call is free.</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn bg-white px-5 py-3 text-base text-brand-800 hover:bg-brand-50">Book a free call</Link>
            <Link href="/pricing" className="btn border border-white/40 px-5 py-3 text-base text-white hover:bg-white/10">View packages</Link>
          </div>
        </div>
      </section>
    </>
  );
}
