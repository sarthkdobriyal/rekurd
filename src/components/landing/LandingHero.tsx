"use client";

import React, { HTMLAttributes, ReactNode } from "react";
import Image from "next/image";
import {
  useMotionValue,
  useSpring,
  motion,
  MotionValue,
  useTransform,
  Variants,
} from "framer-motion";
import { cn } from "@/lib/utils";

import {
  floating1,
  floating2,
  floating3,
  floating4,
  floating5,
  floating6,
  floating7,
  floating8,
} from "./floatingImages";
import { ChevronDown } from "lucide-react";
import {
  TypewriterEffect,
  TypewriterEffectSmooth,
} from "../ui/typewriter-effect";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Props extends HTMLAttributes<HTMLElement> {}

const imageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: {
      delay: i * 0.2,
      duration: 5.0,
      ease: [0.6, -0.05, 0.01, 0.99],
      type: "spring",
      stiffness: 50,
      damping: 10,
    },
  }),
  exit: (i: number) => ({
    opacity: 0,
    scale: 1.4,
    transition: {
      delay: i * 0.1,
      duration: 0.7,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  }),
};

const textVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    width: "100%",
    opacity: 1,
    transition: {
      duration: 3.0, // Increased duration for smoother animation
      ease: "easeInOut", // Smooth easing function
      staggerChildren: 0.1, // Reduced stagger for smoother animation
      from: 2,
    },
  },
  exit: {
    width: "100%",
    opacity: 0,
    transition: {
      duration: 1.5, // Increased duration for smoother exit
      ease: "easeInOut", // Smooth easing function
    },
  },
};

const letterVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.5, // Increased duration for smoother animation
      ease: "easeInOut", // Smooth easing function
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 1.0, // Increased duration for smoother exit
      ease: "easeInOut", // Smooth easing function
    },
  },
};
// Define reusable transition properties
const springTransition = {
  type: "spring",
  mass: 5,
  stiffness: 50,
  damping: 20,
};



const duration = 1.0;

const typeWriterWords = [
  {
    text: "For",
  },
  {
    text: "MUSICIANS",
    className: "text-blue-400 ",
  },
];

export const LandingHero: React.FC<Props> = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig: { damping: number; stiffness: number } = {
    damping: 25,
    stiffness: 150,
  };
  const moveX: MotionValue<number> = useSpring(mouseX, springConfig);
  const moveY: MotionValue<number> = useSpring(mouseY, springConfig);

  const moveXMedium = useTransform(moveX, (value) => value * 0.5);
  const moveYMedium = useTransform(moveY, (value) => value * 0.5);

  const moveXSlow = useTransform(moveX, (value) => value * 0.25);
  const moveYSlow = useTransform(moveY, (value) => value * 0.25);

  const handleMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const { clientX, clientY } = event;
    const { left, top, width, height } =
      event.currentTarget.getBoundingClientRect();
    const xPercent = (clientX - left) / width - 0.5;
    const yPercent = (clientY - top) / height - 0.5;

    mouseX.set(xPercent * 100);
    mouseY.set(yPercent * 100);
  };

  return (
    <motion.section
      onMouseMove={handleMouseMove}
      className={cn(
        "relative flex h-screen w-full items-center justify-center overflow-hidden bg-dot-black/[0.2] dark:bg-dot-white/[0.2]",
      )}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>

      <motion.div
        className="absolute left-1/2 top-1/2 z-20 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center overflow-hidden text-center"
        variants={textVariants}
      >
        <motion.span className="inline-block gap-y-2 whitespace-nowrap font-superChargedLazer text-5xl   md:text-7xl font-extrabold tracking-wide lg:text-9xl">
          {"OUTSOUND.".split("").map((char, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              style={{ display: "inline-block" }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
          {/* <span className="text-sm tracking-widest text-right w-full pr-36 font-kochire">CONNECTING MUSICIANS , CREATING OPPORTUNITIES</span> */}
      </motion.div>
      <div className="absolute inset-0 w-full">
        <motion.div
          className="brightness-70 absolute inset-0 filter"
          style={{ x: moveX, y: moveY }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "70%", top: "70%" }}
            transition={{
              delay: 0.4,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating1}
              alt="Floating Image 1"
              className="w-36 sm:w-42 md:left-[80%] md:w-60"
              width={300}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "5%", top: "15%" }}
            transition={{
              delay: 0.2,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating2}
              alt="Floating Image 2"
              className="w-36 sm:w-42 md:left-[10%] md:top-[15%] md:w-64"
              width={300}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "25%", top: "0%" }}
            transition={{
              delay: 0.6,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating3}
              alt="Floating Image 3"
              className="w-36 sm:w-42 md:left-[35%] md:top-0 md:w-max"
              width={225}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="brightness-60 absolute inset-0 filter"
          style={{ x: moveXMedium, y: moveYMedium }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "0%", top: "60%" }}
            transition={{
              delay: 0.3,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating4}
              alt="Floating Image 4"
              className="w-36 sm:w-42 md:left-[5%] md:top-[60%] md:w-96"
              width={250}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "80%", top: "30%" }}
            transition={{
              delay: 0.5,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating5}
              alt="Floating Image 5"
              className="w-36 sm:w-42 md:left-[85%] md:top-[5%] md:w-80"
              width={200}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "57%", top: "50%" }}
            transition={{
              delay: 0.4,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating6}
              alt="Floating Image 6"
              className="z-5 w-36 sm:w-42 md:left-[60%] md:top-[60%] md:w-max"
              width={225}
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute inset-0 brightness-50 filter"
          style={{ x: moveXSlow, y: moveYSlow }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "55%", top: "5%" }}
            transition={{
              delay: 0.6,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating7}
              alt="Floating Image 7"
              className="w-32 md:left-[60%] md:top-[30%] md:w-80"
              width={200}
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.6, left: "50%", top: "50%" }}
            animate={{ opacity: 1, scale: 1, left: "20%", top: "85%" }}
            transition={{
              delay: 0.7,
              duration,
              ...springTransition,
              ease: [0.6, -0.05, 0.01, 0.99],
            }}
            className="absolute"
          >
            <Image
              src={floating8}
              alt="Floating Image 8"
              className="w-32 md:left-[40%] md:top-[75%] md:w-96"
              width={200}
            />
          </motion.div>
        </motion.div>
      </div>
      {/* Know More Section */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 transform text-center">
        {/* <div className="text-lg font-sans text-muted-foreground font-semibold">KNOW MORE</div> */}
        <div className="mt-2 flex flex-col items-center">
          <div className="text-pretty opacity-45">
            <Image
              width={50}
              alt="scroll"
              height={50}
              src="/down-arrow.png"
              className="animate-bounce opacity-25"
            />
          </div>
        </div>
      </div>
    </motion.section>
  );
};
