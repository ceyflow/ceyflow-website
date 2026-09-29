"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getClient, getDocument, getItems, getPayments, deleteDocument, setDocumentStatus, addPayment, deletePayment,
  type Client, type DocItem, type DocWithTotals, type Payment,
} from "../../../../../lib/adminData";
import { useSettings } from "../../../../../lib/publicData";
import { DocumentView } from "../../../../../components/admin/DocumentView";
import { adminBase } from "../../../../../lib/adminBase";

function InvoiceView() {
  const id = Number(useSearchParams().get("id"));
  const router = useRouter();
  const base = adminBase();
  const settings = useSettings();
  const [doc, setDoc] = useState<DocWithTotals | undefined | null>(null);
  const [items, setItems] = useState<DocItem[]>([]);
  const [client, setClient] = useState<Client | undefined>();
  const [payments, setPayments] = useState<Payment[]>([]);

  const refresh = useCallback(async () => {
    const d = await getDocument(id);
    if (!d || d.type !== "invoice") { setDoc(undefined); return; }
    setDoc(d);
    const [its, pays, c] = await Promise.all([getItems(id), getPayments(id), getClient(d.client_id)]);
    setItems(its);
    setPayments(pays);
    setClient(c);
  }, [id]);

  useEffect(() => { refresh(); }, [refresh]);

  if (doc === null) return null;
  if (doc === undefined || !client) return <p className="text-sm text-slate-500">Invoice not found.</p>;

  return (
    <DocumentView
      type="invoice" doc={doc} items={items} client={client} settings={settings} payments={payments}
      onStatusChange={async (status) => { await setDocumentStatus(id, status); refresh(); }}
      onDelete={async () => { if (confirm("Delete this invoice? This cannot be undone.")) { await deleteDocument(id); router.push(`${base}/invoices`); } }}
      onAddPayment={async (input) => { await addPayment(id, input); refresh(); }}
      onDeletePayment={async (paymentId) => { await deletePayment(id, paymentId); refresh(); }}
    />
  );
}

export default function InvoiceDetail() {
  return (
    <Suspense>
      <InvoiceView />
    </Suspense>
  );
}
