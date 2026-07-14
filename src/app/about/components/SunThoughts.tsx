"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Opposite pattern from the episodes cards above (right, center, left)
// purely for visual variety between the two grids.
const CARD_X = [70, 0, -70];

type Thought = {
  quote: string;
  meta: string;
  accent: string;
  duration?: string;
};

const THOUGHTS: Thought[] = [
  {
    quote:
      "The people who change you rarely set out to. They just answer your questions honestly.",
    meta: "A note · 3d ago",
    accent: "var(--color-mango)",
    duration: "0:45",
  },
  {
    quote:
      "Strategy is overrated. The leaders I admire fixed themselves before they fixed the org.",
    meta: "Reflecting on EP 09 · 6d ago",
    accent: "var(--color-teal)",
  },
  {
    quote: "Compassion without systems burns out fast. Rescue work taught me that.",
    meta: "After EP 08 · 1w ago",
    accent: "#FF7E5F",
    duration: "1:10",
  },
];

export default function SunThoughts() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".st-header .reveal-fade", ".st-card"], { clearProps: "all", opacity: 1, x: 0, y: 0 });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 86%",
          end: "top 40%",
          scrub: 0.6,
        },
      });

      tl.to(".st-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.2,
      }).to(".st-card", { x: 0, y: 0, opacity: 1, duration: 1, stagger: 0.2 }, 0.2);

      // A quiet lift as each card nears the middle of the viewport — a soft
      // echo of the poster page's "centered = emphasized" idea, scaled way
      // down to fit this page's calmer register.
      gsap.utils.toArray<HTMLElement>(".st-card").forEach((card) => {
        ScrollTrigger.create({
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
          onUpdate: (self) => {
            const centered = 1 - Math.abs(self.progress - 0.5) * 2;
            gsap.set(card, { scale: 0.97 + centered * 0.03 });
          },
        });
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-cream px-(--space-section-x) py-(--space-section-y)">
      <div className="st-header mx-auto mb-9 max-w-xl text-center">
        <div className="reveal-fade eyebrow mb-3">FROM THE CROSSROADS</div>
        <h2 className="reveal-fade mb-2.5">Thoughts between episodes</h2>
        <p className="reveal-fade text-ink/62">
          Short reflections and quick videos on the ideas I can&apos;t stop thinking about.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-(--space-grid-gap) sm:grid-cols-3">
        {THOUGHTS.map((t, i) => (
          <div
            key={t.meta}
            className="st-card flex min-h-57.5 flex-col justify-between rounded-2xl border-t-4 bg-white p-6.5 opacity-0 shadow-[0_14px_30px_-22px_rgba(24,22,18,0.4)]"
            style={{
              borderTopColor: t.accent,
              transform: `translate(${CARD_X[i % CARD_X.length]}px, 36px)`,
            }}
          >
            <p className="font-serif text-[22px] leading-[1.34] text-ink">&ldquo;{t.quote}&rdquo;</p>
            <div className="mt-5 flex items-center justify-between">
              <span className="font-sans text-[12.5px] font-semibold text-ink/50">{t.meta}</span>
              {t.duration ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 font-sans text-xs font-bold text-white">
                  ▶ {t.duration}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
