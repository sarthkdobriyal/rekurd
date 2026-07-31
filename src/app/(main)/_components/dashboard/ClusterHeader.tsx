import { PinIcon } from "./icons";

interface ClusterHeaderProps {
  area: string;
  count: number;
}

export default function ClusterHeader({ area, count }: ClusterHeaderProps) {
  return (
    <div className="mb-5 flex items-center gap-3.5 rounded-2xl border border-[rgba(232,98,58,0.2)] bg-gradient-to-br from-[rgba(232,98,58,0.08)] to-[rgba(232,98,58,0.02)] px-[18px] py-4">
      <span className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full border border-[rgba(232,98,58,0.4)] bg-[rgba(232,98,58,0.16)] text-[#e8623a]">
        <PinIcon />
      </span>
      <div className="flex-1">
        <div className="mb-0.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#e8623a]">
          Nearby · {area}
        </div>
        <div className="text-sm font-semibold leading-snug text-white">
          <strong className="font-bold text-[#e8623a]">{count} people</strong> scanned this
          within 1km tonight
        </div>
      </div>
      <button className="flex-shrink-0 rounded-full border border-white/[0.14] px-3.5 py-1.5 text-[11.5px] font-medium text-white/52 transition-colors hover:border-white/28 hover:text-white">
        Change area
      </button>
    </div>
  );
}
