"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "../../components/useMagnetic";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GUESTS = [
  "Ravi Pratap",
  "Vikash Bafna",
  "Chef Raj Sethia",
  "DJ Truth",
  "A Ranji Player",
  "An Ethical Hacker",
];

type Stat = { target: number | null; display: string; label: string };

const STATS: Stat[] = [
  { target: 55, display: "", label: "episodes" },
  { target: 9, display: "", label: "long-form podcasts" },
  { target: null, display: "Weekly", label: "new episodes" },
  { target: null, display: "India", label: "growing reach" },
];

export default function SunGuests() {
  const rootRef = useRef<HTMLElement | null>(null);
  const workCardRef = useRef<HTMLDivElement | null>(null);
  const mediaKitRef = useRef<HTMLAnchorElement | null>(null);
  const emailRef = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(mediaKitRef, 0.2);
  useMagnetic(emailRef, 0.2);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".sg-header .reveal-fade", ".sg-pill", ".wm-reveal", ".wm-stat"], {
          clearProps: "all",
          opacity: 1,
          x: 0,
          y: 0,
        });
        gsap.utils.toArray<HTMLElement>(".sg-stat-num").forEach((el) => {
          el.textContent = el.dataset.target ?? el.textContent;
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 88%",
          end: "top 55%",
          scrub: 0.6,
        },
      });

      tl.to(".sg-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1,
        stagger: 0.15,
      }).to(".sg-pill", { x: 0, y: 0, opacity: 1, duration: 0.8, stagger: 0.05 }, 0.25);

      const workTl = gsap.timeline({
        scrollTrigger: {
          trigger: workCardRef.current,
          start: "top 92%",
          end: "top 55%",
          scrub: 0.6,
        },
      });

      // The stats run in their own, tighter group *alongside* the header
      // reveal rather than strictly after it — with 8 elements total,
      // chaining them into one long stagger meant the last stat needed far
      // more scroll distance than the section naturally gets before a
      // reader stops scrolling, leaving it stuck half-faded.
      workTl
        .fromTo(workCardRef.current, { autoAlpha: 0, y: 50 }, { autoAlpha: 1, y: 0, duration: 1 }, 0)
        .to(".wm-reveal", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8, stagger: 0.1 }, 0.2)
        .to(".wm-stat", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.7, stagger: 0.08 }, 0.35);

      // Counts up as it scrolls into view and back down again on the way
      // back up — tied directly to the scrub timeline instead of a one-shot
      // toggle, so it reverses naturally with everything else on the page.
      gsap.utils.toArray<HTMLElement>(".sg-stat-num").forEach((el) => {
        const target = Number(el.dataset.target);
        const counter = { val: 0 };
        workTl.to(
          counter,
          {
            val: target,
            duration: 0.4,
            onUpdate: () => {
              el.textContent = Math.round(counter.val).toString();
            },
          },
          0.4
        );
      });
    },
    { scope: rootRef }
  );

  return (
    <section ref={rootRef} className="bg-white px-(--space-section-x) pb-2 pt-(--space-section-y) text-center">
      <div className="sg-header mx-auto mb-6.5 max-w-2xl">
        <div className="reveal-fade eyebrow mb-3">PAST GUESTS</div>
        <h2 className="reveal-fade">The people who&apos;ve sat across the table</h2>
      </div>

      <div className="mx-auto mb-16 flex max-w-5xl flex-wrap justify-center gap-2.5">
        {GUESTS.map((g, i) => (
          <span
            key={g}
            className="sg-pill rounded-full bg-cream px-4.5 py-2.5 font-sans text-sm font-semibold text-ink opacity-0"
            style={{ transform: `translate(${i % 2 === 0 ? -30 : 30}px, 10px)` }}
          >
            {g}
          </span>
        ))}
        <span
          className="sg-pill rounded-full bg-mango px-4.5 py-2.5 font-sans text-sm font-semibold text-ink opacity-0"
          style={{ transform: `translate(${GUESTS.length % 2 === 0 ? -30 : 30}px, 10px)` }}
        >
          + 48 more
        </span>
      </div>

      <div
        ref={workCardRef}
        id="work-with-me"
        className="mx-auto max-w-5xl opacity-0"
        style={{ transform: "translateY(50px)", padding: "0 0 2rem" }}
      >
        <div className="wm-reveal reveal-fade eyebrow mb-3.5">WORK WITH ME</div>
        <h2 className="wm-reveal reveal-fade mb-3.5">Speaking, training &amp; brand partnerships</h2>
        <p className="wm-reveal reveal-fade mx-auto mb-6.5 max-w-xl text-ink/66">
          Bring the crossroads conversation to your stage, team or campaign — keynotes,
          workshops, and sponsored episodes.
        </p>
        <div className="wm-reveal reveal-fade mb-12 flex flex-wrap justify-center gap-3">
          <a
            ref={mediaKitRef}
            href="#"
            className="magnetic-btn rounded-full bg-mango px-6 py-3.5 font-sans text-sm font-extrabold text-ink"
          >
            Download media kit
          </a>
          <a
            ref={emailRef}
            href="mailto:hello@atcrossroads.in"
            className="magnetic-btn rounded-full border-[1.5px] border-ink/22 px-6 py-3.5 font-sans text-sm font-bold text-ink"
          >
            hello@atcrossroads.in
          </a>
        </div>

        <div className="mx-auto grid max-w-xl grid-cols-2 gap-6 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div key={stat.label} className="wm-stat reveal-fade">
              <div className="font-serif text-3xl text-mango">
                {stat.target !== null ? (
                  <span className="sg-stat-num" data-target={stat.target}>
                    0
                  </span>
                ) : (
                  stat.display
                )}
              </div>
              <div className="mt-1.5 font-sans text-[12px] leading-tight text-ink/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
