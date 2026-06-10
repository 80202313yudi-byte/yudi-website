"use client";

import { useLayoutEffect } from "react";

type ScrollToTopProps = {
  pathKey: string;
};

export function ScrollToTop({ pathKey }: ScrollToTopProps) {
  useLayoutEffect(() => {
    const resetPosition = () => window.scrollTo({ top: 0, left: 0, behavior: "auto" });
    resetPosition();

    const frame = requestAnimationFrame(resetPosition);
    const shortTimeout = window.setTimeout(resetPosition, 100);
    const routeTimeout = window.setTimeout(resetPosition, 300);

    return () => {
      cancelAnimationFrame(frame);
      window.clearTimeout(shortTimeout);
      window.clearTimeout(routeTimeout);
    };
  }, [pathKey]);

  return null;
}
