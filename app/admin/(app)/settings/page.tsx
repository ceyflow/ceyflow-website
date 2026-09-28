"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../../lib/supabaseClient";
import { saveSettings, savePackagePricing, saveBundlePricing } from "../../../../lib/adminData";
import type { Package, Bundle, Settings } from "../../../../lib/publicData";
import { PasswordForm } from "./PasswordForm";
import { LogoCropModal } from "./LogoCropModal";
import { InvoiceTemplatePreview, type InvoiceLogoAlign } from "./InvoiceTemplatePreview";

type LogoKey = "logo_light_bg" | "logo_dark_bg";

export default function SettingsPage() {
  const [s, setSettings] = useState<Settings>({});
  const [packages, setPackages] = useState<Package[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [saved, setSaved] = useState<string | null>(null);
  const [logoBusy, setLogoBusy] = useState<string | null>(null);
  const [logoError, setLogoError] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<{ key: LogoKey; file: File } | null>(null);
  const [invoiceAlign, setInvoiceAlign] = useState<InvoiceLogoAlign>("left");
  const [invoiceShowNotes, setInvoiceShowNotes] = useState(true);
  const [invoiceShowTerms, setInvoiceShowTerms] = useState(true);
  const [invoiceShowPaymentDetails, setInvoiceShowPaymentDetails] = useState(true);

  async function refresh() {
    const [{ data: settingsRows }, { data: packageRows }, { data: bundleRows }] = await Promise.all([
      supabase.from("settings").select("key, value"),
      supabase.from("packages").select("*").order("sort"),
      supabase.from("bundles").select("*").order("sort"),
    ]);
    if (settingsRows) setSettings(Object.fromEntries(settingsRows.map((r) => [r.key, r.value])));
    if (packageRows) setPackages(packageRows as Package[]);
    if (bundleRows) setBundles(bundleRows as Bundle[]);
  }
  useEffect(() => { refresh(); }, []);

  useEffect(() => {
    setInvoiceAlign(s.invoice_logo_align === "right" || s.invoice_logo_align === "center" ? s.invoice_logo_align : "left");
    setInvoiceShowNotes(s.invoice_show_notes !== "false");
    setInvoiceShowTerms(s.invoice_show_terms !== "false");
    setInvoiceShowPaymentDetails(s.invoice_show_payment_details !== "false");
  }, [s.invoice_logo_align, s.invoice_show_notes, s.invoice_show_terms, s.invoice_show_payment_details]);

  function flashSaved(what: string) {
    setSaved(what);
    setTimeout(() => setSaved((cur) => (cur === what ? null : cur)), 2000);
  }

  async function handleCompanyDetails(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    await saveSettings(Object.fromEntries(fd.entries()) as Record<string, string>);
    await refresh();
    flashSaved("company");
  }

  async function handleLogoCropSave(key: LogoKey, dataUrl: string) {
    setLogoError(null);
    setLogoBusy(key);
    try {
      await saveSettings({ [key]: dataUrl });
      await refresh();
      setCropTarget(null);
    } catch {
      setLogoError("Could not save that logo — try again.");
    } finally {
      setLogoBusy(null);
    }
  }

  async function handleLogoRemove(key: LogoKey) {
    setLogoBusy(key);
    await saveSettings({ [key]: "" });
    await refresh();
    setLogoBusy(null);
  }

  async function handleInvoiceTemplateSave() {
    await saveSettings({
      invoice_logo_align: invoiceAlign,
      invoice_show_notes: String(invoiceShowNotes),
      invoice_show_terms: String(invoiceShowTerms),
      invoice_show_payment_details: String(invoiceShowPaymentDetails),
    });
    await refresh();
    flashSaved("invoice-template");
  }

  async function handlePricing(e: React.FormEvent<HTMLFormElement>, kind: "package" | "bundle") {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const id = Number(fd.get("id"));
    const setup = fd.get("setup_fee") ? Number(fd.get("setup_fee")) : null;
    const monthly = fd.get("monthly_fee") ? Number(fd.get("monthly_fee")) : null;
    if (kind === "package") await savePackagePricing(id, setup, monthly);
    else await saveBundlePricing(id, setup, monthly);
    await refresh();
    flashSaved(`${kind}-${id}`);
  }

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold">Settings</h1>

      <div className="card max-w-2xl space-y-5 p-6">
        <div>
          <p className="font-semibold">Logo</p>
          <p className="text-sm text-slate-500">Replaces the Ceyflow logo shown on the website, admin panel, and login page. PNG or JPG, transparent background works best.</p>
        </div>
        {logoError && <p className="text-sm text-red-600">{logoError}</p>}
        <div className="grid gap-5 sm:grid-cols-2">
          {([
            { key: "logo_light_bg" as const, label: "Logo (site header, admin, login)", swatch: "bg-white ring-1 ring-slate-200" },
            { key: "logo_dark_bg" as const, label: "Logo (footer — dark background)", swatch: "bg-brand-900" },
          ]).map(({ key, label, swatch }) => (
            <div key={key} className="space-y-2">
              <label className="label">{label}</label>
              <div className={`flex h-16 items-center justify-center rounded-lg ${swatch} p-2`}>
                {s[key] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s[key]} alt="" className="h-full max-w-full object-contain" />
                ) : (
                  <span className="text-xs text-slate-400">Using default logo</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="btn-secondary btn-sm cursor-pointer">
                  {logoBusy === key ? "Saving..." : "Upload"}
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    disabled={logoBusy === key}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) setCropTarget({ key, file });
                    }}
                  />
                </label>
                {s[key] && (
                  <button type="button" onClick={() => handleLogoRemove(key)} disabled={logoBusy === key} className="text-xs font-medium text-red-600 hover:text-red-700">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {cropTarget && (
        <LogoCropModal
          file={cropTarget.file}
          onCancel={() => setCropTarget(null)}
          onSave={(dataUrl) => handleLogoCropSave(cropTarget.key, dataUrl)}
        />
      )}

      <div className="card max-w-4xl space-y-5 p-6">
        <div>
          <p className="font-semibold">Invoice template</p>
          <p className="text-sm text-slate-500">Controls how the logo, and which optional sections, appear on printed quotations and invoices.</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="space-y-5">
            <div>
              <label className="label">Logo position</label>
              <div className="flex gap-2">
                {(["left", "center", "right"] as const).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setInvoiceAlign(opt)}
                    className={`btn-sm rounded-lg border px-3 py-1.5 text-sm capitalize ${
                      invoiceAlign === opt ? "border-brand-600 bg-brand-50 text-brand-700" : "border-slate-300 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="label">Sections</label>
              {([
                { key: "notes" as const, label: "Notes", value: invoiceShowNotes, set: setInvoiceShowNotes },
                { key: "terms" as const, label: "Terms", value: invoiceShowTerms, set: setInvoiceShowTerms },
                { key: "payment" as const, label: "Payment details (invoices only)", value: invoiceShowPaymentDetails, set: setInvoiceShowPaymentDetails },
              ]).map(({ key, label, value, set }) => (
                <label key={key} className="flex items-center gap-2 text-sm text-slate-700">
                  <input type="checkbox" checked={value} onChange={(e) => set(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                  {label}
                </label>
              ))}
            </div>
            <button type="button" onClick={handleInvoiceTemplateSave} className="btn-primary">
              {saved === "invoice-template" ? "Saved ✓" : "Save template"}
            </button>
          </div>
          <div>
            <p className="label">Preview</p>
            <InvoiceTemplatePreview
              align={invoiceAlign}
              showNotes={invoiceShowNotes}
              showTerms={invoiceShowTerms}
              showPaymentDetails={invoiceShowPaymentDetails}
              logo={s.logo_light_bg}
              companyName={s.company_name}
              companyAddress={s.company_address}
              companyEmail={s.company_email}
              companyPhone={s.company_phone}
              bankDetails={s.bank_details}
              currency={s.currency}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleCompanyDetails} className="card max-w-2xl space-y-4 p-6">
        <p className="font-semibold">Company details (shown on the public site and on documents)</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Company name</label><input name="company_name" defaultValue={s.company_name} className="input" /></div>
          <div><label className="label">Currency code</label><input name="currency" defaultValue={s.currency} className="input" /></div>
          <div className="sm:col-span-2"><label className="label">Tagline</label><input name="company_tagline" defaultValue={s.company_tagline} className="input" /></div>
          <div><label className="label">Email</label><input name="company_email" defaultValue={s.company_email} className="input" /></div>
          <div><label className="label">Phone</label><input name="company_phone" defaultValue={s.company_phone} className="input" /></div>
          <div><label className="label">WhatsApp number (digits only, with country code)</label><input name="company_whatsapp" defaultValue={s.company_whatsapp} className="input" /></div>
          <div><label className="label">Address</label><input name="company_address" defaultValue={s.company_address} className="input" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><label className="label">Quotation number prefix</label><input name="quote_prefix" defaultValue={s.quote_prefix} className="input" /></div>
          <div><label className="label">Invoice number prefix</label><input name="invoice_prefix" defaultValue={s.invoice_prefix} className="input" /></div>
        </div>
        <div><label className="label">Bank / payment details (shown on invoices)</label><textarea name="bank_details" defaultValue={s.bank_details} rows={4} className="input" /></div>
        <div><label className="label">Default quotation terms</label><textarea name="quote_terms" defaultValue={s.quote_terms} rows={3} className="input" /></div>
        <div><label className="label">Default invoice terms</label><textarea name="invoice_terms" defaultValue={s.invoice_terms} rows={3} className="input" /></div>
        <button className="btn-primary">{saved === "company" ? "Saved ✓" : "Save company details"}</button>
      </form>

      <div className="card max-w-2xl p-6">
        <p className="mb-4 font-semibold">Package pricing (shown on the public pricing page)</p>
        <div className="space-y-3">
          {packages.map((p) => (
            <form key={p.id} onSubmit={(e) => handlePricing(e, "package")} className="grid grid-cols-3 items-center gap-3 border-b border-slate-100 pb-3 last:border-0">
              <input type="hidden" name="id" value={p.id} />
              <span className="text-sm font-medium">{p.name}</span>
              <input name="setup_fee" type="number" step="any" defaultValue={p.setup_fee ?? ""} placeholder="Setup fee" className="input" />
              <div className="flex gap-2">
                <input name="monthly_fee" type="number" step="any" defaultValue={p.monthly_fee ?? ""} placeholder="Monthly fee" className="input" />
                <button className="btn-secondary btn-sm shrink-0">{saved === `package-${p.id}` ? "Saved ✓" : "Save"}</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <div className="card max-w-2xl p-6">
        <p className="mb-4 font-semibold">Bundle pricing</p>
        <div className="space-y-3">
          {bundles.map((b) => (
            <form key={b.id} onSubmit={(e) => handlePricing(e, "bundle")} className="grid grid-cols-3 items-center gap-3 border-b border-slate-100 pb-3 last:border-0">
              <input type="hidden" name="id" value={b.id} />
              <span className="text-sm font-medium">{b.name}</span>
              <input name="setup_fee" type="number" step="any" defaultValue={b.setup_fee ?? ""} placeholder="Setup fee" className="input" />
              <div className="flex gap-2">
                <input name="monthly_fee" type="number" step="any" defaultValue={b.monthly_fee ?? ""} placeholder="Monthly fee" className="input" />
                <button className="btn-secondary btn-sm shrink-0">{saved === `bundle-${b.id}` ? "Saved ✓" : "Save"}</button>
              </div>
            </form>
          ))}
        </div>
      </div>

      <PasswordForm />
    </div>
  );
}
