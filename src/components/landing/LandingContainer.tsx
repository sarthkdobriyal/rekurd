import { HTMLAttributes } from "react";
import { LandingNavBar } from "./LandingNavbar/landing.navbar";
import { LandingFooter } from "./LandingFooter";
import { cn } from "@/lib/utils";

interface Props extends HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  className?: string;
}

export const LandingContainer: React.FC<Props> = ({ children, className }) => {
  return (
    <main className="dark">
      <div
        className={cn(
          "scrollbar-hide relative max-w-full   flex flex-col gap-y-5 bg-white text-black dark:bg-background dark:text-slate-200 lg:gap-y-20",
          className,
        )}
      >
        {children}
        <LandingFooter />
      </div>
    </main>
  );
};
