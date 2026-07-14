"use client";

import { useRef } from "react";
import { Archivo } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Loaded here (not just on /episodes and /contact) so this footer's
// "CROSSROADS" wordmark renders correctly on every page that uses it,
// including ones that never otherwise touch the Sticker Studio font.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
});

const SOCIALS = ["YouTube", "Instagram", "LinkedIn", "Spotify", "Apple"];
const ICON_ROTATION = [-8, 6, -6, 8, -5];

export default function StickerFooter() {
  // The trigger element stays untransformed so ScrollTrigger's own position
  // measurements never drift — only the inner wrapper is animated.
  const rootRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".sf-reveal", ".sf-social-link"], { clearProps: "all", opacity: 1, y: 0, rotate: 0 });
        gsap.set(innerRef.current, { clearProps: "all" });
        return;
      }

      gsap.set(innerRef.current, { y: 60 });
      gsap.set(".sf-social-link", { y: 14, opacity: 0, rotate: (i: number) => ICON_ROTATION[i] });

      // Footer is the last element on the page, so there's no scroll room
      // left *after* it — anchor the range to "top bottom" / "bottom bottom"
      // (its natural entry-to-max-scroll span) so the reveal always
      // actually completes instead of getting stuck partway.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom bottom",
          scrub: 0.6,
        },
      });

      tl.to(innerRef.current, { y: 0, duration: 1 }, 0)
        .to(".sf-reveal", { opacity: 1, y: 0, duration: 1 }, 0)
        .to(
          ".sf-social-link",
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1,
            stagger: 0.1,
            onComplete: () => gsap.set(".sf-social-link", { clearProps: "transform" }),
          },
          0.1
        );
    },
    { scope: rootRef }
  );

  return (
    <footer ref={rootRef} className={`${archivo.variable} overflow-hidden bg-[#161310] text-[#FFF7DA]`}>
      <div
        ref={innerRef}
        className="flex flex-wrap items-center justify-between gap-4.5 px-6 py-9 will-change-transform sm:px-11"
      >
        <div
          className="sf-reveal flex flex-col leading-[0.82] opacity-0"
          style={{ transform: "translateY(12px)" }}
        >
          <span className="ml-0.5 text-base text-[#FFC21F]" style={{ fontFamily: "var(--font-script)" }}>
            at the
          </span>
          <span className="font-archivo text-base font-black tracking-[0.05em]">CROSSROADS</span>
        </div>
        <div className="flex flex-wrap gap-5 font-sans text-[13px] font-extrabold text-[#FFF7DA]/80">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#"
              className="sf-social-link inline-block transition-transform duration-300 hover:-translate-y-1 hover:text-[#FFC21F]"
            >
              {s}
            </a>
          ))}
        </div>
        <div
          className="sf-reveal font-sans text-xs font-medium text-[#FFF7DA]/50 opacity-0"
          style={{ transform: "translateY(12px)" }}
        >
          © 2026 atcrossroads.in
        </div>
      </div>
    </footer>
  );
}
