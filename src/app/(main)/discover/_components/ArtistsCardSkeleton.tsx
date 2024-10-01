
const ArtistsCardSkeleton: React.FC = () => {
  return (
    <div className="flex-col flex min-h-[60%] w-full min-w-[97%] snap-y snap-center overflow-auto scrollbar-hide rounded-lg text-white shadow-lg">
      <div className="relative h-64 w-full bg-muted animate-pulse"></div>
      <div className="space-y-4 p-4">
        <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
        <div className="flex flex-wrap gap-2 w-full">
      {[...Array(3)].map((_, index) => (
        <span
          key={index}
          className="rounded-full bg-muted px-8 py-2 font-sans text-sm animate-pulse"
        >
          &nbsp;
        </span>
      ))}
    </div>
    <div className="h-4 bg-muted rounded animate-pulse w-1/2"></div>
    <div className="mb-4 flex flex-col gap-1 text-lg italic">
      <div className="flex flex-wrap overflow-hidden whitespace-pre-line break-words">
        <div className="h-4 bg-muted rounded animate-pulse w-full mb-2"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-3/4 mb-2"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-2/3 mb-2"></div>
      </div>
    </div>
      </div>
    </div>
  );
};

export default ArtistsCardSkeleton;