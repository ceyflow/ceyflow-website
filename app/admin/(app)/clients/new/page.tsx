import { ClientForm } from "../../../../../components/admin/ClientForm";

export default function NewClient() {
  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">New client</h1>
      <ClientForm />
    </div>
  );
}
