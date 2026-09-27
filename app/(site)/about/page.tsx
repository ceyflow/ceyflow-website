import Link from "next/link";

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
      <section className="bg-gradient-to-b from-brand-50 to-white">
        <div className="mx-auto max-w-4xl px-4 py-16">
          <p className="text-sm font-semibold text-brand-700">Who we are</p>
          <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">We build the systems small businesses actually run on.</h1>
          <p className="mt-5 text-lg text-slate-600">
            Ceyflow is a Sri Lankan software company. We started by building a complete operations system for a
            growing personal care brand, covering orders, courier tracking, customer SMS and batch production.
            Now we offer the same systems to other businesses that have outgrown notebooks, spreadsheets and chat groups.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12">
        <h2 className="font-display text-2xl font-bold">What we do</h2>
        <p className="mt-3 text-slate-600">
          We design, build and look after business operations software: the tools your team uses every day to take
          orders, pack and ship them, keep customers informed, and make your products. Each client gets their own
          system with their own branding and staff logins, hosted and supported by us.
        </p>
        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {values.map((v) => (
            <div key={v.t} className="card p-6">
              <p className="font-semibold">{v.t}</p>
              <p className="mt-2 text-sm text-slate-600">{v.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="card flex flex-col items-start justify-between gap-6 p-8 md:flex-row md:items-center">
          <div>
            <p className="font-display text-xl font-bold">Want to see it running?</p>
            <p className="mt-1 text-slate-600">We will walk you through a live system on a free call.</p>
          </div>
          <Link href="/contact" className="btn-primary px-5 py-3">Contact us</Link>
        </div>
      </section>
    </>
  );
}
