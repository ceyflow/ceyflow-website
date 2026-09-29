"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getClient, getDocument, getItems, deleteDocument, setDocumentStatus, convertQuoteToInvoice,
  type Client, type DocItem, type DocWithTotals,
} from "../../../../../lib/adminData";
import { useSettings } from "../../../../../lib/publicData";
import { DocumentView } from "../../../../../components/admin/DocumentView";
import { adminBase } from "../../../../../lib/adminBase";

function QuoteView() {
  const id = Number(useSearchParams().get("id"));
  const router = useRouter();
  const base = adminBase();
  const settings = useSettings();
  const [doc, setDoc] = useState<DocWithTotals | undefined | null>(null);
  const [items, setItems] = useState<DocItem[]>([]);
  const [client, setClient] = useState<Client | undefined>();

  const refresh = useCallback(async () => {
    const d = await getDocument(id);
    if (!d || d.type !== "quote") { setDoc(undefined); return; }
    setDoc(d);
    const [its, c] = await Promise.all([getItems(id), getClient(d.client_id)]);
    setItems(its);
    setClient(c);
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  if (doc === null) return null;
  if (doc === undefined || !client) return <p className="text-sm text-slate-500">Quotation not found.</p>;

  return (
    <DocumentView
      type="quote" doc={doc} items={items} client={client} settings={settings}
      onStatusChange={async (status) => { await setDocumentStatus(id, status); refresh(); }}
      onConvert={async () => { const invoiceId = await convertQuoteToInvoice(id, settings); if (invoiceId) router.push(`${base}/invoices/view?id=${invoiceId}`); }}
      onDelete={async () => { if (confirm("Delete this quotation? This cannot be undone.")) { await deleteDocument(id); router.push(`${base}/quotes`); } }}
    />
  );
}

export default function QuoteDetail() {
  return (
    <Suspense>
      <QuoteView />
    </Suspense>
  );
}
