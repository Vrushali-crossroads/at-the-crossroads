"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SunHost() {
  const rootRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const photoColRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".ho-reveal", ringRef.current, photoRef.current, photoColRef.current, textColRef.current], {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          clipPath: "circle(100% at 50% 50%)",
        });
        return;
      }

      gsap.set(".ho-reveal", { y: 22, opacity: 0, filter: "blur(6px)" });
      gsap.set(ringRef.current, { opacity: 0, scale: 0.85 });
      gsap.set(photoRef.current, { clipPath: "circle(0% at 50% 50%)" });
      // The two columns enter from their own sides — photo from the left,
      // text from the right — instead of both just fading up in place.
      gsap.set(photoColRef.current, { x: -70, opacity: 0 });
      gsap.set(textColRef.current, { x: 70 });

      // A soft "iris" opening for the portrait — an elegant, unhurried
      // reveal that echoes the circular brush-motif rather than a plain fade.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          end: "top 35%",
          scrub: 0.6,
        },
      });

      tl.to(photoColRef.current, { x: 0, opacity: 1, duration: 1 }, 0)
        .to(textColRef.current, { x: 0, duration: 1 }, 0)
        .to(ringRef.current, { opacity: 1, scale: 1, duration: 1 }, 0)
        .to(photoRef.current, { clipPath: "circle(100% at 50% 50%)", duration: 1 }, 0.15)
        .to(
          ".ho-reveal",
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.2 },
          0.3
        );

      gsap.to(ringRef.current, { rotate: 360, duration: 70, repeat: -1, ease: "none" });

      // Gentle depth: the ring drifts a touch slower than the portrait as
      // the section passes by, echoing the hero's parallax without repeating
      // it exactly.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const depthTl = gsap.timeline({ defaults: { ease: "none" } });
        depthTl.to(ringRef.current, { yPercent: 8, duration: 1 }, 0).to(
          photoRef.current,
          { yPercent: -8, duration: 1 },
          0
        );

        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
          animation: depthTl,
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
      id="about"
      className="grid grid-cols-1 items-center gap-14 bg-white px-(--space-section-x) py-(--space-section-y) sm:grid-cols-2"
    >
      <div ref={photoColRef} className="relative mx-auto flex w-full max-w-95 justify-center will-change-transform">
        <div
          ref={ringRef}
          aria-hidden
          className="absolute h-105 w-105 max-w-full rounded-full will-change-transform"
          style={{ background: "radial-gradient(circle, var(--color-mango-light), var(--color-mango))" }}
        />
        <div
          ref={photoRef}
          className="relative aspect-square w-95 max-w-full overflow-hidden rounded-full border-[7px] border-white shadow-[0_20px_40px_-20px_rgba(24,22,18,0.4)] will-change-transform"
        >
          <Image
            src="/images/vrushali-hero.jpeg"
            alt="Vrushali"
            fill
            className="object-cover"
            sizes="(min-width: 640px) 40vw, 90vw"
          />
        </div>
      </div>

      <div ref={textColRef} className="will-change-transform">
        <span className="ho-reveal font-script block text-(length:--text-script-lg) text-mango">
          Hi, I&apos;m
        </span>
        <h2 className="ho-reveal mt-1 mb-4.5">Vrushali</h2>
        <p className="ho-reveal mb-3.5 text-ink/72">
          Think about the one conversation that changed how you see things. For me, that happens
          almost every episode — the crossroads where paths meet.
        </p>
        <p className="ho-reveal text-ink/72">
          Every guest leaves me with a lesson I can apply to my own life. My hope is you walk away
          with the same.
        </p>
      </div>
    </section>
  );
}
