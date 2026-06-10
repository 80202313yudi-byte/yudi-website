"use client";

import { useEffect } from "react";

export function ResizePerformanceGuard() {
  useEffect(() => {
    let timer: number | undefined;

    const finishResize = () => {
      document.documentElement.classList.remove("is-resizing");
    };

    const handleResize = () => {
      document.documentElement.classList.add("is-resizing");

      window.clearTimeout(timer);
      timer = window.setTimeout(finishResize, 220);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(timer);
      document.documentElement.classList.remove("is-resizing");
    };
  }, []);

  return null;
}
