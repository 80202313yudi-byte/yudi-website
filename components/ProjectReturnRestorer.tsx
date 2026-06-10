"use client";

import { useLayoutEffect } from "react";
import {
  getProjectCardId,
  isValidProjectReturnState,
  projectReturnStateKey,
  type ProjectReturnState,
} from "@/data/projectNavigation";

function readReturnState() {
  try {
    return JSON.parse(sessionStorage.getItem(projectReturnStateKey) ?? "null") as
      | ProjectReturnState
      | null;
  } catch {
    return null;
  }
}

function clearReturnState() {
  try {
    sessionStorage.removeItem(projectReturnStateKey);
  } catch {
    // Scroll restoration must remain available when browser storage is unavailable.
  }
}

function getHashProjectSlug() {
  const prefix = "#project-";
  return window.location.hash.startsWith(prefix)
    ? decodeURIComponent(window.location.hash.slice(prefix.length))
    : null;
}

function runWithInstantScroll(action: () => void) {
  const root = document.documentElement;
  const previousScrollBehavior = root.style.scrollBehavior;
  root.style.scrollBehavior = "auto";
  action();
  root.style.scrollBehavior = previousScrollBehavior;
}

function scrollToWorksFallback() {
  runWithInstantScroll(() => {
    document.getElementById("works")?.scrollIntoView({ behavior: "auto", block: "start" });
  });
  window.history.replaceState(window.history.state, "", "/#works");
}

export function ProjectReturnRestorer() {
  useLayoutEffect(() => {
    let frame = 0;
    let verifyTimeout = 0;
    let feedbackTimeout = 0;
    let clearStateTimeout = 0;

    const restoreReturnPosition = () => {
      const returnState = readReturnState();
      const hashSlug = getHashProjectSlug();
      const validReturnState = isValidProjectReturnState(returnState);
      const targetSlug = validReturnState ? returnState.slug : hashSlug;

      if (!targetSlug) {
        if (returnState) {
          clearReturnState();
        }
        return;
      }

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const target = document.getElementById(getProjectCardId(targetSlug));
        if (!target) {
          clearReturnState();
          scrollToWorksFallback();
          return;
        }

        const restoreSavedScroll = () => {
          if (!validReturnState) {
            return;
          }

          const delta = Math.abs(window.scrollY - returnState.scrollY);
          if (delta > 48) {
            runWithInstantScroll(() => {
              window.scrollTo({ top: returnState.scrollY, left: 0, behavior: "auto" });
            });
          }
        };

        if (validReturnState) {
          restoreSavedScroll();
          verifyTimeout = window.setTimeout(restoreSavedScroll, 140);
        } else {
          runWithInstantScroll(() => {
            target.scrollIntoView({ behavior: "auto", block: "start" });
          });
        }

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (!reduceMotion) {
          target.classList.add("project-card--returned");
          feedbackTimeout = window.setTimeout(() => {
            target.classList.remove("project-card--returned");
          }, 760);
        }

        clearStateTimeout = window.setTimeout(clearReturnState, reduceMotion ? 220 : 900);
      });
    };

    restoreReturnPosition();
    window.addEventListener("pageshow", restoreReturnPosition);
    window.addEventListener("popstate", restoreReturnPosition);

    return () => {
      window.removeEventListener("pageshow", restoreReturnPosition);
      window.removeEventListener("popstate", restoreReturnPosition);
      window.cancelAnimationFrame(frame);
      window.clearTimeout(verifyTimeout);
      window.clearTimeout(feedbackTimeout);
      window.clearTimeout(clearStateTimeout);
    };
  }, []);

  return null;
}
