"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";

const EMAIL = "80202313yudi@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;

export function ContactButton(): ReactNode {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const contentInitial = prefersReducedMotion
    ? false
    : { opacity: 0, filter: "blur(8px)" };
  const contentAnimate = prefersReducedMotion
    ? { opacity: 1 }
    : { opacity: 1, filter: "blur(0px)" };
  const contentExit = prefersReducedMotion
    ? { opacity: 0 }
    : { opacity: 0, filter: "blur(8px)" };
  const contentTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: EASE };
  const iconInitial = prefersReducedMotion
    ? false
    : { scale: 0.5, opacity: 0 };
  const iconExit = prefersReducedMotion
    ? { opacity: 0 }
    : { scale: 0.5, opacity: 0 };
  const iconTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: EASE };

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <motion.button
      type="button"
      layout={!prefersReducedMotion}
      onClick={handleCopy}
      onHoverStart={() => setOpen(true)}
      onHoverEnd={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
      aria-label={
        copied ? "邮件已复制" : open ? `复制 ${EMAIL}` : "显示邮箱"
      }
      transition={{
        layout: { duration: prefersReducedMotion ? 0 : 0.55, ease: EASE },
      }}
      style={{ borderRadius: 12 }}
      className="focus-ring relative inline-flex h-11 cursor-pointer items-center justify-center bg-foreground px-5 text-sm font-medium text-background"
    >
      <motion.span
        layout={prefersReducedMotion ? false : "position"}
        className="relative inline-flex items-center"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <motion.span
              key="email"
              layout={prefersReducedMotion ? false : "position"}
              initial={contentInitial}
              animate={contentAnimate}
              exit={contentExit}
              transition={contentTransition}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <span className="relative inline-flex h-4 w-4 shrink-0 items-center justify-center">
                <AnimatePresence initial={false} mode="wait">
                  {copied ? (
                    <motion.span
                      key="check"
                      initial={iconInitial}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={iconExit}
                      transition={iconTransition}
                      className="inline-flex"
                    >
                      <Check className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="copy"
                      initial={iconInitial}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={iconExit}
                      transition={iconTransition}
                      className="inline-flex"
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
              <span className="tabular-nums">{EMAIL}</span>
            </motion.span>
          ) : (
            <motion.span
              key="contact"
              layout={prefersReducedMotion ? false : "position"}
              initial={contentInitial}
              animate={contentAnimate}
              exit={contentExit}
              transition={contentTransition}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>联系我</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}
