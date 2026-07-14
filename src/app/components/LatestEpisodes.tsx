"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";
import { EPISODES } from "../data/episodes";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STRIP_IMAGES = [
  "/images/episodes/strip-1.jpg",
  "/images/episodes/strip-2.jpg",
  "/images/episodes/strip-3.jpg",
  "/images/episodes/strip-4.jpg",
];

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <path d="M4 2.5v11l10-5.5-10-5.5z" />
    </svg>
  );
}

export default function LatestEpisodes() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".ep-header .reveal-fade", ".ep-card", ".ep-strip-item"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
        });
        gsap.set(".ep-thumb-mask", { clipPath: "inset(0% 0 0 0)" });
        gsap.set(".ep-thumb-deco", { opacity: 1, scale: 1 });
        return;
      }

      const headerTl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      headerTl
        .to(".ep-header .reveal-fade", {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.1,
          ease: "power3.out",
        })
        .to(
          ".ep-card",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 0.8,
            stagger: 0.14,
            ease: "power3.out",
            // Once settled at its resting (identity) transform, hand control
            // back to CSS so the hover:-translate-y utility below can apply —
            // GSAP's inline transform would otherwise block it permanently.
            onComplete: () => gsap.set(".ep-card", { clearProps: "transform" }),
          },
          "-=0.35"
        )
        .to(
          ".ep-thumb-mask",
          {
            clipPath: "inset(0% 0 0 0)",
            duration: 0.9,
            stagger: 0.14,
            ease: "power4.out",
          },
          "<"
        )
        .to(
          ".ep-thumb-deco",
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.14,
            ease: "back.out(2.4)",
          },
          "-=0.5"
        );

      gsap.timeline({
        scrollTrigger: {
          trigger: ".ep-strip",
          start: "top 88%",
          toggleActions: "play none none none",
        },
      }).to(".ep-strip-item", {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      });

      // Subtle parallax on the thumbnail wrapper (not the <Image> itself, so
      // the image's own CSS hover-zoom keeps working uninterrupted) while the
      // section scrolls by. The wrapper is oversized (see JSX) so it never
      // reveals empty edges as it drifts.
      gsap.utils.toArray<HTMLElement>(".ep-thumb-mask").forEach((wrap) => {
        gsap.fromTo(
          wrap,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top bottom",
              end: "bottom top",
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      id="episodes"
      className="bg-white px-(--space-section-x) py-(--space-section-y)"
    >
      <div className="ep-header mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="reveal-fade eyebrow mb-3">LATEST EPISODES</div>
          <h2 className="reveal-fade">Fresh from the studio</h2>
        </div>
        <Link
          href="/episodes"
          className="reveal-fade group inline-flex items-center gap-1.5 font-sans text-[13.5px] font-bold text-teal"
        >
          All episodes
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-(--space-grid-gap) sm:grid-cols-2 lg:grid-cols-3">
        {EPISODES.slice(0, 3).map((ep) => (
          <div
            key={ep.number}
            className="ep-card group overflow-hidden rounded-2xl border border-ink/10 bg-cream opacity-0 transition-shadow duration-300 hover:-translate-y-1.5 hover:shadow-[0_20px_40px_-24px_rgba(26,23,20,0.35)]"
            style={{ transform: "translateY(40px) scale(0.96) rotate(-1.5deg)" }}
          >
            <div className="relative aspect-video overflow-hidden">
              {/* Slightly oversized (extends past the frame on the y-axis) so the
                  scroll-parallax drift below never reveals empty edges. */}
              <div className="reveal-thumb ep-thumb-mask absolute inset-x-0 top-[-6%] bottom-[-6%]">
                <Image
                  src={ep.image}
                  alt={ep.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="ep-thumb-deco pointer-events-none absolute inset-0 flex scale-75 items-center justify-center opacity-0">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/25 backdrop-blur-sm">
                  <PlayIcon className="ml-0.5 h-4 w-4 text-white" />
                </span>
              </div>
              <span className="ep-thumb-deco absolute bottom-2.5 right-2.5 scale-75 rounded-md bg-ink/90 px-2 py-1 font-sans text-xs font-bold text-white opacity-0">
                {ep.duration}
              </span>
            </div>
            <div className="p-[17px] pb-[21px]">
              <div className="mb-2 font-sans text-[11px] font-extrabold tracking-[0.12em] text-teal">
                {ep.number}
              </div>
              <div className="mb-2 font-sans text-lg leading-snug font-semibold text-ink">
                {ep.title}
              </div>
              <div className="font-sans text-[13px] text-ink/55">{ep.guest}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="ep-strip mt-3.5 grid grid-cols-2 gap-3.5 sm:grid-cols-4">
        {STRIP_IMAGES.map((src) => (
          <div
            key={src}
            className="ep-strip-item relative aspect-video scale-95 overflow-hidden rounded-xl opacity-0"
          >
            <Image
              src={src}
              alt=""
              fill
              className="object-cover"
              sizes="(min-width: 640px) 25vw, 50vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
