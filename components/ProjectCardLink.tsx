"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { projectReturnStateKey, type ProjectReturnState } from "@/data/projectNavigation";

type ProjectCardLinkProps = {
  children: ReactNode;
  className: string;
  href: string;
  label: string;
  slug: string;
};

export function ProjectCardLink({ children, className, href, label, slug }: ProjectCardLinkProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    try {
      const returnState: ProjectReturnState = {
        slug,
        scrollY: window.scrollY,
        fromWorks: true,
        timestamp: Date.now(),
        sourcePath: window.location.pathname,
        sourceHash: window.location.hash,
        detailPath: href,
      };

      sessionStorage.setItem(projectReturnStateKey, JSON.stringify(returnState));
    } catch {
      // Navigation must remain available when browser storage is unavailable.
    }
  };

  return (
    <Link href={href} className={className} aria-label={label} onClick={handleClick}>
      {children}
    </Link>
  );
}
