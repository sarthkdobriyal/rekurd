import { HTMLAttributes } from 'react'
import { LandingNavBar } from './LandingNavbar/landing.navbar'
import { LandingFooter } from './LandingFooter'

interface Props extends HTMLAttributes<HTMLElement> {
  navItems: {
    link: string
    title: string
    target?: '_blank'
  }[]
  children: React.ReactNode
}

export const LandingContainer: React.FC<Props> = ({
  navItems,
  children,
  ...props
}) => {
  return (
    <main {...props} className="dark">
      <div className={'bg-white scrollbar-hide text-black dark:bg-background dark:text-slate-200 flex-col flex gap-y-5 lg:gap-y-20 '}>
        {/* <LandingNavBar navItems={navItems} /> */}
        {children}
        <LandingFooter />
      </div>
    </main>
  )
}
