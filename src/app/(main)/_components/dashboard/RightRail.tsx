import { TrendUpIcon } from "./icons";
import { RailItemData } from "./mock-data";

function RailRow({ item }: { item: RailItemData }) {
  return (
    <div className="flex cursor-pointer items-center gap-2.5 border-b border-white/[0.07] px-3 py-2.5 transition-colors last:border-b-0 hover:bg-white/[0.04]">
      {typeof item.rank === "number" && (
        <span className="w-4 flex-shrink-0 text-right font-mono text-[10.5px] text-white/26">
          {String(item.rank).padStart(2, "0")}
        </span>
      )}
      {item.artUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.artUrl}
          alt=""
          className="h-[34px] w-[34px] flex-shrink-0 rounded-[7px] border border-white/[0.06] object-cover"
        />
      ) : (
        <div
          className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-[7px] border border-white/[0.06] text-sm"
          style={{ background: item.artGradient }}
        >
          {item.emoji}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="truncate text-xs font-medium text-white">{item.title}</div>
        <div className="mt-px truncate text-[10.5px] text-white/52">{item.subtitle}</div>
      </div>
      {item.trend && (
        <span className="flex flex-shrink-0 items-center gap-1 text-[10.5px] font-semibold tabular-nums text-[#e8623a]">
          <TrendUpIcon /> {item.trend}
        </span>
      )}
    </div>
  );
}

interface RailSectionProps {
  title: string;
  linkLabel: string;
  items: RailItemData[];
}

export function RailSection({ title, linkLabel, items }: RailSectionProps) {
  return (
    <div className="mb-[22px]">
      <div className="mb-2.5 flex items-center justify-between px-0.5">
        <div className="text-[10.5px] font-bold uppercase tracking-[0.11em] text-white/26">
          {title}
        </div>
        <button className="text-[11px] text-white/52 hover:text-white">{linkLabel}</button>
      </div>
      <div className="overflow-hidden rounded-xl border border-white/[0.07] bg-[#0f0f0f]">
        {items.map((item) => (
          <RailRow key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
