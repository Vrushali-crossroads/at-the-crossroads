"use client";

import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const TAPE_ITEMS = ["LEADERSHIP", "RESILIENCE", "ENTREPRENEURSHIP", "CHANGEMAKERS"];

function TapeSet({ setKey, innerRef, hidden }: { setKey: string; innerRef?: React.Ref<HTMLDivElement>; hidden?: boolean }) {
  return (
    <div ref={innerRef} className="flex shrink-0 items-center" aria-hidden={hidden}>
      {TAPE_ITEMS.map((item) => (
        <span key={`${setKey}-${item}`} className="flex items-center">
          <span className="px-6 font-sans text-sm font-semibold tracking-[0.14em] text-cream">
            {item}
          </span>
          <span className="px-6 text-mango">&#10022;</span>
        </span>
      ))}
    </div>
  );
}

export default function MarqueeTape() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const firstSetRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  // How many times TAPE_ITEMS needs to repeat so the strip never runs out of
  // content mid-scroll. Depends on one set's rendered width vs the viewport,
  // so it's measured after mount rather than guessed as a fixed number.
  const [copies, setCopies] = useState(2);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const firstSet = firstSetRef.current;
    if (!wrap || !firstSet) return;

    const recalc = () => {
      const setWidth = firstSet.offsetWidth || 1;
      // The track loops by shifting exactly one set-width to the left, so
      // there must always be at least two full sets' worth of content ahead
      // of the viewport's right edge for that shift to look seamless.
      const needed = Math.ceil((wrap.offsetWidth * 2) / setWidth) + 1;
      setCopies((prev) => (prev === needed ? prev : Math.max(needed, 2)));
    };

    recalc();
    window.addEventListener("resize", recalc);
    return () => window.removeEventListener("resize", recalc);
  }, []);

  useGSAP(
    () => {
      const track = trackRef.current;
      if (!track) return;

      if (prefersReducedMotion()) {
        gsap.set(wrapRef.current, { clipPath: "inset(0 0% 0 0)" });
        gsap.set(track, { skewX: 0, xPercent: 0 });
        return;
      }

      tweenRef.current?.kill();
      tweenRef.current = gsap.to(track, {
        xPercent: -100 / copies,
        duration: 22,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      gsap.fromTo(
        wrapRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "power4.inOut",
          onComplete: () => tweenRef.current?.play(),
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(track, { skewX: -8 }, { skewX: 0, duration: 1.1, ease: "power4.inOut" });
    },
    { scope: wrapRef, dependencies: [copies] }
  );

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden bg-teal py-3.5"
      style={{ clipPath: "inset(0 100% 0 0)" }}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap">
        {Array.from({ length: copies }).map((_, i) => (
          <TapeSet key={i} setKey={`c${i}`} innerRef={i === 0 ? firstSetRef : undefined} hidden={i > 0} />
        ))}
      </div>
    </div>
  );
}
