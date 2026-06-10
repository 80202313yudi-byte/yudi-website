"use client";

import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { useProjectDetailTransition } from "@/components/ProjectDetailTransition";

type ProjectReturnToWorksButtonProps = {
  children?: ReactNode;
  className?: string;
};

export function ProjectReturnToWorksButton({
  children = "继续看作品",
  className = "btn-secondary",
}: ProjectReturnToWorksButtonProps) {
  const { exiting, handleReturnToWorks } = useProjectDetailTransition();

  return (
    <button
      type="button"
      className={className}
      aria-label="返回之前浏览的作品位置继续看作品"
      disabled={exiting}
      onClick={handleReturnToWorks}
    >
      {children}
      <ArrowUpRight size={18} aria-hidden="true" />
    </button>
  );
}
