"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Thought = {
  quote: string;
  meta: string;
  variant: "yellow" | "white" | "coral";
  duration?: string;
};

const THOUGHTS: Thought[] = [
  {
    quote:
      "The people who change you rarely set out to. They just answer your questions honestly.",
    meta: "3d ago",
    variant: "yellow",
    duration: "0:45",
  },
  {
    quote:
      "Strategy is overrated. The leaders I admire fixed themselves before they fixed the org.",
    meta: "On EP 09 · 6d ago",
    variant: "white",
  },
  {
    quote: "Compassion without systems burns out fast. Rescue work taught me that.",
    meta: "After EP 08",
    variant: "coral",
    duration: "1:10",
  },
];

const VARIANT_CLASSES: Record<Thought["variant"], string> = {
  yellow: "bg-[#FFC21F] text-[#161310]",
  white: "bg-white text-[#161310]",
  coral: "bg-[#FF7E5F] text-white",
};

// Alternating entrance side/rotation per card index.
const START_TRANSFORM = [
  "translateX(-90px) rotate(-10deg)",
  "translateX(90px) rotate(9deg)",
  "translateX(-90px) rotate(-8deg)",
];

function applyFocusEmphasis(elements: Element[]) {
  return elements.map((el) =>
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const centered = 1 - Math.abs(self.progress - 0.5) * 2; // 1 at center, 0 at edges
        const shadow = 5 + centered * 4;
        gsap.set(el, {
          scale: 0.92 + centered * 0.13,
          opacity: 0.6 + centered * 0.4,
          boxShadow: `${shadow}px ${shadow}px 0 #161310`,
        });
      },
    })
  );
}

export default function ThoughtsSection() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".th-header .reveal-fade", ".th-card"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
          rotate: 0,
          boxShadow: "6px 6px 0 #161310",
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          end: "top 30%",
          scrub: 0.6,
        },
      });

      tl.to(".th-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.2,
      }).to(
        ".th-card",
        { x: 0, y: 0, rotate: 0, opacity: 1, duration: 1, stagger: 0.25, ease: "back.out(1.7)" },
        0.15
      );

      applyFocusEmphasis(gsap.utils.toArray(".th-card"));
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="thoughts" className="px-6 pb-2 pt-16 sm:px-11">
      <div className="th-header mb-7 max-w-xl">
        <div className="reveal-fade mb-3 inline-block -rotate-1 rounded-[7px] bg-[#FF7E5F] px-2.5 py-1.5 font-archivo text-xs font-black text-white">
          FROM THE CROSSROADS
        </div>
        <h2 className="reveal-fade mb-2 font-archivo text-[clamp(1.6rem,1.1rem+2vw,2.375rem)] font-black leading-none uppercase">
          Thoughts in between
        </h2>
        <p className="reveal-fade font-sans text-base font-semibold text-[#161310]/65">
          Quick takes &amp; short videos on the ideas I can&apos;t stop thinking about.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4.5 sm:grid-cols-3">
        {THOUGHTS.map((t, i) => (
          <div
            key={t.meta}
            className={`th-card flex min-h-52.5 flex-col justify-between rounded-[14px] border-2 border-[#161310] p-6 opacity-0 shadow-[6px_6px_0_#161310] will-change-transform ${VARIANT_CLASSES[t.variant]}`}
            style={{ transform: START_TRANSFORM[i] }}
          >
            <p className="font-sans text-xl font-extrabold leading-[1.28]">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-sans text-xs font-bold opacity-70">{t.meta}</span>
              {t.duration ? (
                <span
                  className={`rounded-full px-3 py-1.5 font-sans text-xs font-extrabold ${
                    t.variant === "coral" ? "bg-white text-[#161310]" : "bg-[#161310] text-[#FFC21F]"
                  }`}
                >
                  ▶ {t.duration}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <a href="#" className="font-archivo text-sm font-black text-[#FF7E5F]">
          SEE ALL THOUGHTS →
        </a>
      </div>
    </section>
  );
}
