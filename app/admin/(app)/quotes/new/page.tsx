"use client";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { getClients, saveDocument, type Client, type DocInput } from "../../../../../lib/adminData";
import { useSettings } from "../../../../../lib/publicData";
import { DocumentForm } from "../../../../../components/admin/DocumentForm";

function NewQuoteForm() {
  const clientParam = useSearchParams().get("client");
  const router = useRouter();
  const settings = useSettings();
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => { getClients().then(setClients); }, []);

  async function handleSave(input: DocInput) {
    const result = await saveDocument("quote", input, settings);
    if (!result.error && result.id) router.push(`/admin/quotes/view?id=${result.id}`);
    return result;
  }

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">New quotation</h1>
      <DocumentForm
        type="quote"
        clients={clients}
        defaultClientId={clientParam ? Number(clientParam) : undefined}
        defaultTerms={settings.quote_terms || ""}
        currency={settings.currency || "LKR"}
        onSave={handleSave}
      />
    </div>
  );
}

export default function NewQuote() {
  return (
    <Suspense>
      <NewQuoteForm />
    </Suspense>
  );
}
