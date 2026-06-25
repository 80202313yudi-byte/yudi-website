"use client";

import { AnimatePresence, motion } from "motion/react";
import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import type { ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";

const EMAIL = "80202313yudi@gmail.com";
const EASE = [0.22, 1, 0.36, 1] as const;

function subscribeToFinePointer(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 640px)"
  );
  mediaQuery.addEventListener("change", callback);
  return () => mediaQuery.removeEventListener("change", callback);
}

function getFinePointerSnapshot(): boolean {
  return window.matchMedia(
    "(hover: hover) and (pointer: fine) and (min-width: 640px)"
  ).matches;
}

function getFinePointerServerSnapshot(): boolean {
  return false;
}

function useFinePointer(): boolean {
  return useSyncExternalStore(
    subscribeToFinePointer,
    getFinePointerSnapshot,
    getFinePointerServerSnapshot
  );
}

export function ContactButton(): ReactNode {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const copiedTimerRef = useRef<number | null>(null);
  const prefersReducedMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const expanded = finePointer && open;
  const useRevealMotion = finePointer && !prefersReducedMotion;
  const contentInitial = !useRevealMotion
    ? false
    : { opacity: 0, filter: "blur(8px)" };
  const contentAnimate = !useRevealMotion
    ? { opacity: 1 }
    : { opacity: 1, filter: "blur(0px)" };
  const contentExit = !useRevealMotion
    ? { opacity: 0 }
    : { opacity: 0, filter: "blur(8px)" };
  const contentTransition = !useRevealMotion
    ? { duration: 0 }
    : { duration: 0.35, ease: EASE };
  const iconInitial = !useRevealMotion
    ? false
    : { scale: 0.5, opacity: 0 };
  const iconExit = !useRevealMotion
    ? { opacity: 0 }
    : { scale: 0.5, opacity: 0 };
  const iconTransition = !useRevealMotion
    ? { duration: 0 }
    : { duration: 0.2, ease: EASE };

  useEffect(() => {
    return () => {
      if (copiedTimerRef.current !== null) {
        window.clearTimeout(copiedTimerRef.current);
      }
    };
  }, []);

  function markCopied(): void {
    if (copiedTimerRef.current !== null) {
      window.clearTimeout(copiedTimerRef.current);
    }
    setCopied(true);
    copiedTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      copiedTimerRef.current = null;
    }, 1600);
  }

  const handleCopy = async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      markCopied();
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        markCopied();
      } catch {}
      document.body.removeChild(ta);
    }
  };

  return (
    <motion.button
      type="button"
      layout={useRevealMotion}
      onClick={handleCopy}
      onHoverStart={() => {
        if (finePointer) {
          setOpen(true);
        }
      }}
      onHoverEnd={() => {
        if (finePointer) {
          setOpen(false);
        }
      }}
      onFocus={() => {
        if (finePointer) {
          setOpen(true);
        }
      }}
      onBlur={() => {
        if (finePointer) {
          setOpen(false);
        }
      }}
      aria-label={
        copied ? "邮箱已复制" : expanded ? `复制 ${EMAIL}` : "复制邮箱"
      }
      transition={{
        layout: { duration: useRevealMotion ? 0.55 : 0, ease: EASE },
      }}
      style={{ borderRadius: 12 }}
      className="focus-ring relative inline-flex h-11 min-w-[8.5rem] touch-manipulation cursor-pointer items-center justify-center bg-foreground px-5 text-sm font-medium text-background sm:min-w-0"
    >
      <motion.span
        layout={useRevealMotion ? "position" : false}
        className="relative inline-flex items-center"
      >
        <AnimatePresence initial={false} mode="popLayout">
          {expanded ? (
            <motion.span
              key="email"
              layout={useRevealMotion ? "position" : false}
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
              key={copied ? "copied" : "contact"}
              layout={useRevealMotion ? "position" : false}
              initial={contentInitial}
              animate={contentAnimate}
              exit={contentExit}
              transition={contentTransition}
              className="inline-flex items-center gap-2 whitespace-nowrap"
            >
              {copied ? (
                <Check className="h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
              )}
              <span>{copied ? "邮箱已复制" : "联系我"}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.span>
    </motion.button>
  );
}
