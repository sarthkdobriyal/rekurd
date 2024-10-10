"use client";

// import { useUserContext } from '@/core/context'
import { ArrowRightOutlined } from "@ant-design/icons";

import { Logo } from "@/components/Logo";
import LandingButton from "../LandingButton";
import { LandingNavBarItem } from "./landing.navbar.items";
import { ArrowBigRightDash } from "lucide-react";

type Props = {
  navItems: {
    link: string;
    title: string;
    target?: "_blank";
  }[];
};

export const LandingDesktopNavbar = ({ navItems }: Props) => {
  //   const { isLoggedIn } = useUserContext()
  const isLoggedIn = false;

  return (
    <div className="relative flex w-full justify-between rounded-full bg-transparent px-4 py-2 transition duration-200">
      <div className="flex flex-row items-center gap-2">
        {/* <Logo isLabel /> */}
        <div className="flex items-center gap-1.5 pl-8">
          {navItems.map((item) => (
            <LandingNavBarItem
              href={item.link}
              key={item.title}
              target={item.target}
            >
              {item.title}
            </LandingNavBarItem>
          ))}
        </div>
      </div>
      <div className="flex items-center space-x-4">
        {isLoggedIn && (
          <LandingButton size="sm" href="/home">
            Dashboard <ArrowRightOutlined />
          </LandingButton>
        )}
        {!isLoggedIn && (
          <>
            <LandingButton size="sm" href="/signup">
              Get Started
            </LandingButton>
            <LandingButton size="sm" href="/login" type="muted" className="flex gap-x-2">
              Log In
              <ArrowBigRightDash />
            </LandingButton>
          </>
        )}
      </div>
    </div>
  );
};
