import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";

interface ChoiceCardProps {
  icon: React.ReactNode;
  badge?: string;
  title: string;
  description: string;
  bullets: string[];
  ctaLabel: string;
  accent?: boolean;
  href: string;
}

export default function ChoiceCard({
  icon,
  badge,
  title,
  description,
  bullets,
  ctaLabel,
  accent,
  href,
}: ChoiceCardProps) {
  return (
    <a
      href={href}
      className={cn(
        "group relative flex min-h-[280px] flex-row items-start gap-3.5 overflow-hidden rounded-2xl border p-5 transition-all duration-200 sm:flex-col sm:gap-3.5 sm:p-7",
        accent
          ? "border-[rgba(232,98,58,0.28)] bg-gradient-to-b from-[rgba(232,98,58,0.06)] to-[rgba(232,98,58,0.02)] hover:border-[rgba(232,98,58,0.55)] hover:shadow-[0_12px_48px_rgba(232,98,58,0.14)]"
          : "border-white/[0.08] bg-white/[0.04] hover:-translate-y-0.5 hover:border-white/[0.16] hover:bg-white/[0.08]",
      )}
    >
      {badge && (
        <span className="absolute right-3 top-3 rounded-full border border-[rgba(232,98,58,0.3)] bg-[rgba(232,98,58,0.12)] px-2.5 py-1 text-[8.5px] font-bold uppercase tracking-[0.14em] text-[#e8623a] sm:right-4 sm:top-4 sm:text-[9.5px] sm:px-[10px]">
          {badge}
        </span>
      )}

      <div
        className={cn(
          "flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl border sm:h-14 sm:w-14 sm:rounded-2xl",
          accent
            ? "border-[rgba(232,98,58,0.32)] bg-[rgba(232,98,58,0.12)] text-[#e8623a]"
            : "border-white/[0.08] bg-white/[0.08] text-white/52",
        )}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1 pt-0.5 sm:pt-0">
        <div className="mb-1.5 font-display text-[22px] italic leading-[1.1] text-white sm:mb-0 sm:text-[30px]">
          {title}
        </div>
        <div className="mb-2.5 text-xs leading-relaxed text-white/52 sm:mb-0 sm:flex-1 sm:text-[13.5px]">
          {description}
        </div>
        <div className="hidden flex-col gap-[7px] pt-1.5 sm:flex">
          {bullets.map((bullet) => (
            <div
              key={bullet}
              className="flex items-center gap-2 text-xs text-white/28"
            >
              <span
                className={cn(
                  "h-[3px] w-[3px] flex-shrink-0 rounded-full",
                  accent ? "bg-[#e8623a]" : "bg-white/28",
                )}
              />
              {bullet}
            </div>
          ))}
        </div>
        <div
          className={cn(
            "flex items-center gap-1.5 text-[11.5px] font-semibold tracking-wide sm:mt-auto sm:justify-between sm:pt-3.5 sm:text-[12.5px]",
            accent ? "text-[#e8623a]" : "text-white",
          )}
        >
          <span>{ctaLabel}</span>
          <ArrowRightIcon className="transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </a>
  );
}
