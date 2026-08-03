const ArtistsCardSkeleton: React.FC = () => {
  return (
    <div className="flex animate-pulse flex-col overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0f0f0f]">
      <div className="h-44 w-full bg-white/[0.06]" />
      <div className="flex flex-col gap-3.5 p-4">
        <div className="flex flex-wrap gap-1.5">
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} className="h-4 w-16 rounded-full bg-white/[0.06]" />
          ))}
        </div>
        <div className="h-3 w-full rounded bg-white/[0.06]" />
        <div className="h-3 w-2/3 rounded bg-white/[0.06]" />
        <div className="mt-1 h-9 w-full rounded-md bg-white/[0.06]" />
      </div>
    </div>
  );
};

export default ArtistsCardSkeleton;
