import { notFound } from "next/navigation";
import { getClients, getDocument, getItems, getSettings } from "../../../../../../lib/db";
import { DocumentForm } from "../../../../../../components/admin/DocumentForm";

export default async function EditInvoice({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = getDocument(Number(id));
  if (!doc || doc.type !== "invoice") notFound();
  const s = getSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Edit {doc.number}</h1>
      <DocumentForm type="invoice" clients={getClients()} doc={doc} items={getItems(doc.id)} defaultTerms={s.invoice_terms || ""} currency={s.currency || "LKR"} />
    </div>
  );
}
