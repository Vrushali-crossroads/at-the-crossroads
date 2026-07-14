"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { floatIdle } from "./scrollFx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".ab-reveal", ".ab-badge-host", ".ab-photo", ".ab-photo-img", ".ab-ring"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          filter: "none",
          clipPath: "inset(0 0 0 0)",
        });
        return;
      }

      gsap.set(".ab-reveal", { y: 22, opacity: 0, filter: "blur(6px)" });
      gsap.set(".ab-badge-host", { scale: 0, opacity: 0 });
      gsap.set(".ab-photo", { clipPath: "inset(0 0 0 100%)" });
      gsap.set(".ab-photo-img", { scale: 1.14 });

      // Small doodles float continuously, independent of scroll.
      floatIdle(".ab-doodle-1", { distance: 8, duration: 3.2 });
      gsap.delayedCall(0.5, () => floatIdle(".ab-doodle-2", { distance: 6, duration: 3.6 }));

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "none" } });
        tl.to(".ab-photo", { clipPath: "inset(0 0 0 0%)", duration: 0.5 }, 0)
          .to(".ab-photo-img", { scale: 1, duration: 1 }, 0)
          .to(".ab-ring", { rotate: 50, duration: 1 }, 0)
          .to(".ab-reveal", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.35 }, 0.15)
          .to(".ab-badge-host", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.6)" }, 0.85);

        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "+=70%",
          pin: true,
          scrub: 1,
          animation: tl,
        });

        return () => st.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 85%",
            end: "top 30%",
            scrub: 0.6,
          },
        });
        tl.to(".ab-photo", { clipPath: "inset(0 0 0 0%)", duration: 1 }, 0)
          .to(".ab-photo-img", { scale: 1, duration: 1 }, 0)
          .to(".ab-reveal", { y: 0, opacity: 1, filter: "blur(0px)", duration: 1, stagger: 0.3 }, 0.1)
          .to(".ab-badge-host", { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2.6)" }, 0.7);

        return () => tl.scrollTrigger?.kill();
      });

      return () => mm.revert();
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="about"
      className="relative grid grid-cols-1 items-center gap-9 px-6 py-16 sm:px-11 sm:py-18.5 lg:grid-cols-[0.6fr_1.4fr]"
    >
      <span aria-hidden className="ab-doodle-1 absolute left-2 top-4 text-2xl text-[#161310]/25">
        ✦
      </span>
      <span
        aria-hidden
        className="ab-doodle-2 absolute bottom-6 right-4 text-2xl text-[#161310]/25 lg:right-[38%]"
      >
        〜
      </span>

      <div className="relative mx-auto w-full max-w-75 lg:max-w-none">
        <div
          aria-hidden
          className="ab-ring pointer-events-none absolute -inset-4 rounded-[26px] border-2 border-dashed border-[#161310]/25 will-change-transform"
        />
        <div className="ab-photo relative aspect-4/5 w-full overflow-hidden rounded-2xl border-[3px] border-[#161310] bg-white shadow-[9px_9px_0_#FFC21F]">
          <Image
            src="/images/vrushali-hero.jpeg"
            alt="Vrushali"
            fill
            className="ab-photo-img object-cover will-change-transform"
            sizes="(min-width: 1024px) 40vw, 90vw"
          />
        </div>
      </div>
      <div>
        <div className="ab-badge-host mb-4 inline-block rounded-[7px] bg-[#161310] px-2.5 py-1.5 font-archivo text-xs font-black text-[#FFC21F]">
          YOUR HOST
        </div>
        <h2 className="ab-reveal mb-4.5 font-archivo text-[clamp(1.75rem,1.2rem+2.5vw,2.5rem)] font-black leading-none uppercase">
          Hi, I&apos;m Vrushali
        </h2>
        <p className="ab-reveal mb-3.5 font-sans text-[17px] leading-[1.6] font-medium text-[#161310]/78">
          Think about the one conversation that changed how you see things. For me, that happens
          almost every episode — that&apos;s what this podcast is built around.
        </p>
        <p className="ab-reveal font-sans text-[17px] leading-[1.6] font-medium text-[#161310]/78">
          Every guest leaves me with a lesson I can use. My hope is you walk away with the same.
        </p>
      </div>
    </section>
  );
}
