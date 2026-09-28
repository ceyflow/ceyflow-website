"use client";
import { useEffect, useRef, useState } from "react";

/**
 * Progress (0..1) through a tall wrapper element as it scrolls past a
 * viewport-height sticky child — for pin-and-scrub scrollytelling sections.
 */
export function useScrollScrub<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setProgress(1);
      return;
    }
    let raf = 0;
    function measure() {
      const rect = el!.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height - vh;
      const p = total > 0 ? -rect.top / total : 0;
      setProgress(Math.min(1, Math.max(0, p)));
    }
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    }
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { ref, progress };
}
