"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { floatIdle } from "./scrollFx";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const HERO_PIN_DISTANCE = "+=90%";

export default function StickerHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cta1Ref = useRef<HTMLSpanElement | null>(null);
  const cta2Ref = useRef<HTMLAnchorElement | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".sh-reveal", ".sh-photo", ".sh-photo-img"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          filter: "none",
        });
        return;
      }

      gsap.set(".sh-reveal", { y: 26, opacity: 0, filter: "blur(6px)" });
      gsap.set(".sh-photo", { scale: 0.94, opacity: 0 });
      gsap.set(".sh-photo-img", { scale: 1.15 });

      // Cinematic entrance on load.
      const introTl = gsap.timeline({ delay: 0.15 });
      introTl
        .to(".sh-reveal", {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.75,
          stagger: 0.12,
          ease: "power3.out",
        })
        .to(".sh-photo", { scale: 1, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5");

      // Idle "breathing" float on the CTAs so they never sit dead-still.
      floatIdle(".sh-cta-1", { distance: 5, duration: 2.4 });
      gsap.delayedCall(0.4, () => floatIdle(".sh-cta-2", { distance: 5, duration: 2.8 }));

      // Cinematic pin: on desktop, hold the hero in view while the scroll
      // itself drives the headline, photo, badges and background dots.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const tl = gsap.timeline({ defaults: { ease: "none" } });

        tl.to(".sh-line1", { yPercent: -30, scale: 0.92, duration: 1 }, 0)
          .to(".sh-line2", { yPercent: -14, duration: 1 }, 0)
          .to(".sh-highlight", { rotate: -8, duration: 0.3 }, 0)
          .to(".sh-highlight", { rotate: -1, duration: 0.7, ease: "power2.out" }, 0.3)
          .to(".sh-photo-img", { scale: 1, duration: 1 }, 0)
          .to(".sh-dots", { yPercent: -6, duration: 1 }, 0)
          .to(".sh-badge-count", { y: -46, rotate: -14, duration: 1 }, 0)
          .to(".sh-badge-ep", { y: -20, rotate: 10, duration: 1 }, 0)
          .to(".sh-orbit-1", { x: 16, y: -14, duration: 0.5 }, 0)
          .to(".sh-orbit-1", { x: -8, y: -24, duration: 0.5 }, 0.5)
          .to(".sh-orbit-2", { x: -14, y: 10, duration: 0.5 }, 0)
          .to(".sh-orbit-2", { x: 10, y: 22, duration: 0.5 }, 0.5);

        // Nav is fixed on top of the page — pin the hero starting just
        // below it, not at the very top, so its own content never ends up
        // rendered underneath the nav bar for the whole pin duration.
        const navHeight = document.querySelector("nav")?.getBoundingClientRect().height ?? 0;
        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: `top top+=${navHeight}`,
          end: HERO_PIN_DISTANCE,
          pin: true,
          scrub: 1,
          animation: tl,
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
      id="sticker-hero"
      className="relative grid grid-cols-1 items-center gap-8 overflow-hidden bg-[#FFC21F] px-6 pb-14 pt-(--sticker-nav-h) sm:px-11 sm:pb-16 lg:grid-cols-[1.05fr_0.95fr]"
    >
      <div
        aria-hidden
        className="sh-dots pointer-events-none absolute right-6 top-6 hidden h-[120px] w-[120px] opacity-50 [background-image:radial-gradient(#161310_2px,transparent_2.2px)] [background-size:15px_15px] will-change-transform sm:block"
      />

      <div>
        <div className="sh-reveal mb-5 inline-block -rotate-2 rounded-[7px] bg-[#161310] px-3.5 py-2 font-archivo text-xs font-black tracking-[0.05em] text-[#FFC21F] will-change-transform">
          🎙 PODCAST · NEW EVERY WEEK
        </div>
        <h1 className="mb-5 font-archivo text-[clamp(2.25rem,1.3rem+4.5vw,3.75rem)] font-black leading-[0.96] tracking-[-0.02em] uppercase will-change-transform">
          <span className="sh-reveal sh-line1 block">Real talk at</span>
          <span className="sh-reveal sh-line2 block">
            life&apos;s{" "}
            <span className="sh-highlight inline-block -rotate-1 bg-[#161310] px-3 py-0.5 text-[#FFC21F] shadow-[5px_5px_0_rgba(22,19,16,0.18)] will-change-transform">
              crossroads
            </span>
          </span>
        </h1>
        <p className="sh-reveal mb-7 max-w-[455px] font-sans text-lg font-semibold text-[#161310]/82">
          No fluff — honest conversations with leaders and changemakers, and the lessons they
          wish they&apos;d learned sooner.
        </p>
        <div className="sh-reveal flex flex-wrap gap-3">
          <span
            ref={cta1Ref}
            className="sh-cta-1 rounded-xl bg-[#161310] px-6 py-4 font-archivo text-sm font-black text-white shadow-[4px_4px_0_rgba(22,19,16,0.25)] will-change-transform"
          >
            ▶ SUBSCRIBE ON YOUTUBE
          </span>
          <a
            ref={cta2Ref}
            href="#collab"
            className="sh-cta-2 rounded-xl border-2 border-[#161310] bg-white px-6 py-4 font-archivo text-sm font-black text-[#161310] shadow-[4px_4px_0_#161310] transition-transform duration-200 hover:-translate-y-0.5 will-change-transform"
          >
            COLLABORATE →
          </a>
        </div>
      </div>

      <div className="sh-photo relative flex justify-center">
        <span
          aria-hidden
          className="sh-orbit-1 absolute -left-3 top-6 text-2xl text-[#161310]/70 will-change-transform"
        >
          ✦
        </span>
        <span
          aria-hidden
          className="sh-orbit-2 absolute -right-2 bottom-10 text-2xl text-[#161310]/70 will-change-transform"
        >
          〜
        </span>
        <div className="relative aspect-[380/460] w-[380px] max-w-full overflow-hidden rounded-2xl border-[3px] border-[#161310] bg-white shadow-[9px_9px_0_#161310]">
          <Image
            src="/images/vrushali-hero.jpeg"
            alt="Vrushali"
            fill
            className="sh-photo-img object-cover will-change-transform"
            sizes="380px"
          />
        </div>
        <div className="sh-badge-ep absolute right-[-12px] top-[18px] rotate-6 rounded-xl border-2 border-[#161310] bg-white px-3.5 py-2.5 font-archivo text-[13px] font-black shadow-[3px_3px_0_#161310] will-change-transform">
          EP 09 OUT NOW!
        </div>
        <div className="sh-badge-count absolute bottom-[26px] left-[-14px] -rotate-[4deg] rounded-full bg-[#161310] px-3.5 py-2.5 font-sans text-[13px] font-extrabold text-[#FFC21F] will-change-transform">
          🔥 55 episodes
        </div>
      </div>
    </section>
  );
}
