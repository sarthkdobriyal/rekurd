import Link from "next/link";
import { BoltIcon } from "./icons";

export default function QuickScanBar() {
  return (
    <Link
      href="/scan?autostart=1"
      className="mb-5 flex items-center gap-3.5 rounded-full border border-[rgba(232,98,58,0.22)] bg-gradient-to-br from-[rgba(232,98,58,0.08)] to-[rgba(232,98,58,0.02)] py-2.5 pl-3 pr-[18px] transition-colors hover:border-[rgba(232,98,58,0.45)] hover:from-[rgba(232,98,58,0.14)] hover:to-[rgba(232,98,58,0.04)]"
    >
      <span className="relative flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(232,98,58,0.6)] bg-[radial-gradient(circle_at_40%_40%,rgba(232,98,58,0.28),rgba(232,98,58,0.06))] shadow-[0_0_20px_rgba(232,98,58,0.25)]">
        <span className="pointer-events-none absolute inset-0 animate-[qs-pulse_2.4s_ease-out_infinite] rounded-full border border-[rgba(232,98,58,0.4)]" />
        <span className="pointer-events-none absolute inset-0 animate-[qs-pulse_2.4s_ease-out_infinite] rounded-full border border-[rgba(232,98,58,0.4)] [animation-delay:1.2s]" />
        <BoltIcon className="relative z-[1] text-[#e8623a]" />
      </span>
      <span className="flex-1">
        <span className="block text-[13px] font-semibold tracking-tight text-white">
          Scan a song
        </span>
        <span className="mt-px block text-[11px] text-white/52">
          Tap to identify what&apos;s playing around you
        </span>
      </span>
      <span className="rounded-md border border-white/[0.07] bg-white/[0.03] px-1.5 py-0.5 font-mono text-[10.5px] text-white/26">
        S
      </span>
    </Link>
  );
}
