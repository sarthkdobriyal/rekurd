import { HTMLAttributes, useRef } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

interface FeatureType {
  heading: string;
  description: string;
  icon: string;
  color: string;
  url: string;
  src?: string;
}

interface Props extends HTMLAttributes<HTMLElement> {
  features: FeatureType[];
}

export const LandingFeatures: React.FC<Props> = ({ features }) => {

  const container = useRef(null);

  const { scrollYProgress } = useScroll({

    target: container,

    offset: ['start start', 'end end']

  })
  
  
  return (
    <div id="features" ref={container} className={cn("h-fit w-full")}>
      {features.map((project, i) => {
        const targetScale = 1 - ( (features.length - i) * 0.01);
        return <FeatureCard key={`p_${i}`} {...project} i={i} progress={scrollYProgress} range={[i * .25, 1]} targetScale={targetScale}/>;
      })}
    </div>
  );
};

interface FeatureCardType {
  heading: string;
  description: string;
  icon: string;
  i: number;
  color: string;
  url: string;
  src?: string;
  progress: MotionValue<number>,
  range:  number[];
  targetScale: number
}


const FeatureCard: React.FC<FeatureCardType> = ({ heading, description, icon, i,  color, url, src,  progress, range, targetScale }) => {

  const container = useRef(null);

  const { scrollYProgress } = useScroll({

    target: container,

    offset: ['start end', 'start start']

  })

  const imageScale = useTransform(scrollYProgress, [0, 1], [2, 1])
  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div ref={container} className="h-[90vh] w-full mx-auto lg:max-w-7xl flex items-center justify-center sticky top-0">
    <motion.div 
      className="relative h-full w-full rounded-xl  overflow-hidden"
      style={{ scale, top: `calc( ${i * 25}px)` }}
    >
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          style={{ scale: imageScale }} 
          className="w-full h-full translate-y-[35%]"
        >
          <Image 
            fill 
            src={src!} 
            alt="background" 
            className="object-cover object-center"
          />
        </motion.div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-transparent opacity-50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 h-full px-4 md:px-8 lg:px-14 flex flex-col justify-center  md:max-w-[60%]">
        <div className="w-full">
          <h2 className="text-left text-3xl font-bold text-white mb-6 leading-tight">
            {heading}
          </h2>
          <p className="text-left text-sm md:text-xl text-gray-200 mb-8 leading-relaxed">
            {description}
          </p>
          
        </div>
      </div>
    </motion.div>
  </div>
  );
};