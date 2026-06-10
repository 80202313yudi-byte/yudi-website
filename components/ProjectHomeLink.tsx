"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { projectReturnStateKey } from "@/data/projectNavigation";

type ProjectHomeLinkProps = ComponentProps<typeof Link>;

export function ProjectHomeLink({ onClick, ...props }: ProjectHomeLinkProps) {
  const handleClick: ProjectHomeLinkProps["onClick"] = (event) => {
    try {
      sessionStorage.removeItem(projectReturnStateKey);
    } catch {
      // Explicit navigation must remain available when browser storage is unavailable.
    }
    onClick?.(event);
  };

  return <Link {...props} onClick={handleClick} />;
}
