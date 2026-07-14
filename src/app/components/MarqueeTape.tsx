"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TAGS = ["Leadership", "Resilience", "Entrepreneurship", "Changemakers"];

function TapeGroup({ groupKey }: { groupKey: string }) {
  return (
    <div className="flex shrink-0 items-center">
      {TAGS.map((tag) => (
        <span key={`${groupKey}-${tag}`} className="flex items-center">
          <span className="px-5.5 font-archivo text-sm font-black tracking-wide text-[#FFC21F] uppercase">
            {tag}
          </span>
          <span className="px-5.5 text-white">●</span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeTape() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      if (prefersReducedMotion()) {
        gsap.set(track, { x: 0, skewX: 0 });
        return;
      }

      const xTo = gsap.quickTo(track, "x", { duration: 0.6, ease: "power3" });
      const skewTo = gsap.quickTo(track, "skewX", { duration: 0.3, ease: "power3" });

      // Driven by whole-page scroll progress (not its own local trigger) so
      // the strip is always in motion with the scrollbar and reverses
      // naturally the instant the user scrolls back up.
      const st = ScrollTrigger.create({
        trigger: document.documentElement,
        start: 0,
        end: "max",
        onUpdate: (self) => {
          const velocity = self.getVelocity() / 1000;
          xTo(-self.progress * track.scrollWidth * 0.4);
          skewTo(gsap.utils.clamp(-8, 8, -velocity * 0.6));
        },
      });

      const onScrollEnd = () => skewTo(0);
      ScrollTrigger.addEventListener("scrollEnd", onScrollEnd);

      return () => {
        st.kill();
        ScrollTrigger.removeEventListener("scrollEnd", onScrollEnd);
      };
    },
    { scope: wrapRef }
  );

  return (
    <div ref={wrapRef} className="overflow-hidden bg-[#161310] py-3">
      <div ref={trackRef} className="flex w-max will-change-transform">
        <TapeGroup groupKey="a" />
        <TapeGroup groupKey="b" />
        <TapeGroup groupKey="c" />
      </div>
    </div>
  );
}
