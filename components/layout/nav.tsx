"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { useReducedMotion } from "@/lib/motion";
type NavItem = {
  label: string;
  href: string;
};

const NAV_ITEMS: readonly NavItem[] = [
  { label: "首⁠页", href: "/" },
  { label: "作⁠品", href: "/projects" },
  { label: "关⁠于", href: "/about" },
];

const THEME_REVEAL_DURATION = 700;
const THEME_REVEAL_MAX_SCALE_RATIO = 1.02;

function usesTransformThemeDriver(): boolean {
  const match = navigator.userAgent.match(/(?:Chrome|Edg)\/(\d+)/);
  return match ? Number(match[1]) >= 151 : false;
}

function themeRevealProgress(offset: number): number {
  let low = 0;
  let high = 1;

  for (let i = 0; i < 20; i += 1) {
    const t = (low + high) / 2;
    const inverse = 1 - t;
    const x =
      3 * inverse * inverse * t * 0.22 +
      3 * inverse * t * t * 0.36 +
      t * t * t;

    if (x < offset) low = t;
    else high = t;
  }

  const t = (low + high) / 2;
  return 1 - Math.pow(1 - t, 3);
}

function createTransformRevealKeyframes(radius: number): {
  reveal: Keyframe[];
  counterScale: Keyframe[];
} {
  const minimumScale = Math.max(0.006, Math.min(0.02, 16 / radius));
  const reveal: Keyframe[] = [];
  const counterScale: Keyframe[] = [];
  const scales = [minimumScale];
  let scale = minimumScale;

  while (scale < 1) {
    scale = Math.min(1, scale * THEME_REVEAL_MAX_SCALE_RATIO);
    scales.push(scale);
  }

  const offsetForScale = (scale: number): number => {
    if (scale === minimumScale) return 0;
    if (scale === 1) return 1;

    const targetProgress =
      (scale - minimumScale) / (1 - minimumScale);
    let low = 0;
    let high = 1;

    for (let i = 0; i < 20; i += 1) {
      const offset = (low + high) / 2;
      if (themeRevealProgress(offset) < targetProgress) low = offset;
      else high = offset;
    }

    return (low + high) / 2;
  };

  for (const scale of scales) {
    const offset = offsetForScale(scale);
    reveal.push({ offset, transform: `scale(${scale})` });
    counterScale.push({ offset, transform: `scale(${1 / scale})` });
  }

  return { reveal, counterScale };
}

function useIsMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function NavThemeToggle(): ReactNode {
  const mounted = useIsMounted();
  const { setTheme, resolvedTheme } = useTheme();
  const isDark = mounted && resolvedTheme === "dark";

  const toggleTheme = (event: React.MouseEvent<HTMLButtonElement>): void => {
    const next = isDark ? "light" : "dark";

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const supportsViewTransitions =
      typeof document !== "undefined" &&
      typeof document.startViewTransition === "function";

    if (!supportsViewTransitions || prefersReducedMotion) {
      setTheme(next);
      return;
    }

    const rect = event.currentTarget.getBoundingClientRect();
    const pixelRatio = window.devicePixelRatio || 1;
    const alignToDevicePixel = (value: number): number =>
      Math.round(value * pixelRatio) / pixelRatio;
    const cx = alignToDevicePixel(rect.left + rect.width / 2);
    const cy = alignToDevicePixel(rect.top + rect.height / 2);
    const radius =
      Math.ceil(
        Math.hypot(
          Math.max(cx, window.innerWidth - cx),
          Math.max(cy, window.innerHeight - cy)
        ) * pixelRatio
      ) / pixelRatio;

    const root = document.documentElement;
    root.style.setProperty("--theme-cx", `${cx}px`);
    root.style.setProperty("--theme-cy", `${cy}px`);
    root.style.setProperty("--theme-r", `${radius}px`);
    root.dataset.themeAnim = "1";

    const useTransformDriver =
      usesTransformThemeDriver() && typeof root.animate === "function";
    if (useTransformDriver) {
      root.dataset.themeDriver = "transform";
      root.style.setProperty("view-transition-name", "theme-old");
    }

    const cleanup = (): void => {
      delete root.dataset.themeAnim;
      delete root.dataset.themeDriver;
      root.style.removeProperty("view-transition-name");
    };

    const transition = document.startViewTransition(() => {
      if (useTransformDriver) {
        root.style.setProperty("view-transition-name", "theme-new");
      }
      setTheme(next);
    });

    if (!useTransformDriver) {
      transition.finished.finally(cleanup);
      return;
    }

    transition.ready
      .then(async () => {
        const { reveal, counterScale } =
          createTransformRevealKeyframes(radius);
        const timing: KeyframeAnimationOptions = {
          duration: THEME_REVEAL_DURATION,
          easing: "linear",
          fill: "both",
        };

        const revealAnimation = root.animate(reveal, {
          ...timing,
          pseudoElement: "::view-transition-group(theme-new)",
        });
        const counterScaleAnimation = root.animate(counterScale, {
          ...timing,
          pseudoElement: "::view-transition-image-pair(theme-new)",
        });

        const sharedStartTime = document.timeline.currentTime;
        if (sharedStartTime !== null) {
          revealAnimation.startTime = sharedStartTime;
          counterScaleAnimation.startTime = sharedStartTime;
        }

        await Promise.all([
          revealAnimation.finished,
          counterScaleAnimation.finished,
        ]);
      })
      .catch(() => undefined);

    transition.finished.finally(cleanup);
  };

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        mounted
          ? isDark
            ? "切换到浅色模式"
            : "切换到深色模式"
          : "切换主题"
      }
      aria-pressed={mounted ? isDark : undefined}
      className="focus-ring relative inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-background ring-1 ring-foreground/8 transition-colors"
    >
      <span aria-hidden="true" className="relative h-4 w-4">
        <Sun
          className={`absolute inset-0 h-4 w-4 text-foreground transition-all duration-300 ${
            mounted && isDark
              ? "rotate-0 scale-100 opacity-100"
              : "-rotate-90 scale-0 opacity-0"
          }`}
        />
        <Moon
          className={`absolute inset-0 h-4 w-4 text-foreground transition-all duration-300 ${
            mounted && !isDark
              ? "rotate-0 scale-100 opacity-100"
              : "rotate-90 scale-0 opacity-0"
          }`}
        />
      </span>
    </button>
  );
}

export function Nav(): ReactNode {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion();
  const listRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);
  const [pillRect, setPillRect] = useState<{
    x: number;
    width: number;
  } | null>(null);
  const [hasMeasured, setHasMeasured] = useState(false);

  const activeIndex = NAV_ITEMS.findIndex((item) =>
    item.href === "/"
      ? pathname === "/"
      : pathname === item.href || pathname.startsWith(`${item.href}/`)
  );

  useLayoutEffect(() => {
    const id = requestAnimationFrame(() => {
      const list = listRef.current;
      const activeEl =
        activeIndex >= 0 ? itemRefs.current[activeIndex] : null;
      if (!list || !activeEl) {
        setPillRect(null);
        return;
      }
      const listRect = list.getBoundingClientRect();
      const itemRect = activeEl.getBoundingClientRect();
      setPillRect({
        x: itemRect.left - listRect.left,
        width: itemRect.width,
      });
    });

    return () => cancelAnimationFrame(id);
  }, [activeIndex, pathname]);

  useEffect(() => {
    if (!pillRect) return;
    const id = requestAnimationFrame(() => setHasMeasured(true));
    return () => cancelAnimationFrame(id);
  }, [pillRect]);

  return (
    <nav
      aria-label="主导航"
      className="fixed left-1/2 top-6 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full bg-background p-1.5 shadow-sm border border-foreground/8">
        <ul ref={listRef} className="relative flex items-center gap-1">
          {pillRect && (
            <motion.span
              aria-hidden="true"
              initial={false}
              animate={{ x: pillRect.x, width: pillRect.width }}
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : hasMeasured
                    ? { type: "spring", stiffness: 380, damping: 32 }
                    : { duration: 0 }
              }
              style={{ left: 0, top: 0, bottom: 0 }}
              className="absolute rounded-full bg-brand-soft ring-1 ring-brand-line"
            />
          )}
          {NAV_ITEMS.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <li
                key={item.href}
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                className="relative"
              >
                <Link
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className="focus-ring relative inline-flex cursor-pointer items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors duration-300"
                >
                  <span
                    className={
                      isActive
                        ? "relative z-10 text-brand-strong"
                        : "relative z-10 text-foreground/60 hover:text-brand-strong"
                    }
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <NavThemeToggle />
      </div>
    </nav>
  );
}
