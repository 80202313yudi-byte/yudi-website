"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from "react";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";
import {
  getProjectCardId,
  isValidProjectReturnState,
  projectReturnStateKey,
  type ProjectReturnState,
} from "@/data/projectNavigation";

type ProjectDetailTransitionProps = {
  children: ReactNode;
  className?: string;
  projectSlug: string;
};

type ProjectTransitionContextValue = {
  exiting: boolean;
  handleReturnToWorks: () => void;
};

const ProjectTransitionContext = createContext<ProjectTransitionContextValue | null>(null);

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
    // The slug anchor fallback remains available when browser storage is unavailable.
  }
}

export function ProjectDetailTransition({
  children,
  className,
  projectSlug,
}: ProjectDetailTransitionProps) {
  const router = useRouter();
  const reduceMotion = useHydratedReducedMotion();
  const [exiting, setExiting] = useState(false);

  const handleReturnToWorks = useCallback(() => {
    if (exiting) {
      return;
    }

    setExiting(true);
    const returnState = readReturnState();

    if (isValidProjectReturnState(returnState, projectSlug)) {
      try {
        sessionStorage.setItem(
          projectReturnStateKey,
          JSON.stringify({ ...returnState, returnRequested: true }),
        );
      } catch {
        // Native history return remains available when browser storage is unavailable.
      }
      router.back();
      return;
    }

    clearReturnState();
    router.push(`/#${getProjectCardId(projectSlug)}`);
  }, [exiting, projectSlug, router]);

  const contextValue = useMemo(
    () => ({ exiting, handleReturnToWorks }),
    [exiting, handleReturnToWorks],
  );

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
