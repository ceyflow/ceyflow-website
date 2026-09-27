import { notFound } from "next/navigation";
import { getClient, getDocument, getItems, getSettings } from "../../../../../lib/db";
import { DocumentView } from "../../../../../components/admin/DocumentView";

export default async function QuoteDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const doc = getDocument(Number(id));
  if (!doc || doc.type !== "quote") notFound();
  const client = getClient(doc.client_id)!;
  return <DocumentView type="quote" doc={doc} items={getItems(doc.id)} client={client} settings={getSettings()} />;
}
