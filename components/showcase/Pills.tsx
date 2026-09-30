import { COMPLAINT_STATUS_COLORS, ORDER_STAGES, PRIORITY_COLORS, STAGE_COLORS, type ComplaintStatus, type OrderStage, type Priority } from "@/lib/showcaseData";

export function StagePill({ stage }: { stage: OrderStage }) {
  const c = STAGE_COLORS[stage];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${c.text} ${c.bg}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {ORDER_STAGES[stage].label}
    </span>
  );
}

export function PriorityPill({ priority }: { priority: Priority }) {
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold ${PRIORITY_COLORS[priority]}`}>{priority}</span>
  );
}

export function ComplaintStatusPill({ status }: { status: ComplaintStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${COMPLAINT_STATUS_COLORS[status]}`}>{status}</span>
  );
}
