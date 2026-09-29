"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClients, getDocument, getItems, saveDocument, type Client, type DocItem, type DocWithTotals, type DocInput } from "../../../../../lib/adminData";
import { useSettings } from "../../../../../lib/publicData";
import { DocumentForm } from "../../../../../components/admin/DocumentForm";
import { adminBase } from "../../../../../lib/adminBase";

function EditInvoiceForm() {
  const id = Number(useSearchParams().get("id"));
  const router = useRouter();
  const settings = useSettings();
  const [clients, setClients] = useState<Client[]>([]);
  const [doc, setDoc] = useState<DocWithTotals | undefined | null>(null);
  const [items, setItems] = useState<DocItem[]>([]);

  useEffect(() => {
    getClients().then(setClients);
    getDocument(id).then((d) => {
      if (!d || d.type !== "invoice") { setDoc(undefined); return; }
      setDoc(d);
      getItems(id).then(setItems);
    });
  }, [id]);

  async function handleSave(input: DocInput) {
    const result = await saveDocument("invoice", input, settings);
    if (!result.error && result.id) router.push(`${adminBase()}/invoices/view?id=${result.id}`);
    return result;
  }

  if (doc === null) return null;
  if (doc === undefined) return <p className="text-sm text-slate-500">Invoice not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Edit {doc.number}</h1>
      <DocumentForm type="invoice" clients={clients} doc={doc} items={items} defaultTerms={settings.invoice_terms || ""} currency={settings.currency || "LKR"} onSave={handleSave} />
    </div>
  );
}

export default function EditInvoice() {
  return (
    <Suspense>
      <EditInvoiceForm />
    </Suspense>
  );
}
