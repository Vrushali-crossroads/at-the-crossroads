"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "./useMagnetic";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const GUESTS = [
  { name: "Ravi Pratap", tag: "Leadership" },
  { name: "Vikash Bafna", tag: "Animal Rescue" },
  { name: "Chef Raj Sethia", tag: "Culinary" },
  { name: "DJ Truth", tag: "Music" },
  { name: "A Ranji Player", tag: "Sport" },
  { name: "An Ethical Hacker", tag: "Tech" },
  { name: "A Filmmaker", tag: "Cinema" },
];

type Stat = {
  target: number | null;
  display: string;
  color: string;
  label: string;
};

const STATS: Stat[] = [
  { target: 55, display: "", color: "text-[#ffc21f]", label: "episodes & counting" },
  { target: 9, display: "", color: "text-mango-light", label: "long-form podcasts" },
  { target: null, display: "Weekly", color: "text-mango", label: "new conversations" },
  { target: null, display: "India", color: "text-cream", label: "& growing globally" },
];

export default function PastGuests() {
  const rootRef = useRef<HTMLElement | null>(null);
  const workCardRef = useRef<HTMLDivElement | null>(null);
  const contactRef = useRef<HTMLDivElement | null>(null);
  const underlineRef = useRef<SVGPathElement | null>(null);
  const mediaKitRef = useRef<HTMLAnchorElement | null>(null);
  const collabRef = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(mediaKitRef, 0.2);
  useMagnetic(collabRef, 0.2);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set(
          [
            ".pg-header .reveal-fade",
            ".pg-pill",
            workCardRef.current,
            ".wm-reveal",
            ".ct-reveal",
          ],
          { clearProps: "all", opacity: 1, x: 0, y: 0, rotateX: 0, filter: "none" }
        );
        gsap.set(underlineRef.current, { attr: { "stroke-dashoffset": 0 } });
        gsap.utils.toArray<HTMLElement>(".wm-stat-num").forEach((el) => {
          el.textContent = el.dataset.target ?? el.textContent;
        });
        return;
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 82%",
          toggleActions: "play none none none",
        },
      });

      tl.to(".pg-header .reveal-fade", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
      }).to(
        ".pg-pill",
        {
          x: 0,
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
        },
        "-=0.35"
      );

      const workTl = gsap.timeline({
        scrollTrigger: {
          trigger: workCardRef.current,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      workTl
        .fromTo(
          workCardRef.current,
          { autoAlpha: 0, y: 60, rotateX: 6 },
          {
            autoAlpha: 1,
            y: 0,
            rotateX: 0,
            duration: 1,
            ease: "power3.out",
            transformPerspective: 900,
          }
        )
        .to(
          ".wm-reveal",
          { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.6, stagger: 0.1, ease: "power3.out" },
          "-=0.6"
        )
        .add(() => {
          gsap.utils.toArray<HTMLElement>(".wm-stat-num").forEach((el) => {
            const target = Number(el.dataset.target);
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 1.5,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(counter.val).toString();
              },
            });
          });
        }, "-=0.5");

      gsap
        .timeline({
          scrollTrigger: {
            trigger: contactRef.current,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        })
        .to(".ct-reveal", {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          duration: 0.7,
          stagger: 0.12,
          ease: "power3.out",
        })
        .to(
          underlineRef.current,
          { attr: { "stroke-dashoffset": 0 }, duration: 0.9, ease: "power2.inOut" },
          "-=0.3"
        );
    },
    { scope: rootRef }
  );

  return (
    <section
      ref={rootRef}
      className="bg-cream px-(--space-section-x) py-(--space-section-y)"
    >
      <div className="pg-header">
        <div className="reveal-fade eyebrow mb-3.5">PAST GUESTS</div>
        <h2 className="reveal-fade mb-6.5">
          The people who&apos;ve sat across the table
        </h2>
      </div>

      <div className="flex flex-wrap gap-2.5">
        {GUESTS.map((guest, i) => (
          <span
            key={guest.name}
            className="pg-pill rounded-full border border-ink/12 bg-white px-[18px] py-2.5 font-sans text-sm font-semibold text-ink opacity-0"
            style={{
              transform: `translate(${i % 2 === 0 ? -40 : 40}px, 12px)`,
            }}
          >
            {guest.name} <span className="text-ink/45">&middot; {guest.tag}</span>
          </span>
        ))}
        <span
          className="pg-pill rounded-full bg-teal px-[18px] py-2.5 font-sans text-sm font-semibold text-white opacity-0"
          style={{
            transform: `translate(${GUESTS.length % 2 === 0 ? -40 : 40}px, 12px)`,
          }}
        >
          + 48 more conversations
        </span>
      </div>

      {/* WORK WITH ME */}
      <div
        ref={workCardRef}
        id="collaborate"
        className="mt-(--space-hero-gap) grid grid-cols-1 gap-9 rounded-[22px] bg-ink p-9 text-cream opacity-0 sm:p-11 md:grid-cols-[1.1fr_0.9fr] md:gap-12 md:p-14"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div>
          <div className="wm-reveal reveal-fade eyebrow mb-3.5">WORK WITH ME</div>
          <h2 className="wm-reveal reveal-fade mb-4 text-cream text-(length:--text-h3)">
            Speaking, training &amp; brand partnerships
          </h2>
          <p className="wm-reveal reveal-fade mb-7 max-w-[430px] text-cream/72">
            Bring the crossroads conversation to your stage, team or campaign —
            keynotes, workshops, and sponsored episodes.
          </p>
          <div className="wm-reveal reveal-fade flex flex-wrap gap-3">
            <a
              ref={mediaKitRef}
              href="#"
              className="magnetic-btn rounded-full bg-mango px-6 py-3.5 font-sans text-sm font-extrabold text-ink"
            >
              Download media kit
            </a>
            <a
              ref={collabRef}
              href="#"
              className="magnetic-btn rounded-full border-[1.5px] border-cream/40 px-6 py-3.5 font-sans text-sm font-bold text-cream transition-colors hover:bg-cream/10"
            >
              Enquire about collab
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 content-center gap-5">
          {STATS.map((stat) => (
            <div key={stat.label} className="wm-reveal reveal-fade">
              <div className={`text-(length:--text-h3) ${stat.color}`}>
                {stat.target !== null ? (
                  <span className="wm-stat-num" data-target={stat.target}>
                    0
                  </span>
                ) : (
                  stat.display
                )}
              </div>
              <div className="mt-1.5 font-sans text-[13px] leading-tight text-cream/60">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CONTACT */}
      <div ref={contactRef} className="mt-(--space-hero-gap) text-center">
        <div className="ct-reveal reveal-fade eyebrow mb-4">GET IN TOUCH</div>
        <h2 className="ct-reveal reveal-fade mx-auto mb-4.5 max-w-xl text-ink/72 text-(length:--text-h3)">
          For guest pitches, partnerships &amp; speaking enquiries
        </h2>
        <a
          href="mailto:hello@atcrossroads.in"
          className="ct-reveal reveal-fade relative inline-block text-(length:--text-contact-link) text-teal"
        >
          hello@atcrossroads.in
          <svg
            className="pointer-events-none absolute -bottom-1 left-0 w-full"
            viewBox="0 0 200 8"
            preserveAspectRatio="none"
            aria-hidden
          >
            <path
              ref={underlineRef}
              d="M2 4 L198 4"
              fill="none"
              stroke="var(--color-teal)"
              strokeOpacity="0.32"
              strokeWidth="3"
              pathLength={1}
              strokeDasharray={1}
              strokeDashoffset={1}
            />
          </svg>
        </a>
      </div>
    </section>
  );
}
