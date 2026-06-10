"use client";

import { useEffect, useRef } from "react";

export function ScrollProgress() {
  const progressRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const updateProgress = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollableHeight > 0 ? window.scrollY / scrollableHeight : 0;
      progressRef.current?.style.setProperty(
        "--scroll-progress",
        String(Math.min(1, Math.max(0, progress))),
      );
      frame = 0;
    };

    const requestUpdate = () => {
      if (!frame) {
        frame = window.requestAnimationFrame(updateProgress);
      }
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      if (frame) {
        window.cancelAnimationFrame(frame);
      }
    };
  }, []);

  return <span ref={progressRef} className="nav-scroll-progress" aria-hidden="true" />;
}
