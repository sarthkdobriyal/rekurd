import Link from "next/link";
import { BoltIcon } from "./icons";

interface EmptyDashboardStateProps {
  eyebrow: string;
  title: string;
  body: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

export default function EmptyDashboardState({
  eyebrow,
  title,
  body,
  secondaryLabel,
  secondaryHref,
}: EmptyDashboardStateProps) {
  return (
    <div className="flex flex-col items-center px-6 py-16 text-center">
      <div className="relative mb-7 flex h-[120px] w-[120px] items-center justify-center rounded-full border-[1.5px] border-[rgba(232,98,58,0.4)] bg-[radial-gradient(circle_at_40%_40%,rgba(232,98,58,0.24),rgba(232,98,58,0.02))] shadow-[0_0_60px_rgba(232,98,58,0.2)]">
        <span className="pointer-events-none absolute inset-0 animate-[qs-pulse_2.8s_ease-out_infinite] rounded-full border-[1.5px] border-[rgba(232,98,58,0.35)]" />
        <span className="pointer-events-none absolute inset-0 animate-[qs-pulse_2.8s_ease-out_infinite] rounded-full border-[1.5px] border-[rgba(232,98,58,0.35)] [animation-delay:1.4s]" />
        <BoltIcon className="relative z-[1] h-10 w-7 text-[#e8623a]" />
      </div>
      <div className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.14em] text-[#e8623a]">
        {eyebrow}
      </div>
      <div className="mb-3 max-w-[320px] font-display text-[28px] italic leading-[1.15] text-white sm:text-[30px]">
        {title}
      </div>
      <div className="mb-7 max-w-[320px] text-[13px] leading-relaxed text-white/52">{body}</div>
      <Link
        href="/scan"
        className="mb-2.5 flex w-full max-w-[280px] items-center justify-center gap-2 rounded-full bg-[#e8623a] py-3.5 text-[13.5px] font-bold text-white transition-[filter] hover:brightness-110"
      >
        <BoltIcon className="h-4 w-2.5 text-white" />
        Scan a song
      </Link>
      {secondaryLabel && (
        <Link
          href={secondaryHref ?? "#"}
          className="w-full max-w-[280px] rounded-full border border-white/[0.14] py-3 text-[13px] font-medium text-white/52 transition-colors hover:border-white/28 hover:text-white"
        >
          {secondaryLabel}
        </Link>
      )}
    </div>
  );
}
