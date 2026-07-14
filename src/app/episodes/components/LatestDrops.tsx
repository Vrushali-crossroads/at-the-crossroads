"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { EPISODES } from "../../data/episodes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const NUMBER_BADGE_CLASSES = [
  "bg-[#FFC21F] text-[#161310]",
  "bg-[#FF7E5F] text-white",
  "bg-[#2B4E55] text-white",
];

const CARD_ROTATION = [-1.4, 1.2, -1];

function handleCardEnter(e: React.MouseEvent<HTMLDivElement>) {
  if (prefersReducedMotion()) return;
  gsap.to(e.currentTarget, { y: -8, duration: 0.35, ease: "power2.out" });
}

function handleCardLeave(e: React.MouseEvent<HTMLDivElement>) {
  if (prefersReducedMotion()) return;
  gsap.to(e.currentTarget, { y: 0, duration: 0.45, ease: "power2.out" });
}

export default function LatestDrops() {
  const rootRef = useRef<HTMLElement | null>(null);
  const big = EPISODES.slice(0, 3);
  const small = EPISODES.slice(3, 7);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".ld-header .reveal-fade", ".ld-card", ".ld-strip", ".ld-badge"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
        });
        return;
      }

      gsap.set(".ld-badge", { scale: 0 });

      // Scrub-driven, fully reversible reveal as the grid scrolls into view.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 90%",
          end: "top 35%",
          scrub: 0.6,
        },
      });

      tl.to(".ld-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.2,
      })
        .to(
          ".ld-card",
          { y: 0, rotate: (i: number) => CARD_ROTATION[i % CARD_ROTATION.length], opacity: 1, duration: 1, stagger: 0.2 },
          0.15
        )
        .to(".ld-badge", { scale: 1, duration: 0.6, stagger: 0.2, ease: "back.out(2.4)" }, 0.3)
        .to(".ld-strip", { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, 0.5);

      // Slow continuous zoom on each thumbnail while it's near the viewport.
      gsap.utils.toArray<HTMLElement>(".ld-thumb-wrap").forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { scale: 1.08 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="drops" className="px-6 pb-2 pt-14 sm:px-11 sm:pt-16">
      <div className="ld-header mb-6.5 flex flex-wrap items-center justify-between gap-4">
        <h2 className="reveal-fade font-archivo text-[clamp(1.75rem,1.2rem+2.5vw,2.5rem)] font-black leading-none uppercase">
          Latest <span className="inline-block -rotate-1 bg-[#FFC21F] px-2">drops</span>
        </h2>
        <span className="reveal-fade rounded-[9px] bg-[#161310] px-4 py-2.5 font-archivo text-[13px] font-black text-[#FFC21F]">
          ALL 55 →
        </span>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {big.map((ep, i) => (
          <div
            key={ep.number}
            className="ld-card group overflow-hidden rounded-[14px] border-2 border-[#161310] bg-white opacity-0 shadow-[6px_6px_0_#161310] transition-shadow duration-300 hover:shadow-[9px_9px_0_#161310,0_0_28px_rgba(255,194,31,0.45)] will-change-transform"
            style={{ transform: "translateY(50px)" }}
            onMouseEnter={handleCardEnter}
            onMouseLeave={handleCardLeave}
          >
            <div className="ld-thumb-wrap relative aspect-video overflow-hidden border-b-2 border-[#161310] will-change-transform">
              <Image
                src={ep.image}
                alt={ep.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 flex scale-50 items-center justify-center opacity-0 transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-100 group-hover:opacity-100"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#161310]/85">
                  <svg viewBox="0 0 16 16" className="ml-0.5 h-4 w-4 fill-[#FFC21F]" aria-hidden>
                    <path d="M4 2.5v11l10-5.5-10-5.5z" />
                  </svg>
                </span>
              </span>
              <span className="absolute bottom-2.5 right-2.5 rounded-md bg-[#161310] px-2 py-1 font-sans text-xs font-extrabold text-[#FFC21F]">
                {ep.duration}
              </span>
            </div>
            <div className="p-4 pb-5">
              <div
                className={`ld-badge mb-2.5 inline-block rounded-[5px] px-2 py-1 font-archivo text-[11px] font-black tracking-[0.04em] ${NUMBER_BADGE_CLASSES[i % 3]}`}
              >
                {ep.number}
              </div>
              <div className="mb-2 font-sans text-[17px] font-extrabold leading-[1.24] text-[#161310]">
                {ep.title}
              </div>
              <div className="font-sans text-[13px] font-semibold text-[#161310]/55">{ep.guest}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3.5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {small.map((ep) => (
          <div
            key={ep.number}
            className="ld-strip relative aspect-video overflow-hidden rounded-[10px] border-2 border-[#161310] opacity-0 will-change-transform"
            style={{ transform: "translateY(30px)" }}
          >
            <div className="ld-thumb-wrap absolute inset-0 will-change-transform">
              <Image
                src={ep.image}
                alt={ep.title}
                fill
                className="object-cover transition-transform duration-500 hover:scale-110"
                sizes="(min-width: 640px) 25vw, 50vw"
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
