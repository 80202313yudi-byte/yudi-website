"use client";

import Link from "next/link";
import {
  useEffect,
  useRef,
  type AnchorHTMLAttributes,
  type CSSProperties,
  type ReactNode,
} from "react";
import { useHydratedReducedMotion } from "@/components/useHydratedReducedMotion";

type MagneticLinkProps = {
  href: string;
  children: ReactNode;
  className?: string;
  visualClassName?: string;
} & Pick<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  "aria-current" | "aria-label" | "onClick" | "rel" | "tabIndex" | "target"
>;

type MagneticStyle = CSSProperties & {
  "--magnetic-x": string;
  "--magnetic-y": string;
  "--magnetic-content-x": string;
  "--magnetic-content-y": string;
};

const restingStyle: MagneticStyle = {
  "--magnetic-x": "0px",
  "--magnetic-y": "0px",
  "--magnetic-content-x": "0px",
  "--magnetic-content-y": "0px",
};

export function MagneticLink({
  href,
  children,
  className = "",
  visualClassName = "btn-primary",
  ...anchorProps
}: MagneticLinkProps) {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const frameRef = useRef<number | null>(null);
  const reduceMotion = useHydratedReducedMotion();

  useEffect(() => {
    const element = linkRef.current;
    if (!element) {
      return;
    }

    const finePointer = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)",
    );

    const setOffset = (x: number, y: number) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        element.style.setProperty("--magnetic-x", `${x}px`);
        element.style.setProperty("--magnetic-y", `${y}px`);
        element.style.setProperty("--magnetic-content-x", `${x * 0.4}px`);
        element.style.setProperty("--magnetic-content-y", `${y * 0.4}px`);
        element.dataset.magneticActive = x || y ? "true" : "false";
      });
    };

    const reset = () => setOffset(0, 0);

    const handlePointerMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") {
        reset();
        return;
      }

      const rect = element.getBoundingClientRect();
      const proximity = 44;
      const closestX = Math.max(rect.left, Math.min(event.clientX, rect.right));
      const closestY = Math.max(rect.top, Math.min(event.clientY, rect.bottom));
      const distance = Math.hypot(event.clientX - closestX, event.clientY - closestY);

      if (distance > proximity) {
        reset();
        return;
      }

      const strength = distance === 0 ? 1 : 1 - distance / proximity;
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const rawXDirection = Math.max(
        -1,
        Math.min(1, (event.clientX - centerX) / (rect.width / 2 + proximity)),
      );
      const rawYDirection = Math.max(
        -1,
        Math.min(1, (event.clientY - centerY) / (rect.height / 2 + proximity)),
      );
      const directionLength = Math.hypot(rawXDirection, rawYDirection);
      const directionScale = directionLength > 1 ? 1 / directionLength : 1;

      setOffset(
        rawXDirection * directionScale * 5 * strength,
        rawYDirection * directionScale * 5 * strength,
      );
    };

    const syncPointerMode = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      reset();

      if (finePointer.matches && !reduceMotion) {
        window.addEventListener("pointermove", handlePointerMove, { passive: true });
      }
    };

    syncPointerMode();
    finePointer.addEventListener("change", syncPointerMode);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      finePointer.removeEventListener("change", syncPointerMode);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [reduceMotion]);

  const content = (
    <span className={`magnetic-button-visual ${visualClassName}`}>
      <span className="magnetic-button-content">{children}</span>
    </span>
  );
  const sharedProps = {
    ...anchorProps,
    ref: linkRef,
    className: `magnetic-button ${className}`.trim(),
    style: restingStyle,
  };

  if (href.startsWith("/") || href.startsWith("#")) {
    return (
      <Link href={href} {...sharedProps}>
        {content}
      </Link>
    );
  }

  return (
    <a href={href} {...sharedProps}>
      {content}
    </a>
  );
}
