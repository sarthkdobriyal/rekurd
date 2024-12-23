'use client'

import {
  ArrowRightOutlined,
  CloseOutlined,
  MenuOutlined,
} from '@ant-design/icons'
import Link from 'next/link'
import { useState } from 'react'
import LandingButton from '../LandingButton'
import { motion, AnimatePresence } from 'framer-motion'
import { Logo } from '@/components/Logo'
import { useSession } from '@/app/(main)/SessionProvider'

export const LandingMobileNavbar = ({ navItems }: any) => {

  const isLoggedIn  = false
  const [open, setOpen] = useState(false)

  return (
    <div className="flex justify-between items-center w-full rounded-full px-2.5 py-1.5 transition duration-200">
      {/* <Logo isLabel height={40} /> */}
      <MenuOutlined
        className="text-black dark:text-white h-6 w-6"
        onClick={() => setOpen(!open)}
      />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, x: '-100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-white dark:bg-background z-50 flex flex-col items-start justify-start space-y-10 pt-5 text-xl text-zinc-600 transition duration-200 hover:text-zinc-800"
          >
            <div className="flex items-center justify-between w-full px-5">
              <Logo />
              <div className="flex items-center space-x-2">
                <CloseOutlined
                  className="h-8 w-8 text-black dark:text-white"
                  onClick={() => setOpen(!open)}
                />
              </div>
            </div>
            <div className="flex flex-col items-start justify-start gap-[14px] px-8">
              {navItems.map((navItem: any, idx: number) => (
                <>
                  {navItem.children && navItem.children.length > 0 ? (
                    <>
                      {navItem.children.map(
                        (childNavItem: any, idx: number) => (
                          <Link
                            key={`link=${idx}`}
                            href={childNavItem.link}
                            onClick={() => setOpen(false)}
                            className="relative max-w-[15rem] text-left text-2xl"
                          >
                            <span className="block text-black">
                              {childNavItem.title}
                            </span>
                          </Link>
                        ),
                      )}
                    </>
                  ) : (
                    <Link
                      key={`link=${idx}`}
                      href={navItem.link}
                      onClick={() => setOpen(false)}
                      className="relative"
                    >
                      <span className="block text-[26px] text-black dark:text-white">
                        {navItem.title}
                      </span>
                    </Link>
                  )}
                </>
              ))}
            </div>
            <div className="flex flex-row w-full items-start gap-2.5 px-8 py-4">
              {isLoggedIn && (
                <LandingButton size="sm" href="/home">
                  Dashboard <ArrowRightOutlined />
                </LandingButton>
              )}
              {!isLoggedIn && (
                <>
                  <LandingButton href="/register" size="sm">
                    Sign Up
                  </LandingButton>
                  <LandingButton href="/login" size="sm" type='outline'>
                    Login
                  </LandingButton>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
