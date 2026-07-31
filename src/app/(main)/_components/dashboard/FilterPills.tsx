"use client";

import { cn } from "@/lib/utils";
import { FilterKey, filterCounts } from "./mock-data";

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: "friends", label: "Friends" },
  { key: "nearby", label: "Nearby" },
  { key: "discover", label: "Discover" },
  { key: "following", label: "Following" },
  { key: "saved", label: "Saved" },
];

interface FilterPillsProps {
  active: FilterKey;
  onChange: (key: FilterKey) => void;
}

export default function FilterPills({ active, onChange }: FilterPillsProps) {
  return (
    <div className="scrollbar-hide mb-5 flex gap-1.5 overflow-x-auto pb-0.5">
      {FILTERS.map(({ key, label }) => {
        const count = filterCounts[key];
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={cn(
              "flex-shrink-0 whitespace-nowrap rounded-full border px-3.5 py-1.5 text-xs font-medium transition-colors",
              isActive
                ? "border-white bg-white text-black"
                : "border-white/[0.07] text-white/52 hover:border-white/[0.14] hover:text-white",
            )}
          >
            {label}
            {typeof count === "number" && (
              <span className="ml-1.5 tabular-nums opacity-55">{count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
