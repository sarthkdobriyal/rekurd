"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/scan", label: "Scan" },
  { href: "/", label: "Feed" },
  { href: "/discover", label: "Discover" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="absolute left-1/2 hidden -translate-x-1/2 items-center md:flex">
      {LINKS.map(({ href, label }) => {
        const isActive = href === "/" ? pathname === "/" : !!pathname?.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "rounded-md px-[15px] py-2 text-[13px] font-medium transition-colors",
              isActive ? "text-white" : "text-white/52 hover:text-white",
            )}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
