'use client'

import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  href: string
  children: ReactNode
  active?: boolean
  className?: string
  target?: '_blank'
}

export function LandingNavBarItem({
  children,
  href,
  active,
  target,
  className,
}: Props) {
  const pathname = usePathname()

  return (
    <Link
      href={href}
      className={cn(
        'text-lg flex items-center justify-center   leading-[110%] px-4 py-2 rounded-md   dark:hover:text-white hover:text-white text-muted dark:text-muted-dark',
        (active || pathname?.includes(href)) &&
          ' text-muted-foreground',
        className,
      )}
      target={target}
    >
      {children}
    </Link>
  )
}
