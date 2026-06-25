"use client";

import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import { features } from "@/lib/config";
import { useReducedMotion } from "@/lib/motion";

const LENIS_OPTIONS = {
  duration: 1.6,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  orientation: "vertical" as const,
  gestureOrientation: "vertical" as const,
  smoothWheel: true,
  wheelMultiplier: 1,
  touchMultiplier: 2,
};

function isProjectDetailPath(pathname: string): boolean {
  return /^\/projects\/[^/]+$/.test(pathname);
}

function getProjectReturnTarget(): string | null {
  const target = new URLSearchParams(window.location.search).get("returnTo");
  if (!target) return null;

  return /^(featured|all)-project-[a-z0-9-]+$/.test(target) ? target : null;
}

function shouldScrollProjectsToTop(pathname: string): boolean {
  if (pathname !== "/projects") return false;

  const params = new URLSearchParams(window.location.search);
  return params.get("scroll") === "top";
}

function clearNavigationScrollParams(): void {
  const url = new URL(window.location.href);
  url.searchParams.delete("returnTo");
  url.searchParams.delete("scroll");
  const nextPath = `${url.pathname}${url.search}${url.hash}`;
  window.history.replaceState(window.history.state, "", nextPath);
}

export function SmoothScroll({
  children,
}: {
  children: ReactNode;
}): ReactNode {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);
  const handledReturnTargetRef = useRef<string | null>(null);

  useEffect(() => {
    if (!features.smoothScroll || prefersReducedMotion) return;

    const lenis = new Lenis(LENIS_OPTIONS);
    lenisRef.current = lenis;
    let rafId = 0;

    function raf(time: number): void {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    function handleAnchorClick(e: MouseEvent): void {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]');
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || href === "#") return;

      const element = document.querySelector(href);
      if (!element) return;

      e.preventDefault();
      lenis.scrollTo(element as HTMLElement, { offset: -100 });
    }

    document.addEventListener("click", handleAnchorClick);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  useLayoutEffect(() => {
    const returnTarget = getProjectReturnTarget();
    const returnKey = returnTarget ? `${pathname}:${returnTarget}` : null;

    function scrollTo(top: number): void {
      const lenis = lenisRef.current;

      if (lenis && features.smoothScroll && !prefersReducedMotion) {
        lenis.scrollTo(top, { immediate: true });
        return;
      }

      window.scrollTo({
        top,
        behavior: "auto",
      });
    }

    if (returnTarget) {
      if (handledReturnTargetRef.current === returnKey) return;

      const element = document.getElementById(returnTarget);
      if (!element) return;

      handledReturnTargetRef.current = returnKey;
      scrollTo(
        Math.max(
          0,
          element.getBoundingClientRect().top + window.scrollY - 100
        )
      );
      clearNavigationScrollParams();
      return;
    }

    if (shouldScrollProjectsToTop(pathname)) {
      scrollTo(0);
      clearNavigationScrollParams();
      return;
    }

    handledReturnTargetRef.current = null;

    if (isProjectDetailPath(pathname)) {
      scrollTo(0);
    }
  }, [pathname, prefersReducedMotion]);

  return <>{children}</>;
}
