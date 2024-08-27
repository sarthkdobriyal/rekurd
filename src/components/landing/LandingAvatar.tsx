import React from 'react';
import clsx from 'clsx';
import Image, { ImageProps } from 'next/image';

interface LandingAvatarProps extends Omit<ImageProps, 'src' | 'width' | 'height'> {
  size?: 'small' | 'medium' | 'large';
  src: string;
  width?: number;
  height?: number;
}

/**
 * Shows an avatar image.
 */
export const LandingAvatar = ({
  className,
  src,
  width = 128,
  height = 128,
  size = 'medium',
  ...remainingProps
}: LandingAvatarProps) => {
  return (
    <div
      className={clsx(
        'rounded-full border-2 border-solid border-primary-100',
        size === 'small' ? 'w-6 h-6' : '',
        size === 'medium' ? 'h-9 w-9' : '',
        size === 'large' ? 'h-16 w-16' : '',
        className
      )}
    >
      <Image
        src={src}
        width={width}
        height={height}
        alt="Avatar"
        className="rounded-full"
        
        // {...remainingProps}
      />
    </div>
  );
};