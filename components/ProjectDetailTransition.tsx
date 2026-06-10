"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";
import { projectReturnMarkerKey } from "@/data/projectNavigation";

type ProjectDetailTransitionProps = {
  children: ReactNode;
  className?: string;
};

type ProjectTransitionContextValue = {
  exiting: boolean;
  returnToWorks: () => void;
};

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);

function hasRecentReturnMarker() {
  try {
    const marker = JSON.parse(sessionStorage.getItem(projectReturnMarkerKey) ?? "null") as {
      createdAt?: number;
      path?: string;
    } | null;

    return Boolean(
      marker?.path === "/" &&
        marker.createdAt &&
        Date.now() - marker.createdAt < 2 * 60 * 60 * 1000,
    );
  } catch {
    return false;
  }
}

export function ProjectDetailTransition({ children, className }: ProjectDetailTransitionProps) {
  const router = useRouter();
  const reduceMotion = useHydratedReducedMotion();
  const [exiting, setExiting] = useState(false);

  const returnToWorks = useCallback(() => {
    if (exiting) {
      return;
    }

    setExiting(true);

    const sameOriginReferrer = (() => {
      try {
        return Boolean(document.referrer && new URL(document.referrer).origin === window.location.origin);
      } catch {
        return false;
      }
    })();
    const canGoBack =
      window.history.length > 1 && (hasRecentReturnMarker() || sameOriginReferrer);

    try {
      sessionStorage.removeItem(projectReturnMarkerKey);
    } catch {
      // Returning must remain available when browser storage is unavailable.
    }

    if (canGoBack) {
      router.back();
      return;
    }

    router.push("/#works");
  }, [exiting, router]);

  const contextValue = useMemo(() => ({ exiting, returnToWorks }), [exiting, returnToWorks]);

  return (
    <ProjectTransitionContext.Provider value={contextValue}>
      <motion.main
        className={className}
        initial={reduceMotion ? false : { opacity: 0, y: 16 }}
        animate={
          reduceMotion
            ? { opacity: 1, y: 0 }
            : exiting
              ? { opacity: 0.85, y: 6 }
              : { opacity: 1, y: 0 }
        }
        transition={{
          duration: exiting ? 0.18 : reduceMotion ? 0.08 : 0.38,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.main>
    </ProjectTransitionContext.Provider>
  );
}

export function useProjectDetailTransition() {
  const context = useContext(ProjectTransitionContext);

  if (!context) {
    throw new Error("useProjectDetailTransition must be used within ProjectDetailTransition");
  }

  return context;
}
