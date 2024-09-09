import { FC } from 'react';

const SkeletonMessage= ({index}: {index: number}) => {
    const isEven = index % 2 === 0;
    // Generate a random width based on the index
  const widths = [ 'w-2/3', 'w-5/6'];
  const contentWidth = widths[index % widths.length];
  return (
    <div className={`${isEven && "ml-auto"} flex ${contentWidth}  flex-col bg-muted rounded-xl px-4 py-2 mb-2 animate-pulse`}>
      <div className={`h-2 bg-gray-800 rounded-xl w-3/4 mb-2 ${isEven && "ml-auto"}`}></div>
      <div className={`h-2 bg-gray-800 rounded-xl w-1/2 mb-2 ${isEven && "ml-auto"}`}></div>
    </div>
  );
};


const MessagesSkeleton: FC = () => {
  return (
    <div className='flex flex-col-reverse p-4 gap-y-6'>
      {Array.from({ length: 7 }).map((_, index) => (
        <SkeletonMessage key={index} index={index} />
      ))}
    </div>
  );
};

export default MessagesSkeleton;