import { FC } from 'react';

const SkeletonMessage= ({index}: {index: number}) => {
    const isEven = index % 2 === 0;
  return (
    <div className={`${isEven && "ml-auto"} flex w-full max-w-[30%] flex-col gap-2  bg-muted rounded-xl px-4 py-2 mb-2 animate-pulse`}>
      <div className="h-4 bg-slate-800 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-slate-800 rounded w-1/2"></div>
    </div>
  );
};


const MessagesSkeleton: FC = () => {
  return (
    <div className='flex flex-col-reverse py-2'>
      {Array.from({ length: 5 }).map((_, index) => (
        <SkeletonMessage key={index} index={index} />
      ))}
    </div>
  );
};

export default MessagesSkeleton;