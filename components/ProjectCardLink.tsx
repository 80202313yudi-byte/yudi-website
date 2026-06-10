"use client";

import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";
import { useRef } from "react";
import { projectReturnMarkerKey } from "@/data/projectNavigation";

type ProjectCardLinkProps = {
  children: ReactNode;
  className: string;
  href: string;
  label: string;
};

export function ProjectCardLink({ children, className, href, label }: ProjectCardLinkProps) {
  const navigating = useRef(false);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }

    if (navigating.current) {
      event.preventDefault();
      return;
    }

    navigating.current = true;
    try {
      sessionStorage.setItem(
        projectReturnMarkerKey,
        JSON.stringify({
          path: window.location.pathname,
          createdAt: Date.now(),
        }),
      );
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
