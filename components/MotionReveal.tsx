"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";

type MotionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  id?: string;
  as?: "div" | "section" | "article";
};

export function MotionReveal({
  children,
  className,
  delay = 0,
  id,
  as = "div",
}: MotionRevealProps) {
  const reduceMotion = useHydratedReducedMotion();
  const Component =
    as === "section" ? motion.section : as === "article" ? motion.article : motion.div;

  return (
    <Component
      id={id}
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 16 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Component>
  );
}
