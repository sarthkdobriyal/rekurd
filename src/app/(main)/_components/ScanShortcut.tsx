"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

// Global "S" hotkey → jump to the scanner and auto-start a scan.
export default function ScanShortcut() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "s" && e.key !== "S") return;
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (pathname === "/scan") return;

      const el = e.target as HTMLElement | null;
      if (
        el?.isContentEditable ||
        ["INPUT", "TEXTAREA", "SELECT"].includes(el?.tagName ?? "")
      ) {
        return;
      }

      e.preventDefault();
      router.push("/scan?autostart=1");
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router, pathname]);

  return null;
}
