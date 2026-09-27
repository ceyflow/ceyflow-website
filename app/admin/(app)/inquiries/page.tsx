"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getInquiries, setInquiryStatus, convertInquiry, type Inquiry } from "../../../../lib/adminData";
import { Badge } from "../../../../components/admin/Badge";
import { StatusSelect } from "../../../../components/admin/StatusSelect";
import { date } from "../../../../lib/format";

const statuses = ["new", "contacted", "converted", "closed"];

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const router = useRouter();

  function refresh() {
    getInquiries().then(setInquiries);
  }
  useEffect(refresh, []);

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold">Website inquiries</h1>
      {inquiries.length === 0 ? (
        <div className="card p-8 text-center text-sm text-slate-500">No inquiries submitted yet.</div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((i) => (
            <div key={i.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{i.name} {i.company && <span className="font-normal text-slate-500">· {i.company}</span>}</p>
                  <p className="text-sm text-slate-500">{[i.email, i.phone].filter(Boolean).join(" · ")}</p>
                  {i.interest && <p className="mt-1 text-sm"><span className="font-medium">Interested in:</span> {i.interest}</p>}
                  {i.message && <p className="mt-2 max-w-2xl text-sm text-slate-600">{i.message}</p>}
                  <p className="mt-2 text-xs text-slate-400">{date(i.created_at)}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge value={i.status} />
                  <div className="flex gap-2">
                    <StatusSelect
                      action={async (fd) => { await setInquiryStatus(i.id, String(fd.get("status"))); refresh(); }}
                      defaultValue={i.status}
                      options={statuses}
                    />
                    {!i.client_id && (
                      <button
                        onClick={async () => { const clientId = await convertInquiry(i.id); if (clientId) router.push(`/admin/clients/view?id=${clientId}`); }}
                        className="btn-secondary btn-sm"
                      >
                        Convert to client
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
