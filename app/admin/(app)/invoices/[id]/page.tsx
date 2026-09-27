import { notFound } from "next/navigation";
import { getClient, getDocument, getItems, getPayments, getSettings } from "../../../../../lib/db";
import { DocumentView } from "../../../../../components/admin/DocumentView";

export default async function InvoiceDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = getDocument(Number(id));
  if (!doc || doc.type !== "invoice") notFound();
  const client = getClient(doc.client_id)!;
  return <DocumentView type="invoice" doc={doc} items={getItems(doc.id)} client={client} settings={getSettings()} payments={getPayments(doc.id)} />;
}
