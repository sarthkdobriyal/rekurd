import React, { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";
import Link from "next/link";

interface Props extends HTMLAttributes<HTMLElement> {
  title?: string;
  subtitle?: string;
  buttonText?: string;
  buttonLink?: string;
}

export const LandingCTA: React.FC<Props> = ({
  title,
  subtitle,
  buttonText = "Get Started",
  buttonLink = "#",
  className,
}) => {
  return (
    <section
      className={cn("relative h-screen w-full  overflow-hidden ", className)}
    >
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(0, 0, 10)"
        gradientBackgroundEnd="rgb(10, 10, 30)"
        firstColor="0, 0, 60"
        secondColor="60, 0, 60"
        thirdColor="0, 30, 60"
        fourthColor="30, 0, 60"
        fifthColor="0, 60, 60"
        pointerColor="180, 100, 255"
        size="100%"
        blendingValue="hard-light"
      />
      <div className="absolute font-poppins inset-0 flex items-center justify-center">
        <div className="w-full  md:max-w-3xl lg:max-w-5xl rounded-xl   bg-black bg-opacity-30 px-6 py-12 shadow-2xl backdrop-blur-sm">
          <div className="text-center ">
            <h2 className="mb-5 text-2xl  font-extrabold leading-tight text-white md:text-4xl lg:text-5xl">
              {title}
            </h2>
            <p className="mb-14 text-sm leading-relaxed text-gray-300 md:text-2xl">
              {subtitle}
            </p>
            <Link
              href={buttonLink}
              className="inline-flex font-poppins w-[60%] transform animate-shimmer items-center justify-center rounded-md border  bg-[linear-gradient(110deg,#4c1d95,45%,#6d28d9,55%,#4c1d95)]   bg-[length:200%_100%] px-8 py-3  md:text-2xl  font-semibold text-white  transition-colors duration-1000 ease-in-out hover:scale-101 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-50"
            >
              {buttonText}
              <svg
                className="-mr-1 ml-2 h-5 w-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
