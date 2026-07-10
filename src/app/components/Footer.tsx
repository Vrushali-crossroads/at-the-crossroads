"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const SOCIALS = ["YouTube", "Instagram", "LinkedIn", "Spotify", "Apple Podcasts"];

export default function Footer() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".ft-reveal", ".ft-social-link"], { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 92%",
          toggleActions: "play none none none",
        },
      });

      tl.to(".ft-reveal", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
      }).to(
        ".ft-social-link",
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          stagger: 0.06,
          ease: "power3.out",
        },
        "-=0.4"
      );
    },
    { scope: rootRef }
  );

  return (
    <footer
      ref={rootRef}
      className="flex flex-wrap items-center justify-between gap-4.5 bg-teal px-(--space-section-x) py-9 text-cream"
    >
      <div className="ft-reveal reveal-fade flex flex-col leading-[0.85]">
        <span className="font-script ml-0.5 text-base text-mango-light">at the</span>
        <span className="font-serif text-base font-semibold tracking-[0.32em] text-cream">
          CROSSROADS
        </span>
      </div>

      <div className="ft-reveal flex flex-wrap gap-5.5 font-sans text-[13px] font-semibold text-cream/80">
        {SOCIALS.map((social) => (
          <a
            key={social}
            href="#"
            className="ft-social-link group relative translate-y-3 py-0.5 opacity-0"
          >
            {social}
            <span className="absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-mango-light transition-transform duration-300 ease-out group-hover:scale-x-100" />
          </a>
        ))}
      </div>

      <div className="ft-reveal reveal-fade font-sans text-xs font-medium text-cream/50">
        © 2026 atcrossroads.in
      </div>
    </footer>
  );
}
