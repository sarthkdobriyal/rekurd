import Link from "next/link";
import { PlayIcon } from "@/app/(main)/_components/dashboard/icons";

export interface ScanTile {
  id: string;
  title: string;
  artist: string;
  artGradient: string;
  emoji: string;
  timeAgo: string;
}

export default function ScanGrid({ scans }: { scans: ScanTile[] }) {
  return (
    <div>
      <div className="mb-4 flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.18em] text-white/40">
        <span>Scans</span>
        <span className="h-px flex-1 bg-white/[0.06]" />
      </div>
      <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5">
        {scans.map((scan) => (
          <Link
            key={scan.id}
            href="#"
            className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-xl border border-white/[0.06] p-2.5 transition-transform hover:-translate-y-0.5 sm:p-3.5"
            style={{ background: scan.artGradient }}
          >
            <span className="absolute right-2 top-2 text-lg opacity-70 sm:text-2xl">
              {scan.emoji}
            </span>
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-sm">
                <PlayIcon className="h-4 w-4" />
              </span>
            </div>
            <div className="relative z-[1]">
              <div className="truncate font-display text-[13px] italic leading-tight text-white sm:text-[15px]">
                {scan.title}
              </div>
              <div className="truncate text-[10px] text-white/50 sm:text-[11px]">
                {scan.artist} · {scan.timeAgo}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
