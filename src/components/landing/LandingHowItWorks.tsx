import React, { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { howitworks } from "./floatingImages";
import Image from "next/image";
import { useScroll, useTransform, motion, useInView, useAnimation, Variants, AnimationControls } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

interface Props {}

export const LandingHowItWorks: React.FC<Props> = () => {
  const container = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-10vh", "10vh"]);

  return (
    <div
      ref={container}
      className="relative flex h-screen items-center justify-center overflow-hidden"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <Text />

      <div className="fixed left-0 top-[-10vh] h-[120vh] w-full">
        <motion.div style={{ y }} className="relative h-full w-full">
          <Image
            src={howitworks}
            fill
            alt="How it works background"
            className="object-cover lg:object-contain"
          />
        </motion.div>
      </div>
    </div>
  );
};

const Text = () => {

  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });

  const topWords = ["DISCOVER", "CONNECT", "JAM", "TEACH", "LEARN"];
  const bottomWords = ["HOW", "IT", "WORKS"];


  return (
    <div ref={containerRef} className="relative z-10 h-full w-full bg-transparent flex flex-col justify-between px-5 lg:max-w-7xl tracking-wider">
      <div className="flex justify-start">
        <div className="font-helicopta flex flex-col text-3xl  md:text-6xl">
          {topWords.map((word, index) => (
            <AnimatedWord key={word} delay={index * 0.25}>
              {word}
            </AnimatedWord>
          ))}
        </div>
      </div>

      <div className="flex  gap-y-2 justify-end items-end mt-auto">
        <div className="flex  items-center gap-y-3 flex-col">
       
        <div className="font-superChargedLazer flex  text-4xl  md:text-7xl text-right">
          {bottomWords.map((word, index) => (
            <AnimatedWord key={word} delay={index * 0.45}>
              {word}
            </AnimatedWord>
          ))}
          </div>
          <motion.div
            initial={{ opacity: 0,  x:200 }}
            animate={isInView ? { opacity: 1, y: 0, x:0 } : { }}
            transition={{
              type: "spring",
              mass: 2,
              damping: 30,
              stiffness: 200,
              delay: 1.2
            }}
            className=""
          >
             <Image src='/howitworks-downarrow.png' width={100} height={10} alt='scroll' className="object-contain lg:w-52"/>
          </motion.div>
          </div>
      </div>
    </div>
  );
};

interface AnimatedWordProps {
  children: string;
  delay: number;
}

const AnimatedWord: React.FC<AnimatedWordProps> = ({ children, delay }) => {
  const controls: AnimationControls = useAnimation();
  const ref = useRef<HTMLSpanElement>(null);
  const isInView: boolean = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [isInView, controls]);

  const variants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        mass: 2,
        damping: 30,
        stiffness: 200,
        delay: delay,
      }
    }
  };

  return (
    <motion.span
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={variants}
      className="inline-block"
    >
      {children}
    </motion.span>
  );
};