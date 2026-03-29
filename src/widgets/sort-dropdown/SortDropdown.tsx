"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";

export type SortOption =
  | "price-asc"
  | "price-desc";

interface SortDropdownProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

const OPTIONS: SortOption[] = [
  "price-asc",
  "price-desc",
];

export function SortDropdown({ value, onChange }: SortDropdownProps) {
  const t = useTranslations("products.sort");
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  /* close on Escape */
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  const handleSelect = useCallback(
    (option: SortOption) => {
      onChange(option);
      setOpen(false);
    },
    [onChange]
  );

  const label = (option: SortOption) => t(option);

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-origo-zinc bg-origo-slate
                   px-4 py-2 text-sm text-origo-white transition
                   hover:border-origo-accent/60 hover:bg-origo-charcoal
                   focus:outline-none focus:ring-2 focus:ring-origo-accent/40"
        aria-haspopup="listbox"
        aria-expanded={open}
        id="sort-dropdown-trigger"
      >
        {/* sort icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-origo-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 4h13M3 8h9M3 12h5m4 0l4 4m0 0l4-4m-4 4V4"
          />
        </svg>

        <span>{label(value)}</span>

        {/* chevron */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 text-origo-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <ul
          role="listbox"
          aria-labelledby="sort-dropdown-trigger"
          className="absolute right-0 z-30 mt-2 min-w-[200px] origin-top-right
                     rounded-lg border border-origo-zinc bg-origo-slate
                     py-1 shadow-xl shadow-black/40
                     animate-in fade-in slide-in-from-top-1"
        >
          {OPTIONS.map((option) => {
            const isActive = option === value;
            return (
              <li key={option} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => handleSelect(option)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-sm transition
                    ${
                      isActive
                        ? "text-origo-accent"
                        : "text-origo-silver hover:bg-origo-zinc/60 hover:text-origo-white"
                    }`}
                >
                  {/* checkmark for active */}
                  <span className="w-4 text-center">
                    {isActive && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="inline h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {label(option)}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
