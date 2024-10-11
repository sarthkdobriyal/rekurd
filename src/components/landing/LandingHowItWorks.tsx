import React, { useRef } from "react";
import { cn } from "@/lib/utils";
import { howitworks } from "./floatingImages";
import Image from "next/image";
import { useScroll, useTransform, motion } from "framer-motion";
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
            style={{ objectFit: "cover" }}
          />
        </motion.div>
      </div>
    </div>
  );
};

const Text = () => {
  return (
    <div className="relative z-10 h-full w-full bg-transparent flex flex-col justify-between p-14 md:p-52">
      <div className="flex justify-start">
        <div className="font-serif text-4xl text-muted-foreground md:text-6xl">
          <span className="block">DISCOVER</span>
          <span className="block">CONNECT</span>
          <span className="block">JAM</span>
          <span className="block">TEACH</span>
          <span className="block">LEARN</span>
        </div>
      </div>

      <div className="flex justify-end items-end mt-auto">
        <div className="font-mono flex flex-col items-center gap-y-3 text-4xl text-muted-foreground md:text-7xl text-right">
          <span className="block">HOW IT WORKS</span>
         <Image src='/howitworks-downarrow.png' width={100} height={10} alt='scroll' className="object-contain"/>
        </div>
      </div>
    </div>
  );
};
