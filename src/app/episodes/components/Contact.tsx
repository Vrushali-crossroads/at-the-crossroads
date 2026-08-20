"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Contact() {
  const rootRef = useRef<HTMLElement | null>(null);
  const underlineRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".ct-reveal", { clearProps: "all", opacity: 1, y: 0 });
        gsap.set(underlineRef.current, { attr: { "stroke-dashoffset": 0 } });
        return;
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
        .to(".ct-reveal", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.12, ease: "power3.out" })
        .to(
          underlineRef.current,
          { attr: { "stroke-dashoffset": 0 }, duration: 0.9, ease: "power2.inOut" },
          "-=0.3"
        );
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden px-6 py-18.5 text-center sm:px-11">
      <div className="relative">
        <div className="ct-reveal reveal-fade mb-4 inline-block -rotate-1 rounded-[7px] bg-mango px-2.5 py-1.5 font-archivo text-xs font-black text-ink">
          GET IN TOUCH
        </div>
        <h2 className="ct-reveal reveal-fade mb-4 font-sans text-xl font-extrabold text-ink/72">
          Guest pitches, partnerships &amp; speaking
        </h2>
        <a
          href="mailto:vrushali@atcrossroads.in"
          className="ct-reveal reveal-fade relative inline-block text-(length:--text-contact-link) text-teal"
        >
          vrushali@atcrossroads.in
          <svg
            className="pointer-events-none absolute -bottom-1 left-0 w-full"
            viewBox="0 0 200 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={underlineRef}
              d="M2 4 L198 4"
              fill="none"
              stroke="var(--color-teal)"
              strokeOpacity="0.32"
              strokeWidth="3"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
