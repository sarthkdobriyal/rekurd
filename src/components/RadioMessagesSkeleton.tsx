import { FC } from 'react';

const SkeletonMessage = () => {
  return (
    <div className="flex flex-col mb-2 animate-pulse">
      <div className="h-2 bg-zinc-800 rounded w-[45%] mb-1"></div>
      <div className="h-2 bg-zinc-800 rounded w-1/4"></div>
    </div>
  );
};

const RadioMessagesSkeleton: FC = () => {
  return (
    <div className="flex flex-col  gap-y-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonMessage key={index} />
      ))}
    </div>
  );
};

export default RadioMessagesSkeleton;