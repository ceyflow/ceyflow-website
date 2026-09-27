const paths: Record<string, React.ReactNode> = {
  "order-management": <path d="M4 5h16M4 12h16M4 19h10M17 17l2 2 3-4" />,
  "delivery-tracking": <path d="M3 7h11v9H3zM14 10h4l3 3v3h-7M7 19a2 2 0 100-4 2 2 0 000 4zM17 19a2 2 0 100-4 2 2 0 000 4z" />,
  "sms-automation": <path d="M4 5h16v11H8l-4 4zM8 9h8M8 12h5" />,
  "inventory-production": <path d="M3 21V10l5 3V10l5 3V10l5 3V5h3v16zM7 17h2M12 17h2M17 17h2" />,
};

export function SystemIcon({ slug, className = "" }: { slug: string; className?: string }) {
  return (
    <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-700 ring-1 ring-brand-100 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {paths[slug] ?? <circle cx="12" cy="12" r="8" />}
      </svg>
    </span>
  );
}
