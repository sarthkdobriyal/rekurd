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
              className="flex gap-1 w-[50%] items-center justify-center bg-black"
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

        <div className="lg:absolute relative right-0 top-0 w-4/5 lg:w-1/2 h-full shadow-inner shadow-black z-10">
          <Image
            src={pictureUrl || '/hero.png'}
            alt='hero'
            width={800}
            height={800}
            className="mask-stripes object-cover w-full h-full  rounded-full aspect-square "
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-0 from-1%" />
          <div className="absolute inset-0 bg-gradient-to-b from-black opacity-60 from-1%" />
          <div className="absolute inset-0 bg-gradient-to-l from-black opacity-30 from-1%" />
          <div className="absolute inset-0 bg-gradient-to-r from-black opacity-30 from-1%" />
        </div>
      </div>
    </section>
  )
}
