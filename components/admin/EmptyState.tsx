import Link from "next/link";

export function EmptyState({ text, actionLabel, actionHref }: { text: string; actionLabel?: string; actionHref?: string }) {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
        <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h9l3 3v15H6zM9 8h6M9 12h6M9 16h4" />
        </svg>
      </div>
      <p className="max-w-xs text-sm text-slate-500">{text}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary btn-sm">{actionLabel}</Link>
      )}
    </div>
  );
}
