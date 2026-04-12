import { cn } from "@/shared/lib/cn";

export interface ProductAttributeRow {
  slug: string;
  label: string;
  value: string;
}

interface ProductSpecificationsProps {
  specifications?: Record<string, string>;
  /** API attributes and other ordered rows; merged before `specifications`. */
  attributeRows?: ProductAttributeRow[];
  extraRows?: { label: string; value: string | number | boolean }[];
  className?: string;
  /** Section heading; defaults to English for inline/template usage without i18n. */
  title?: string;
}

export function ProductSpecifications({
  specifications = {},
  attributeRows = [],
  extraRows = [],
  className,
  title = "Specifications",
}: ProductSpecificationsProps) {
  const entries = [
    ...attributeRows.map((r) => ({
      rowKey: r.slug,
      label: r.label,
      value: r.value,
    })),
    ...Object.entries(specifications).map(([k, v]) => ({
      rowKey: `spec:${k}`,
      label: k,
      value: v,
    })),
    ...extraRows.map((r, i) => ({
      rowKey: `extra:${i}:${r.label}`,
      label: r.label,
      value: String(r.value),
    })),
  ];
  if (!entries.length) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-origo-zinc/80 bg-origo-slate/80 p-4 shadow-sm backdrop-blur-sm sm:p-5",
        className,
      )}
    >
      <h3 className="mb-4 text-sm font-semibold tracking-wide text-origo-white">
        {title}
      </h3>
      <dl className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
        {entries.map(({ rowKey, label, value }) => (
          <div
            key={rowKey}
            className="flex flex-col gap-1 rounded-lg border border-origo-zinc/50 bg-origo-zinc/15 px-3 py-2.5"
          >
            <dt className="text-xs font-medium uppercase tracking-wide text-origo-muted">
              {label}
            </dt>
            <dd className="text-sm font-semibold leading-snug text-origo-white">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
