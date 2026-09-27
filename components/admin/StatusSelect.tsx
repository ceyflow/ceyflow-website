"use client";

export function StatusSelect({
  action, defaultValue, options, className = "input py-1 text-xs capitalize",
}: {
  action: (fd: FormData) => void | Promise<void>;
  defaultValue: string;
  options: readonly string[];
  className?: string;
}) {
  return (
    <form action={action}>
      <select
        name="status"
        defaultValue={defaultValue}
        className={className}
        onChange={(e) => e.currentTarget.form?.requestSubmit()}
      >
        {options.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
    </form>
  );
}
