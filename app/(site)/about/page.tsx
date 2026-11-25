import Link from "next/link";
import { PhotoBand } from "../../../components/site/Photo";

export const metadata = { title: "About us" };

const values = [
  { t: "Built from real operations", d: "Every feature we sell has run a real business day to day. We don't sell ideas, we sell systems that already work." },
  { t: "Your workflow, not ours", d: "Your stages, your products, your courier, your branding. The software bends to how you work." },
  { t: "Local and reachable", d: "We are in Sri Lanka, we understand COD, local couriers and SMS gateways, and you can call us." },
  { t: "One fair monthly fee", d: "Hosting, support and small changes are included. No surprise bills." },
];

export default function About() {
  return (
    <>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-4 py-14 md:py-20">
          <h1 className="display max-w-4xl text-5xl md:text-7xl">We build the systems small businesses actually run on.</h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-600">
            Ceyflow is a Sri Lankan software company. We started by building a complete operations system for a
            growing personal care brand, covering orders, courier tracking, customer SMS and batch production.
            Now we offer the same systems to other businesses that have outgrown notebooks, spreadsheets and chat groups.
          </p>
        </div>
      </section>

      <PhotoBand slot="about" className="pt-12 md:pt-16" />

      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <h2 className="headline text-3xl md:text-4xl">What we do</h2>
            <p className="mt-4 text-slate-600">
              We design, build and look after business operations software: the tools your team uses every day to take
              orders, pack and ship them, keep customers informed, and make your products. Each client gets their own
              system with their own branding and staff logins, hosted and supported by us.
            </p>
          </div>
          <dl className="grid gap-x-8 gap-y-8 sm:grid-cols-2 md:col-span-7">
            {values.map((v) => (
              <div key={v.t} className="border-t-2 border-ink pt-4">
                <dt className="font-bold text-ink">{v.t}</dt>
                <dd className="mt-2 text-slate-600">{v.d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="border-t border-line bg-mist">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-12 md:flex-row md:items-center">
          <div>
            <p className="headline text-3xl">Want to see it running?</p>
            <p className="mt-1 text-slate-600">We will walk you through a live system on a free call.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/contact" className="cta">Contact us</Link>
            <Link href="/showcase#sample" className="cta-quiet">See the live demo</Link>
          </div>
        </div>
      </section>
    </>
  );
}
