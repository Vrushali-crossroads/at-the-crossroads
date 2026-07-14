"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "../../components/useMagnetic";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ContactHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const mailRef = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(mailRef, 0.25);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".ch-reveal", ".ch-doodle"], { clearProps: "all", opacity: 1, y: 0, x: 0, scale: 1, rotate: 0 });
        return;
      }

      gsap.set(".ch-reveal", { y: 26, opacity: 0, filter: "blur(6px)" });
      gsap.set(".ch-doodle", { opacity: 0, scale: 0, rotate: -45 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".ch-reveal", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      }).to(".ch-doodle", { opacity: 1, scale: 1, rotate: 0, duration: 0.7, stagger: 0.15, ease: "back.out(2.2)" }, "-=0.5");

      // Doodles drift in loose little orbits while the hero is in view.
      gsap.to(".ch-doodle-1", { x: 14, y: -10, duration: 3.2, repeat: -1, yoyo: true, ease: "sine.inOut" });
      gsap.to(".ch-doodle-2", { x: -12, y: 12, duration: 3.6, repeat: -1, yoyo: true, ease: "sine.inOut" });

      // Background dots drift opposite the scroll, slower than the
      // foreground — the same depth cue used on the episodes hero.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          animation: gsap.to(dotsRef.current, { yPercent: 30, ease: "none" }),
        });
        return () => st.kill();
      });
      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-[#FFC21F] px-6 pb-16 pt-(--sticker-nav-h) text-center sm:px-11"
    >
      <div
        ref={dotsRef}
        aria-hidden
        className="pointer-events-none absolute right-[8%] top-20 hidden h-24 w-24 opacity-50 [background-image:radial-gradient(#161310_2px,transparent_2.2px)] [background-size:15px_15px] will-change-transform sm:block"
      />
      <span aria-hidden className="ch-doodle ch-doodle-1 absolute left-[10%] top-28 text-3xl text-[#161310]/70">
        ✦
      </span>
      <span aria-hidden className="ch-doodle ch-doodle-2 absolute bottom-24 right-[12%] text-3xl text-[#161310]/70">
        〜
      </span>

      <div className="mx-auto max-w-3xl pt-10 sm:pt-14">
        <div className="ch-reveal mb-6 inline-block -rotate-2 rounded-[7px] bg-[#161310] px-3.5 py-2 font-archivo text-xs font-black tracking-[0.05em] text-[#FFC21F]">
          🎙 GET IN TOUCH
        </div>
        <h1 className="ch-reveal mb-6 font-archivo text-[clamp(2rem,1.2rem+4vw,3.5rem)] font-black leading-[0.98] uppercase">
          Let&apos;s build something worth{" "}
          <span className="inline-block -rotate-1 bg-[#161310] px-3 py-0.5 text-[#FFC21F] shadow-[5px_5px_0_rgba(22,19,16,0.18)]">
            listening
          </span>{" "}
          to.
        </h1>
        <p className="ch-reveal mx-auto mb-9 max-w-lg font-sans text-lg font-semibold text-[#161310]/82">
          Guest pitches, brand partnerships, speaking enquiries — whatever brought you here, I
          read every message myself.
        </p>

        <a
          ref={mailRef}
          href="mailto:hello@atcrossroads.in"
          className="ch-reveal magnetic-btn inline-block rounded-2xl border-2 border-[#161310] bg-white px-7 py-4 font-archivo text-[clamp(1.1rem,0.9rem+1vw,1.5rem)] font-black text-[#161310] shadow-[6px_6px_0_#161310]"
        >
          hello@atcrossroads.in
        </a>
      </div>
    </section>
  );
}
