"use client";

import { useEffect, useState } from "react";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";

const keywords = [
  "AI 视觉",
  "品牌设计",
  "数字内容创作",
  "动态影像",
  "AI 内容策划",
];

type Phase = "typing" | "holding" | "deleting";

export function TypewriterIntro() {
  const reduceMotion = useHydratedReducedMotion();
  const [keywordIndex, setKeywordIndex] = useState(0);
  const [displayedKeyword, setDisplayedKeyword] = useState(keywords[0]);
  const [phase, setPhase] = useState<Phase>("holding");

  useEffect(() => {
    if (reduceMotion) {
      setKeywordIndex(0);
      setDisplayedKeyword(keywords[0]);
      setPhase("holding");
      return;
    }

    const keywordCharacters = Array.from(keywords[keywordIndex]);
    const displayedCharacters = Array.from(displayedKeyword);
    let timeout: ReturnType<typeof setTimeout>;

    if (phase === "typing") {
      if (displayedCharacters.length < keywordCharacters.length) {
        timeout = setTimeout(() => {
          setDisplayedKeyword(keywordCharacters.slice(0, displayedCharacters.length + 1).join(""));
        }, 110);
      } else {
        timeout = setTimeout(() => setPhase("holding"), 110);
      }
    } else if (phase === "holding") {
      timeout = setTimeout(() => setPhase("deleting"), 1600);
    } else if (displayedCharacters.length > 0) {
      timeout = setTimeout(() => {
        setDisplayedKeyword(displayedCharacters.slice(0, -1).join(""));
      }, 65);
    } else {
      timeout = setTimeout(() => {
        setKeywordIndex((current) => (current + 1) % keywords.length);
        setPhase("typing");
      }, 65);
    }

    return () => clearTimeout(timeout);
  }, [displayedKeyword, keywordIndex, phase, reduceMotion]);

  return (
    <div
      className="typewriter-intro"
      role="group"
      aria-label="专注于 AI 视觉、品牌设计、数字内容创作、动态影像与 AI 内容策划。持续探索技术、审美与叙事之间的可能性。"
    >
      <p className="typewriter-line" aria-hidden="true">
        <span>专注于</span>
        <span className="typewriter-keyword">
          <span className="typewriter-animated-keyword">
            {displayedKeyword}
            <span className="typewriter-cursor" />
          </span>
          <span className="typewriter-static-keyword">AI 视觉</span>
        </span>
      </p>
      <p className="typewriter-fixed-line" aria-hidden="true">
        持续探索技术、审美与叙事之间的可能性。
      </p>
    </div>
  );
}
