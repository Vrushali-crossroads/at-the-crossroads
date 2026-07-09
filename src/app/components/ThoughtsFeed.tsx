"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Thought = {
  quote: string;
  meta: string;
  variant: "yellow" | "white" | "dark";
  duration?: string;
};

const THOUGHTS: Thought[] = [
  {
    quote:
      "The people who change you rarely set out to. They just answer your questions honestly.",
    meta: "A note · 3d ago",
    variant: "yellow",
    duration: "0:45",
  },
  {
    quote:
      "Strategy is overrated. The leaders I admire fixed themselves before they fixed the org.",
    meta: "Reflecting on EP 09 · 6d ago",
    variant: "white",
  },
  {
    quote: "Compassion without systems burns out fast. Rescue work taught me that.",
    meta: "After EP 08 · 1w ago",
    variant: "dark",
    duration: "1:10",
  },
];

const VARIANT_CLASSES: Record<Thought["variant"], string> = {
  yellow: "bg-[#ffe16b] text-ink",
  white: "border border-ink/10 bg-white text-ink",
  dark: "bg-teal text-cream",
};

const META_CLASSES: Record<Thought["variant"], string> = {
  yellow: "text-ink/62",
  white: "text-ink/50",
  dark: "text-cream/80",
};

const BADGE_CLASSES: Record<Thought["variant"], string> = {
  yellow: "bg-ink text-[#ffe16b]",
  white: "",
  dark: "bg-cream text-teal",
};

const QUOTE_MARK_CLASSES: Record<Thought["variant"], string> = {
  yellow: "text-ink/15",
  white: "text-ink/10",
  dark: "text-cream/20",
};

// Starting/resting rotation per card index — cards "deal" in like scattered
// notes and settle at a slight, alternating tilt (echoing the hero/episode
// photo cards' -1.5deg tilt elsewhere on the page).
const START_ROTATION = [-7, 5, -6];
const REST_ROTATION = [-1.2, 0, 1.2];

function PlayIcon({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" className={className} fill="currentColor" aria-hidden>
      <path d="M4 2.5v11l10-5.5-10-5.5z" />
    </svg>
  );
}

export default function ThoughtsFeed() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".tf-header .reveal-fade", ".tf-card", ".tf-quote-mark", ".tf-badge"], {
          clearProps: "all",
          opacity: 1,
          y: 0,
          scale: 1,
        });
        gsap.set(".tf-card", { rotate: (i: number) => REST_ROTATION[i] });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      tl.to(".tf-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      })
        .to(
          ".tf-card",
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: (i: number) => REST_ROTATION[i],
            duration: 0.9,
            stagger: 0.15,
            ease: "back.out(1.6)",
          },
          "-=0.3"
        )
        .to(
          ".tf-quote-mark",
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            stagger: 0.15,
            ease: "back.out(3)",
          },
          "-=0.7"
        )
        .to(
          ".tf-badge",
          {
            scale: 1,
            opacity: 1,
            duration: 0.4,
            stagger: 0.15,
            ease: "back.out(3)",
          },
          "-=0.4"
        );

      gsap.to(".tf-badge", {
        scale: 1.06,
        duration: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        stagger: 0.3,
        delay: 2,
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} id="thoughts" className="bg-cream px-(--space-section-x) py-(--space-section-y)">
      <div className="tf-header mb-9 max-w-xl">
        <div className="reveal-fade eyebrow mb-3">FROM THE CROSSROADS</div>
        <h2 className="reveal-fade mb-3">Thoughts between episodes</h2>
        <p className="reveal-fade text-ink/66">
          Short reflections and quick videos on the ideas I can&apos;t stop thinking
          about — shared between full conversations.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-(--space-grid-gap) sm:grid-cols-2 lg:grid-cols-3">
        {THOUGHTS.map((t, i) => (
          <div
            key={t.meta}
            className={`tf-card relative flex min-h-[236px] flex-col justify-between overflow-hidden rounded-2xl p-6 opacity-0 transition-shadow duration-300 hover:shadow-[0_24px_48px_-20px_rgba(26,23,20,0.35)] ${VARIANT_CLASSES[t.variant]}`}
            style={{
              transform: `translateY(50px) scale(0.85) rotate(${START_ROTATION[i]}deg)`,
            }}
            onMouseEnter={(e) => {
              if (prefersReducedMotion()) return;
              gsap.to(e.currentTarget, { y: -8, duration: 0.4, ease: "power2.out" });
            }}
            onMouseLeave={(e) => {
              if (prefersReducedMotion()) return;
              gsap.to(e.currentTarget, { y: 0, duration: 0.5, ease: "power2.out" });
            }}
          >
            <span
              aria-hidden
              className={`tf-quote-mark absolute -top-2 left-4 scale-0 font-serif text-8xl opacity-0 ${QUOTE_MARK_CLASSES[t.variant]}`}
            >
              &ldquo;
            </span>

            <p className="relative text-(length:--text-quote) leading-[1.34] font-serif">
              &ldquo;{t.quote}&rdquo;
            </p>

            <div className="relative mt-5 flex items-center justify-between">
              <span className={`font-sans text-[13px] font-semibold ${META_CLASSES[t.variant]}`}>
                {t.meta}
              </span>
              {t.duration ? (
                <span
                  className={`tf-badge inline-flex scale-0 items-center gap-1.5 rounded-full px-3 py-1.5 font-sans text-xs font-bold opacity-0 ${BADGE_CLASSES[t.variant]}`}
                >
                  <PlayIcon className="h-2.5 w-2.5" />
                  {t.duration}
                </span>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5">
        <a
          href="#"
          className="group inline-flex items-center gap-1.5 font-sans text-[13.5px] font-bold text-teal"
        >
          See all thoughts
          <span className="transition-transform duration-300 group-hover:translate-x-1">
            &rarr;
          </span>
        </a>
      </div>
    </section>
  );
}
