"use client";
import { motion } from "framer-motion";

interface FormStepWrapperProps {
    children: React.ReactNode;
    direction?: number;
}

export const FormStepWrapper = ({ children, direction = 1 }: FormStepWrapperProps) => (
  <motion.div
    initial={{ x: 100 * direction, opacity: 0 }}
    animate={{ x: 0, opacity: 1 }}
    exit={{ x: -100 * direction, opacity: 0 }}
    transition={{ duration: 0.2, ease: "easeInOut" }}
    className="flex  w-full flex-col h-full  px-4 "
  >
    {children}
  </motion.div>
);