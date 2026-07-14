"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { useMagnetic } from "../../components/useMagnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Newsletter() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const joinRef = useRef<HTMLButtonElement | null>(null);

  useMagnetic(joinRef, 0.4);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([rootRef.current, ".nl-input"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
        });
        return;
      }

      gsap.set(rootRef.current, { y: 70, opacity: 0 });
      gsap.set(".nl-input", { scaleX: 0.9, transformOrigin: "left center" });
      gsap.set(".nl-shape", { opacity: 0.5 });

      gsap.to(rootRef.current, {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 92%",
          end: "top 55%",
          scrub: 0.6,
        },
      });

      gsap.to(".nl-input", {
        scaleX: 1,
        duration: 1,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 0.6,
        },
      });

      // Subtle pulse every few seconds so the CTA never sits fully still.
      gsap.to(".nl-join", {
        scale: 1.05,
        duration: 0.5,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
        repeatDelay: 2.6,
      });

      // Background shapes drift slowly and continuously.
      gsap.to(".nl-shape-1", { x: 18, y: -12, duration: 6, ease: "sine.inOut", repeat: -1, yoyo: true });
      gsap.to(".nl-shape-2", { x: -14, y: 16, duration: 7, ease: "sine.inOut", repeat: -1, yoyo: true });
    },
    { scope: rootRef }
  );

  return (
    <div className="px-6 sm:px-11">
      <div
        ref={rootRef}
        className="relative grid grid-cols-1 items-center gap-8 overflow-hidden rounded-[18px] border-2 border-[#161310] bg-[#FF7E5F] p-8 text-white shadow-[8px_8px_0_#161310] will-change-transform sm:p-11.5 lg:grid-cols-[1fr_0.9fr]"
      >
        <span
          aria-hidden
          className="nl-shape nl-shape-1 pointer-events-none absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/15 will-change-transform"
        />
        <span
          aria-hidden
          className="nl-shape nl-shape-2 pointer-events-none absolute -bottom-8 right-8 h-16 w-16 rounded-full bg-white/10 will-change-transform"
        />

        <div className="relative">
          <h2 className="mb-2.5 font-archivo text-[clamp(1.5rem,1.1rem+1.8vw,2rem)] font-black leading-none uppercase">
            The Crossroad Note
          </h2>
          <p className="font-sans text-base font-semibold text-white/92">
            One lesson from the week&apos;s conversation, in your inbox every Sunday.
          </p>
        </div>
        <form
          className="relative flex gap-2.5 rounded-xl border-2 border-[#161310] bg-white p-1.5 pl-4.5"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            type="email"
            placeholder="your@email.com"
            className="nl-input min-w-0 flex-1 bg-transparent font-sans text-sm font-semibold text-[#161310] placeholder:text-[#161310]/45 focus:outline-none"
          />
          <span className="nl-join shrink-0">
            <button
              ref={joinRef}
              type="submit"
              className="magnetic-btn rounded-[9px] border-2 border-[#161310] bg-[#FFC21F] px-5.5 py-3 font-archivo text-[13px] font-black text-[#161310]"
            >
              JOIN
            </button>
          </span>
        </form>
      </div>
    </div>
  );
}
