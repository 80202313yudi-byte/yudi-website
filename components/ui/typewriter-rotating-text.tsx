"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";

import { useReducedMotion } from "@/lib/motion";

export type TypewriterRotatingTextProps = {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  holdDuration?: number;
  startDelay?: number;
  className?: string;
  cursorClassName?: string;
};

type TypewriterPhase = "typing" | "deleting";

function splitText(text: string): string[] {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("zh-CN", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }

  return Array.from(text);
}

function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function TypewriterRotatingText({
  texts,
  typingSpeed = 110,
  deletingSpeed = 65,
  holdDuration = 1600,
  startDelay = 200,
  className,
  cursorClassName,
}: TypewriterRotatingTextProps): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const safeTexts = useMemo(() => (texts.length > 0 ? texts : [""]), [texts]);
  const [textIndex, setTextIndex] = useState(0);
  const [displayedLength, setDisplayedLength] = useState(0);
  const [phase, setPhase] = useState<TypewriterPhase>("typing");
  const [hasStarted, setHasStarted] = useState(startDelay <= 0);

  const currentText = safeTexts[textIndex] ?? safeTexts[0] ?? "";
  const currentParts = useMemo(() => splitText(currentText), [currentText]);
  const visibleText = currentParts.slice(0, displayedLength).join("");

  useEffect(() => {
    if (prefersReducedMotion || hasStarted) return;

    const startTimer = window.setTimeout(() => {
      setHasStarted(true);
    }, startDelay);

    return () => window.clearTimeout(startTimer);
  }, [hasStarted, prefersReducedMotion, safeTexts, startDelay]);

  useEffect(() => {
    if (prefersReducedMotion || !hasStarted) return;

    const fullLength = currentParts.length;
    let timeoutId = 0;

    if (phase === "typing") {
      if (displayedLength < fullLength) {
        timeoutId = window.setTimeout(() => {
          setDisplayedLength((length) => Math.min(length + 1, fullLength));
        }, typingSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase("deleting");
        }, holdDuration);
      }
    }

    if (phase === "deleting") {
      if (displayedLength > 0) {
        timeoutId = window.setTimeout(() => {
          setDisplayedLength((length) => Math.max(length - 1, 0));
        }, deletingSpeed);
      } else {
        timeoutId = window.setTimeout(() => {
          setTextIndex((index) => (index + 1) % safeTexts.length);
          setPhase("typing");
        }, typingSpeed);
      }
    }

    return () => window.clearTimeout(timeoutId);
  }, [
    currentParts.length,
    deletingSpeed,
    displayedLength,
    hasStarted,
    holdDuration,
    phase,
    prefersReducedMotion,
    safeTexts.length,
    typingSpeed,
  ]);

  return (
    <span
      className={cn("inline-flex min-w-[7.75em] items-baseline", className)}
      aria-label={`定位关键词：${safeTexts.join("、")}`}
    >
      <span aria-hidden="true" className="whitespace-nowrap">
        {prefersReducedMotion ? safeTexts[0] : visibleText}
      </span>
      {!prefersReducedMotion ? (
        <span
          aria-hidden="true"
          className={cn(
            "typewriter-cursor ml-0.5 inline-block h-[1em] w-[2px] translate-y-[0.12em] bg-current",
            cursorClassName
          )}
        />
      ) : null}
    </span>
  );
}
