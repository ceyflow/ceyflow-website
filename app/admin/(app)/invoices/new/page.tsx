import { DocumentForm } from "../../../../../components/admin/DocumentForm";
import { getClients, getSettings } from "../../../../../lib/db";

export default async function NewInvoice({ searchParams }: { searchParams: Promise<{ client?: string }> }) {
  const { client } = await searchParams;
  const s = getSettings();
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">New invoice</h1>
      <DocumentForm
        type="invoice"
        clients={getClients()}
        defaultClientId={client ? Number(client) : undefined}
        defaultTerms={s.invoice_terms || ""}
        currency={s.currency || "LKR"}
      />
    </div>
  );
}
