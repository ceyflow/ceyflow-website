"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClients, saveDocument, type Client, type DocInput } from "../../../../../lib/adminData";
import { useSettings } from "../../../../../lib/publicData";
import { DocumentForm } from "../../../../../components/admin/DocumentForm";
import { adminBase } from "../../../../../lib/adminBase";

function NewInvoiceForm() {
  const clientParam = useSearchParams().get("client");
  const router = useRouter();
  const settings = useSettings();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => { getClients().then(setClients); }, []);

  async function handleSave(input: DocInput) {
    const result = await saveDocument("invoice", input, settings);
    if (!result.error && result.id) router.push(`${adminBase()}/invoices/view?id=${result.id}`);
    return result;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">New invoice</h1>
      <DocumentForm
        type="invoice"
        clients={clients}
        defaultClientId={clientParam ? Number(clientParam) : undefined}
        defaultTerms={settings.invoice_terms || ""}
        currency={settings.currency || "LKR"}
        onSave={handleSave}
      />
    </div>
  );
}

export default function NewInvoice() {
  return (
    <Suspense>
      <NewInvoiceForm />
    </Suspense>
  );
}
