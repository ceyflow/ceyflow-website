"use client";
import { useEffect, useRef, useState } from "react";

// 0 when the element's top edge is at the bottom of the viewport (about to
// scroll into view), 1 once its top edge reaches the top of the viewport.
// Respects prefers-reduced-motion by settling immediately at 1.
export function useScrollProgress<T extends HTMLElement>() {
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
      const p = 1 - rect.top / vh;
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
