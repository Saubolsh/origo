import { cn } from "@/shared/lib/cn";

interface ProductSpecificationsProps {
  specifications?: Record<string, string>;
  extraRows?: { label: string; value: string | number | boolean }[];
  className?: string;
  /** Section heading; defaults to English for inline/template usage without i18n. */
  title?: string;
}

export function ProductSpecifications({
  specifications = {},
  extraRows = [],
  className,
  title = "Specifications",
}: ProductSpecificationsProps) {
  const entries = [
    ...Object.entries(specifications).map(([k, v]) => ({ label: k, value: v })),
    ...extraRows.map((r) => ({
      label: r.label,
      value: String(r.value),
    })),
  ];
  if (!entries.length) return null;

  return (
    <div className={cn("rounded-lg border border-origo-zinc bg-origo-slate p-4", className)}>
      <h3 className="mb-3 font-semibold text-origo-white">{title}</h3>
      <dl className="space-y-2">
        {entries.map(({ label, value }) => (
          <div
            key={label}
            className="flex flex-col items-start gap-0.5 border-b border-origo-zinc/50 py-2 last:border-0 sm:flex-row sm:justify-between sm:gap-4"
          >
            <dt className="text-sm text-origo-muted">{label}</dt>
            <dd className="text-sm font-medium text-origo-white">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
