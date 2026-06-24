"use client";

import {
  AnimatePresence,
  motion,
  type HTMLMotionProps,
  type TargetAndTransition,
  type Transition,
} from "motion/react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from "react";

import { useReducedMotion } from "@/lib/motion";

type SplitBy = "characters" | "words" | "lines" | string;
type StaggerFrom = "first" | "last" | "center" | "random" | number;

export type RotatingTextHandle = {
  next: () => void;
  previous: () => void;
  jumpTo: (index: number) => void;
  reset: () => void;
};

type RotatingTextProps = Omit<HTMLMotionProps<"span">, "children" | "transition"> & {
  texts: string[];
  rotationInterval?: number;
  initial?: TargetAndTransition;
  animate?: TargetAndTransition;
  exit?: TargetAndTransition;
  animatePresenceMode?: "sync" | "popLayout" | "wait";
  animatePresenceInitial?: boolean;
  staggerDuration?: number;
  staggerFrom?: StaggerFrom;
  transition?: Transition;
  loop?: boolean;
  auto?: boolean;
  splitBy?: SplitBy;
  onNext?: (index: number) => void;
  mainClassName?: string;
  splitLevelClassName?: string;
  elementLevelClassName?: string;
  srText?: string;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function splitIntoGraphemes(text: string) {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("zh-CN", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (segment) => segment.segment);
  }

  return Array.from(text);
}

const RotatingText = forwardRef<RotatingTextHandle, RotatingTextProps>(
  function RotatingText(
    {
      texts,
      transition = { type: "spring", damping: 28, stiffness: 340 },
      initial = { y: "100%", opacity: 0 },
      animate = { y: 0, opacity: 1 },
      exit = { y: "-110%", opacity: 0 },
      animatePresenceMode = "wait",
      animatePresenceInitial = false,
      rotationInterval = 2700,
      staggerDuration = 0,
      staggerFrom = "first",
      loop = true,
      auto = true,
      splitBy = "lines",
      onNext,
      mainClassName,
      splitLevelClassName,
      elementLevelClassName,
      srText,
      ...rest
    },
    ref
  ) {
    const prefersReducedMotion = useReducedMotion();
    const safeTexts = texts.length > 0 ? texts : [""];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const currentText = safeTexts[currentTextIndex] ?? safeTexts[0] ?? "";
    const staticSrText = srText ?? currentText;

    const elements = useMemo(() => {
      if (splitBy === "characters") {
        const words = currentText.split(" ");
        return words.map((word, index) => ({
          characters: splitIntoGraphemes(word),
          needsSpace: index !== words.length - 1,
        }));
      }

      if (splitBy === "words") {
        const words = currentText.split(" ");
        return words.map((word, index) => ({
          characters: [word],
          needsSpace: index !== words.length - 1,
        }));
      }

      if (splitBy === "lines") {
        const lines = currentText.split("\n");
        return lines.map((line, index) => ({
          characters: [line],
          needsSpace: index !== lines.length - 1,
        }));
      }

      const parts = currentText.split(splitBy);
      return parts.map((part, index) => ({
        characters: [part],
        needsSpace: index !== parts.length - 1,
      }));
    }, [currentText, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number, totalChars: number) => {
        if (staggerDuration === 0) return 0;
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (totalChars - 1 - index) * staggerDuration;
        if (staggerFrom === "center") {
          const center = Math.floor(totalChars / 2);
          return Math.abs(center - index) * staggerDuration;
        }
        if (staggerFrom === "random") {
          const randomIndex = Math.floor(Math.random() * totalChars);
          return Math.abs(randomIndex - index) * staggerDuration;
        }

        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [staggerDuration, staggerFrom]
    );

    const handleIndexChange = useCallback(
      (newIndex: number) => {
        setCurrentTextIndex(newIndex);
        onNext?.(newIndex);
      },
      [onNext]
    );

    const next = useCallback(() => {
      const nextIndex =
        currentTextIndex === safeTexts.length - 1
          ? loop
            ? 0
            : currentTextIndex
          : currentTextIndex + 1;

      if (nextIndex !== currentTextIndex) {
        handleIndexChange(nextIndex);
      }
    }, [currentTextIndex, handleIndexChange, loop, safeTexts.length]);

    const previous = useCallback(() => {
      const previousIndex =
        currentTextIndex === 0
          ? loop
            ? safeTexts.length - 1
            : currentTextIndex
          : currentTextIndex - 1;

      if (previousIndex !== currentTextIndex) {
        handleIndexChange(previousIndex);
      }
    }, [currentTextIndex, handleIndexChange, loop, safeTexts.length]);

    const jumpTo = useCallback(
      (index: number) => {
        const validIndex = Math.max(0, Math.min(index, safeTexts.length - 1));
        if (validIndex !== currentTextIndex) {
          handleIndexChange(validIndex);
        }
      },
      [currentTextIndex, handleIndexChange, safeTexts.length]
    );

    const reset = useCallback(() => {
      if (currentTextIndex !== 0) {
        handleIndexChange(0);
      }
    }, [currentTextIndex, handleIndexChange]);

    useImperativeHandle(ref, () => ({ next, previous, jumpTo, reset }), [
      jumpTo,
      next,
      previous,
      reset,
    ]);

    useEffect(() => {
      if (!auto || prefersReducedMotion || safeTexts.length <= 1) return;

      const intervalId = window.setInterval(next, rotationInterval);
      return () => window.clearInterval(intervalId);
    }, [auto, next, prefersReducedMotion, rotationInterval, safeTexts.length]);

    if (prefersReducedMotion) {
      return (
        <motion.span className={cn("rotating-text", mainClassName)} {...rest}>
          <span className="rotating-text-sr-only">{staticSrText}</span>
          <span aria-hidden="true">{safeTexts[0]}</span>
        </motion.span>
      );
    }

    return (
      <motion.span
        className={cn("rotating-text", mainClassName)}
        layout
        transition={transition}
        {...rest}
      >
        <span className="rotating-text-sr-only">{staticSrText}</span>
        <AnimatePresence mode={animatePresenceMode} initial={animatePresenceInitial}>
          <motion.span
            key={currentTextIndex}
            className={cn(splitBy === "lines" ? "rotating-text-lines" : "rotating-text")}
            layout
            aria-hidden="true"
          >
            {elements.map((wordObj, wordIndex, array) => {
              const previousCharsCount = array
                .slice(0, wordIndex)
                .reduce((sum, word) => sum + word.characters.length, 0);
              const totalChars = array.reduce((sum, word) => sum + word.characters.length, 0);

              return (
                <span
                  key={`${wordIndex}-${wordObj.characters.join("")}`}
                  className={cn("rotating-text-word", splitLevelClassName)}
                >
                  {wordObj.characters.map((char, charIndex) => (
                    <motion.span
                      key={`${char}-${charIndex}`}
                      initial={initial}
                      animate={animate}
                      exit={exit}
                      transition={{
                        ...transition,
                        delay: getStaggerDelay(previousCharsCount + charIndex, totalChars),
                      }}
                      className={cn("rotating-text-element", elementLevelClassName)}
                    >
                      {char}
                    </motion.span>
                  ))}
                  {wordObj.needsSpace ? <span className="rotating-text-space"> </span> : null}
                </span>
              );
            })}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    );
  }
);

RotatingText.displayName = "RotatingText";

export default RotatingText;
