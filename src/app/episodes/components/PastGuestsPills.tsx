"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { applyCenterEmphasis } from "./scrollFx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GUESTS = [
  "Ravi Pratap",
  "Vikash Bafna",
  "Chef Raj Sethia",
  "DJ Truth",
  "A Ranji Player",
  "An Ethical Hacker",
];

// Alternating per-chip horizontal drift speed for a subtle "traveling" feel.
const DRIFT = [10, -8, 12, -10, 8, -12, 14];

export default function PastGuestsPills() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".pg-reveal", ".pg-pill"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          x: 0,
          scale: 1,
          rotate: 0,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 90%",
          end: "top 45%",
          scrub: 0.6,
        },
      });

      tl.to(".pg-reveal", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1 }, 0).to(
        ".pg-pill",
        { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 1, stagger: 0.1, ease: "back.out(2)" },
        0.2
      );

      // Chips keep drifting horizontally at slightly different speeds as
      // the page scrolls, so the row always reads as "in motion".
      gsap.utils.toArray<HTMLElement>(".pg-pill").forEach((pill, i) => {
        gsap.to(pill, {
          x: DRIFT[i % DRIFT.length],
          ease: "none",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });

      applyCenterEmphasis(gsap.utils.toArray(".pg-pill"), { minScale: 0.95, maxScale: 1.08 });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="px-6 pb-2 pt-18 sm:px-11">
      <h2 className="pg-reveal reveal-fade mb-6 font-archivo text-[clamp(1.5rem,1.1rem+1.8vw,2.125rem)] font-black leading-none uppercase">
        Past <span className="inline-block -rotate-1 bg-[#FFC21F] px-2">guests</span>
      </h2>
      <div className="flex flex-wrap gap-2.75">
        {GUESTS.map((g) => (
          <span
            key={g}
            className="pg-pill inline-block rounded-full border-2 border-[#161310] bg-white px-4.5 py-2.5 font-sans text-[13.5px] font-extrabold opacity-0 shadow-[3px_3px_0_#161310] will-change-transform"
            style={{ transform: "translateY(12px) scale(0.75)" }}
          >
            {g}
          </span>
        ))}
        <span
          className="pg-pill inline-block rounded-full bg-[#161310] px-4.5 py-2.5 font-archivo text-[13px] font-black text-[#FFC21F] opacity-0 will-change-transform"
          style={{ transform: "translateY(12px) scale(0.75) rotate(-14deg)" }}
        >
          + 48 MORE
        </span>
      </div>
    </section>
  );
}
