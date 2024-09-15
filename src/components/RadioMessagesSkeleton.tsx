import { FC } from 'react';

const SkeletonMessage = () => {
  return (
    <div className="flex flex-col mb-2 animate-pulse">
      <div className="h-2 bg-gray-800 rounded w-[45%] mb-1"></div>
      <div className="h-2 bg-gray-800 rounded w-1/4"></div>
    </div>
  );
};

const RadioMessagesSkeleton: FC = () => {
  return (
    <div className="flex flex-col p-4 gap-y-2">
      {Array.from({ length: 3 }).map((_, index) => (
        <SkeletonMessage key={index} />
      ))}
    </div>
  );
};

export default RadioMessagesSkeleton;