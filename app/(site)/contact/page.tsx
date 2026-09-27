import { getBundles, getPackages, getSettings } from "../../../lib/db";
import { ContactForm } from "./ContactForm";

export const metadata = { title: "Contact us" };

export default async function Contact({ searchParams }: { searchParams: Promise<{ interest?: string; message?: string }> }) {
  const { interest = "", message = "" } = await searchParams;
  const s = getSettings();
  const options = [...getBundles().map((b) => `${b.name} bundle`), ...getPackages().map((p) => p.name), "Custom system"];
  if (interest && !options.includes(interest)) options.unshift(interest);
  return (
    <section className="bg-gradient-to-b from-brand-50 to-white">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 py-16 md:grid-cols-5">
        <div className="md:col-span-2">
          <h1 className="font-display text-4xl font-extrabold tracking-tight">Let's talk</h1>
          <p className="mt-4 text-lg text-slate-600">
            Tell us a little about your business. We will reply within one working day to set up a free discovery call.
          </p>
          <ul className="mt-8 space-y-4 text-sm">
            <li><p className="font-semibold">Email</p><a className="text-brand-700 hover:underline" href={`mailto:${s.company_email}`}>{s.company_email}</a></li>
            <li><p className="font-semibold">Phone</p><a className="text-brand-700 hover:underline" href={`tel:${s.company_phone.replace(/\s/g, "")}`}>{s.company_phone}</a></li>
            {s.company_whatsapp && (
              <li><p className="font-semibold">WhatsApp</p><a className="text-brand-700 hover:underline" href={`https://wa.me/${s.company_whatsapp}`}>Message us on WhatsApp</a></li>
            )}
            <li><p className="font-semibold">Location</p><p className="text-slate-600">{s.company_address}</p></li>
          </ul>
        </div>
        <div className="md:col-span-3">
          <ContactForm interest={interest} message={message} options={options} />
        </div>
      </div>
    </section>
  );
}
