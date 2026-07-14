"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useGSAP(() => {
    // ScrollSmoother reads whatever the current scroll position is the
    // instant it's created and treats it as its baseline. On client-side
    // navigation that can race with Next.js's own scroll-to-top, so it can
    // initialize from a stale (nonzero) position and visibly animate back
    // up to the real one — reads as the page scrolling on its own right
    // after landing. Force it explicitly rather than trust the timing.
    window.scrollTo(0, 0);

    // Reduced-motion users get native, unsmoothed scrolling — no inertia lag.
    const reduced = prefersReducedMotion();
    const smoother = ScrollSmoother.create({
      wrapper: wrapperRef.current,
      content: contentRef.current,
      smooth: reduced ? 0 : 1.2,
      normalizeScroll: !reduced,
    });

    return () => smoother.kill();
  }, []);

  return (
    <div id="smooth-wrapper" ref={wrapperRef}>
      <div id="smooth-content" ref={contentRef} className="pt-(--nav-h)">
        {children}
      </div>
    </div>
  );
}
