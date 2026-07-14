"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type Reason = {
  tag: string;
  tagClass: string;
  title: string;
  blurb: string;
};

const REASONS: Reason[] = [
  {
    tag: "GUEST PITCH",
    tagClass: "bg-[#FFC21F] text-[#161310]",
    title: "Come on the show",
    blurb: "Tell me the turning point you'd talk about, and why it matters to you.",
  },
  {
    tag: "BRAND PARTNERSHIP",
    tagClass: "bg-[#FF7E5F] text-white",
    title: "Sponsor an episode",
    blurb: "Reach a listenership that shows up for honest, unhurried conversation.",
  },
  {
    tag: "SPEAKING",
    tagClass: "bg-[#2B4E55] text-white",
    title: "Bring me to your stage",
    blurb: "Keynotes and panels on leadership, resilience, and the lessons that stick.",
  },
];

// Cards enter from alternating sides — left, center, right — echoing the
// same directional variety used on the "Sun & Ink" about page.
const CARD_X = [-70, 0, 70];

export default function ContactReasons() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".cr-card", { clearProps: "all", opacity: 1, x: 0, y: 0 });
        return;
      }

      gsap.to(".cr-card", {
        x: 0,
        y: 0,
        opacity: 1,
        duration: 1,
        stagger: 0.15,
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6,
        },
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-[#FFF7DA] px-6 py-16 sm:px-11">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        {REASONS.map((r, i) => (
          <div
            key={r.title}
            className="cr-card overflow-hidden rounded-[14px] border-2 border-[#161310] bg-white p-6.5 opacity-0 shadow-[6px_6px_0_#161310] transition-transform duration-300 hover:-translate-y-1"
            style={{ transform: `translate(${CARD_X[i % CARD_X.length]}px, 34px)` }}
          >
            <div
              className={`mb-3.5 inline-block rounded-[5px] px-2.5 py-1 font-archivo text-[11px] font-black tracking-[0.04em] ${r.tagClass}`}
            >
              {r.tag}
            </div>
            <div className="mb-2 font-sans text-lg font-extrabold text-[#161310]">{r.title}</div>
            <p className="font-sans text-[14px] text-[#161310]/62">{r.blurb}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
