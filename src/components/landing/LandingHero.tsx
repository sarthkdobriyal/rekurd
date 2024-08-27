import { HTMLAttributes, ReactNode } from 'react'
import LandingButton from './LandingButton'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { ArrowBigRightDash } from 'lucide-react'

interface Props extends HTMLAttributes<HTMLElement> {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  pictureUrl?: string
  socialProof?: ReactNode
}

export const LandingHero: React.FC<Props> = ({
  title,
  subtitle,
  buttonText,
  buttonLink,
  pictureUrl,
  socialProof = '',
  className,
  ...props
}) => {
  return (
    <section
      className={cn('', className)}
      {...props}
    >
      <div className="py-8 lg:py-44 px-5  max-w-7xl mx-auto  grid lg:grid-cols-2 place-items-center relative">
        <div className="relative z-10 p-4 md:p-0">
          <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold lg:tracking-tight xl:tracking-tighter">
            {title}
          </h1>
          <p className="text-lg mt-4 text-slate-600 dark:text-slate-400 max-w-xl">
            {subtitle}
          </p>
          <div className="mt-6 flex  gap-3">
            <LandingButton
              href={buttonLink || '/signup'}
              className="flex gap-1 w-[50%] items-center justify-center bg-background"
              rel="noopener"
              size="lg"
            >
              {buttonText}
            </LandingButton>
            <LandingButton size="md" href="/login" type="outline" className="md:hidden border-opacity-40  flex w-fit gap-x-2 hover:bg-foreground">
              Log In
              <ArrowBigRightDash />
            </LandingButton>
          </div>
          {socialProof && <div className="mt-6">{socialProof}</div>}
        </div>

        <div className="lg:absolute  w-full  right-0 top-0  lg:w-1/2 h-full">
          <Image
            src={pictureUrl || '/hero2.png'}
            alt='hero'
            width={1000}
            height={1000}
            className="mask-stripes object-contain w-full h-full aspect-auto"
          />

        </div>
      </div>
    </section>
  )
}
