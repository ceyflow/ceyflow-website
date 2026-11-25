"use client";
import Link from "next/link";
import { usePackages } from "../../lib/publicData";
import { HeroBoard } from "../../components/site/HeroBoard";
import { TrackTicket } from "../../components/site/TrackTicket";

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
      {/* Hero: statement on the left, the working board bleeding off the right edge */}
      <section className="overflow-x-clip border-b border-line">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-14 md:grid-cols-12 md:gap-8 md:py-20">
          <div className="md:col-span-5">
            <h1 className="display text-[3.4rem] sm:text-[4.4rem] md:text-[4.6rem] lg:text-[5.4rem]">
              Every order, on one board.
            </h1>
            <p className="mt-6 max-w-md text-lg text-slate-600">
              Ceyflow builds the order board, courier tracking and SMS updates for Sri Lankan product businesses, so
              everyone on your team can see where each order is. Order Management goes live in 2 to 4 weeks, with your
              branding and your own stages.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/showcase#sample" className="cta">See the live demo</Link>
              <Link href="/contact" className="cta-quiet">Book a free call</Link>
            </div>
            <p className="mt-8 max-w-md text-[15px] text-slate-500">
              Built for cash-on-delivery sellers, personal care and cosmetics brands, food and drink makers, fashion
              and retail shops, and small manufacturers.
            </p>
          </div>
          <div className="md:col-span-7 md:[width:calc(100%+(100vw-min(100vw,72rem))/2)]">
            <HeroBoard />
          </div>
        </div>
      </section>

      {/* What it replaces: one row per system, the problem first */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <div className="max-w-2xl">
          <h2 className="headline text-4xl md:text-5xl">Four jobs that should stop living in notebooks</h2>
          <p className="mt-4 text-lg text-slate-600">
            Take one system, or combine them. Each one already runs a real business every day.
          </p>
        </div>
        <ul className="mt-10 border-t border-line">
          {packages.map((p) => (
            <li key={p.slug} className="border-b border-line">
              <Link
                href={`/systems#${p.slug}`}
                className="group grid gap-2 py-6 transition-colors hover:bg-mist md:grid-cols-12 md:gap-8 md:px-4 md:py-7"
              >
                <p className="headline text-2xl md:col-span-6 md:text-[1.7rem]">{p.solves}</p>
                <div className="md:col-span-5">
                  <p className="font-bold text-ink">{p.name}</p>
                  <p className="mt-0.5 text-slate-600">{p.tagline}</p>
                </div>
                <p className="text-sm font-semibold text-brand-700 group-hover:underline md:col-span-1 md:text-right md:leading-[1.9]">Details</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* The customer's side */}
      <section className="border-y border-line bg-mist">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-12 md:gap-12 md:py-24">
          <div className="md:col-span-5">
            <h2 className="headline text-4xl md:text-5xl">Your customers stop calling to ask where it is</h2>
            <p className="mt-5 max-w-md text-lg text-slate-600">
              A text goes out when the parcel is picked up. The link opens a tracking page on your own website, with the
              courier&rsquo;s live status. There is no app to install.
            </p>
          </div>
          <div className="md:col-span-7">
            <TrackTicket />
          </div>
        </div>
      </section>

      {/* Process: a real sequence, so the steps are numbered */}
      <section className="mx-auto max-w-6xl px-4 py-16 md:py-24">
        <h2 className="headline max-w-xl text-4xl md:text-5xl">From first call to go-live</h2>
        <ol className="mt-10 grid gap-x-8 gap-y-8 md:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.t} className="border-t-2 border-ink pt-4">
              <p className="headline text-4xl text-brand-700">{i + 1}</p>
              <p className="mt-3 font-bold text-ink">{s.t}</p>
              <p className="mt-1.5 text-slate-600">{s.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Closing call to action */}
      <section className="border-t border-line bg-mist">
        <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
          <h2 className="display max-w-2xl text-5xl md:text-6xl">Ready to stop chasing orders?</h2>
          <p className="mt-5 max-w-xl text-lg text-slate-600">
            Tell us how your business runs today and we will show you what Ceyflow would look like for you. The first call is free.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/contact" className="cta">Book a free call</Link>
            <Link href="/showcase#sample" className="cta-quiet">See the live demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
