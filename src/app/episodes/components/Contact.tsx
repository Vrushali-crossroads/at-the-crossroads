"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function Contact() {
  const rootRef = useRef<HTMLElement | null>(null);
  const emailRef = useRef<HTMLAnchorElement | null>(null);
  const darkenRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".ct-reveal", { clearProps: "all", opacity: 1, y: 0, scale: 1 });
        gsap.set(emailRef.current, { clearProps: "all", scale: 1, boxShadow: "6px 6px 0 #FF7E5F" });
        gsap.set(darkenRef.current, { opacity: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          end: "top 45%",
          scrub: 0.6,
        },
      });

      tl.to(".ct-reveal", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.15 });

      // The email itself is the focal point: it becomes the star of the
      // section as it nears the viewport center, then gracefully eases
      // back down as the user keeps scrolling past.
      const easeUp = gsap.parseEase("back.out(1.6)");
      ScrollTrigger.create({
        trigger: emailRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          const centered = easeUp(Math.max(0, 1 - Math.abs(self.progress - 0.5) * 2));
          const shadowSpread = 6 + centered * 5;
          const glow = centered * 42;
          gsap.set(emailRef.current, {
            scale: 1 + centered * 0.18,
            boxShadow: `${shadowSpread}px ${shadowSpread}px 0 #FF7E5F, 0 0 ${glow}px rgba(255,194,31,${centered * 0.65})`,
          });
          gsap.set(darkenRef.current, { opacity: centered * 0.07 });
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="relative overflow-hidden px-6 py-18.5 text-center sm:px-11">
      <div ref={darkenRef} aria-hidden className="pointer-events-none absolute inset-0 bg-[#161310] opacity-0" />

      <div className="relative">
        <div className="ct-reveal reveal-fade mb-4 inline-block -rotate-1 rounded-[7px] bg-[#FFC21F] px-2.5 py-1.5 font-archivo text-xs font-black text-[#161310]">
          GET IN TOUCH
        </div>
        <h2 className="ct-reveal reveal-fade mb-4 font-sans text-xl font-extrabold text-[#161310]/72">
          Guest pitches, partnerships &amp; speaking
        </h2>
        <a
          ref={emailRef}
          href="mailto:hello@atcrossroads.in"
          className="ct-reveal reveal-fade inline-block rounded-2xl border-2 border-[#161310] bg-[#FFC21F] px-6 py-3 font-archivo text-[clamp(1.5rem,1rem+2.2vw,2.375rem)] font-black text-[#161310] shadow-[6px_6px_0_#FF7E5F] will-change-transform"
        >
          hello@atcrossroads.in
        </a>
      </div>
    </section>
  );
}
