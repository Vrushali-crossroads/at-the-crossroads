"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const BAR_COUNT = 28;
// A waveform-like curve (not random noise) so the bars read as an audio
// signal rather than a jittery equalizer.
const PATTERN = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t = (i / (BAR_COUNT - 1)) * Math.PI * 2.4;
  return 0.22 + 0.68 * Math.abs(Math.sin(t)) * (0.55 + 0.45 * Math.sin(t * 0.4));
});

const BAR_W = 6;
const GAP = 10;
const VB_H = 100;

export default function SoundwaveDivider() {
  const rootRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const bars = gsap.utils.toArray<SVGRectElement>(".sw-bar");

      if (prefersReducedMotion()) {
        gsap.set(bars, { scaleY: (i) => PATTERN[i], transformOrigin: "50% 50%" });
        return;
      }

      gsap.set(bars, { scaleY: 0.16, transformOrigin: "50% 50%" });

      gsap.to(bars, {
        scaleY: (i) => PATTERN[i],
        ease: "sine.inOut",
        stagger: { each: 0.015, from: "center" },
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <div
      ref={rootRef}
      className="flex justify-center px-(--space-section-x) py-10 sm:py-12"
    >
      <svg
        viewBox={`0 0 ${BAR_COUNT * GAP} ${VB_H}`}
        className="h-14 w-full max-w-xl sm:h-16"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden
      >
        {PATTERN.map((_, i) => (
          <rect
            key={i}
            className="sw-bar"
            x={i * GAP + (GAP - BAR_W) / 2}
            y={(VB_H - 60) / 2}
            width={BAR_W}
            height={60}
            rx={BAR_W / 2}
            fill={i % 2 === 0 ? "var(--color-mango)" : "var(--color-teal)"}
          />
        ))}
      </svg>
    </div>
  );
}
