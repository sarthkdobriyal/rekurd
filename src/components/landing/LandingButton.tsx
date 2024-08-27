import Link from 'next/link'
import { AnchorHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export interface IButton extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string
  size?: 'sm' | 'md' | 'lg'
  block?: boolean
  type?: 'outline' | 'primary' | 'inverted' | 'muted'
  children?: React.ReactNode
}

const LandingButton = (props: IButton) => {
  const {
    href,
    block,
    size = 'md',
    type = 'primary',
    className,
    children,
    ...remainingProps
  } = props

  const sizes = {
    lg: 'px-5 py-2.5',
    md: 'px-4 py-2',
    sm: 'px-2 py-1',
  }

  const styles = {
    outline:
      'bg-white  hover:text-black dark:hover:bg-zinc-800  border-2 border-black hover:bg-gray-100 text-black dark:bg-background dark:text-white dark:border-white',
    primary:
      'bg-background text-white hover:text-white dark:hover:text-white  border-2 border-transparent dark:bg-primary dark:text-white  ',
    inverted:
      'bg-white text-black hover:text-black dark:hover:text-black border-2 border-transparent hover:bg-gray-100 dark:bg-background dark:text-white',
    muted:
      'bg-gray-100 hover:text-black dark:hover:text-black hover:bg-gray-200 border-2 border-transparent text-black dark:bg-gray-700 dark:text-white',
  }

  return (
    <Link
      href={href}
      {...remainingProps}
      className={twMerge(
        'rounded font-semibold text-center transition focus-visible:ring-2 ring-offset-2 ring-gray-200',
        block && 'w-full',
        sizes[size],
        styles[type],
        className,
      )}
    >
      {children}
    </Link>
  )
}

export default LandingButton
