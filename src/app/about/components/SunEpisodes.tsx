"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { EPISODES } from "../../data/episodes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Cards enter from alternating sides instead of all rising in lock-step —
// left, center, right — for a touch of directional variety while scrolling.
const CARD_X = [-70, 0, 70];

export default function SunEpisodes() {
  const rootRef = useRef<HTMLElement | null>(null);
  const episodes = EPISODES.slice(0, 3);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".se-header .reveal-fade", ".se-card"], {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          end: "top 40%",
          scrub: 0.6,
        },
      });

      tl.to(".se-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.2,
      }).to(
        ".se-card",
        { x: 0, y: 0, opacity: 1, scale: 1, duration: 1, stagger: 0.2 },
        0.2
      );

      // Slow, continuous thumbnail drift while each card is near the
      // viewport — the same quiet parallax used on the live homepage's
      // episode grid, kept here for a consistent "editorial" feel.
      gsap.utils.toArray<HTMLElement>(".se-thumb-wrap").forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom top", scrub: 0.6 },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-white px-(--space-section-x) py-(--space-section-y)">
      <div className="se-header mx-auto mb-8.5 max-w-lg text-center">
        <div className="reveal-fade eyebrow mb-2.5">LATEST EPISODES</div>
        <h2 className="reveal-fade">Fresh from the studio</h2>
      </div>

      <div className="grid grid-cols-1 gap-5.5 sm:grid-cols-3">
        {episodes.map((ep, i) => (
          <div
            key={ep.number}
            className="se-card opacity-0"
            style={{ transform: `translate(${CARD_X[i % CARD_X.length]}px, 36px) scale(0.96)` }}
          >
            <div className="hover-elevate relative aspect-video overflow-hidden rounded-2xl shadow-[0_16px_34px_-20px_rgba(24,22,18,0.5)]">
              <div className="se-thumb-wrap absolute inset-x-0 top-[-6%] bottom-[-6%] will-change-transform">
                <Image
                  src={ep.image}
                  alt={ep.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-110"
                  sizes="(min-width: 640px) 33vw, 100vw"
                />
              </div>
              <span className="absolute bottom-2.5 right-2.5 rounded-md bg-ink/90 px-2 py-1 font-sans text-xs font-bold text-white">
                {ep.duration}
              </span>
            </div>
            <div className="px-1 pt-3.5">
              <div className="mb-1.5 font-sans text-[11px] font-bold tracking-[0.1em] text-mango">
                {ep.number}
              </div>
              <div className="mb-1 font-sans text-[17px] font-semibold leading-snug text-ink">
                {ep.title}
              </div>
              <div className="font-sans text-[13px] text-ink/50">{ep.guest}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
