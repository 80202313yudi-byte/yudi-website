"use client";

import { ArrowRight } from "lucide-react";
import { LayoutGroup, motion } from "motion/react";
import Link from "next/link";
import type { ReactNode } from "react";

import { ContactButton } from "./contact-button";
import { useReducedMotion } from "@/lib/motion";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactCardCtas(): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const projectLink = (
    <Link
      href="/projects"
      className="focus-ring group inline-flex cursor-pointer items-center gap-2 rounded-xl border border-foreground/5 bg-background px-5 py-2.5 text-sm font-medium text-foreground shadow-md/2 transition-colors hover:border-brand-line hover:bg-brand-soft hover:text-brand-strong"
    >
      查看项目
      <ArrowRight
        className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </Link>
  );

  if (prefersReducedMotion) {
    return (
      <div className="mt-2 flex flex-wrap items-center gap-3">
        <ContactButton />
        <div>{projectLink}</div>
      </div>
    );
  }

  return (
    <LayoutGroup>
      <motion.div
        layout
        transition={{ layout: { duration: 0.55, ease: EASE } }}
        className="mt-2 flex flex-wrap items-center gap-3"
      >
        <ContactButton />

        <motion.div
          layout
          transition={{ layout: { duration: 0.55, ease: EASE } }}
        >
          {projectLink}
        </motion.div>
      </motion.div>
    </LayoutGroup>
  );
}
