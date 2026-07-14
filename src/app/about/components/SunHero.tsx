"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "../../components/useMagnetic";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { target: 55 as number | null, display: "", label: "Episodes" },
  { target: null, display: "Weekly", label: "New drops" },
  { target: 9 as number | null, display: "", label: "Podcasts" },
];

export default function SunHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const photoRef = useRef<HTMLDivElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const cta1Ref = useRef<HTMLAnchorElement | null>(null);
  const cta2Ref = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(cta1Ref, 0.2);
  useMagnetic(cta2Ref, 0.2);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".sh-reveal", ".sh-stat"], { clearProps: "all", opacity: 1, y: 0, scale: 1 });
        gsap.set(ringRef.current, { clearProps: "all", opacity: 1, scale: 1, rotate: 0 });
        gsap.set(photoRef.current, { clearProps: "all", opacity: 1, scale: 1 });
        gsap.utils.toArray<HTMLElement>(".sh-stat-num").forEach((el) => {
          el.textContent = el.dataset.target ?? el.textContent;
        });
        return;
      }

      gsap.set(".sh-reveal", { y: 24, opacity: 0, filter: "blur(6px)" });
      gsap.set(ringRef.current, { opacity: 0, scale: 0.85 });
      gsap.set(photoRef.current, { opacity: 0, scale: 0.9 });
      gsap.set(".sh-stat", { y: 16, opacity: 0 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(".sh-reveal", {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 0.8,
        stagger: 0.12,
        ease: "power3.out",
      })
        .to(ringRef.current, { opacity: 1, scale: 1, duration: 1.2, ease: "power2.out" }, "-=0.6")
        .to(photoRef.current, { opacity: 1, scale: 1, duration: 1.1, ease: "power3.out" }, "-=1")
        .to(".sh-stat", { y: 0, opacity: 1, duration: 0.6, stagger: 0.1, ease: "power3.out" }, "-=0.5")
        .add(() => {
          gsap.utils.toArray<HTMLElement>(".sh-stat-num").forEach((el) => {
            const target = Number(el.dataset.target);
            const counter = { val: 0 };
            gsap.to(counter, {
              val: target,
              duration: 1.2,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(counter.val).toString();
              },
            });
          });
        }, "-=0.4");

      // Ring drifts in a slow, continuous rotation — the "brush circle" never
      // sits perfectly still.
      gsap.to(ringRef.current, { rotate: 360, duration: 70, repeat: -1, ease: "none" });

      // Calm, editorial depth parallax as the hero scrolls by: background
      // dots drift slowest, the portrait a little faster, the text column
      // faster still — a gentler read than a hard pin, matching the page's
      // "calm but bright" brief instead of the poster page's punchier pins.
      const mm = gsap.matchMedia();
      mm.add("(min-width: 768px)", () => {
        const depthTl = gsap.timeline({ defaults: { ease: "none" } });
        depthTl
          .to(dotsRef.current, { yPercent: 30, duration: 1 }, 0)
          .to(photoRef.current, { yPercent: -10, scale: 1.04, duration: 1 }, 0)
          .to(ringRef.current, { yPercent: -6, scale: 1.08, duration: 1 }, 0)
          .to(textColRef.current, { yPercent: -18, duration: 1 }, 0);

        const st = ScrollTrigger.create({
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
          animation: depthTl,
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
      className="relative overflow-hidden bg-white px-(--space-section-x) pb-4 pt-16 text-center sm:pt-20"
    >
      <div
        ref={dotsRef}
        aria-hidden
        className="pointer-events-none absolute left-[8%] top-24 hidden h-20 w-20 opacity-60 [background-image:radial-gradient(rgba(24,22,18,0.28)_2px,transparent_2.2px)] [background-size:14px_14px] will-change-transform sm:block"
      />

      <div ref={textColRef} className="will-change-transform">
        <span className="sh-reveal font-script mb-2 block text-(length:--text-script-md) text-mango">
          honest conversations,
        </span>
        <h1 className="sh-reveal mx-auto mb-5 max-w-4xl">at the turning points of life.</h1>
        <p className="sh-reveal mx-auto mb-8 max-w-xl text-ink/66">
          Leaders, entrepreneurs and changemakers share the hard-won lessons worth carrying long
          after the episode ends.
        </p>

        <div className="sh-reveal mb-13 flex flex-wrap justify-center gap-3">
          <a
            ref={cta1Ref}
            href="#"
            className="magnetic-btn inline-flex items-center gap-2 rounded-full bg-ink px-6.5 py-3.5 font-sans text-sm font-bold text-white"
          >
            <svg viewBox="0 0 16 16" className="h-3.5 w-3.5 fill-current" aria-hidden>
              <path d="M4 2.5v11l10-5.5-10-5.5z" />
            </svg>
            Subscribe on YouTube
          </a>
          <a
            ref={cta2Ref}
            href="#work-with-me"
            className="magnetic-btn rounded-full border-[1.5px] border-ink/25 px-6.5 py-3.5 font-sans text-sm font-bold text-ink transition-colors hover:bg-ink/5"
          >
            Collaborate with me
          </a>
        </div>
      </div>

      <div className="relative mx-auto flex w-full max-w-95 justify-center">
        <div
          ref={ringRef}
          aria-hidden
          className="absolute -top-1.5 h-[430px] w-[430px] max-w-[112%] rounded-full will-change-transform"
          style={{ background: "radial-gradient(circle, var(--color-mango-light), var(--color-mango))" }}
        />
        <div
          ref={photoRef}
          className="relative aspect-square w-95 max-w-full overflow-hidden rounded-full border-8 border-white shadow-[0_24px_50px_-22px_rgba(24,22,18,0.4)] will-change-transform"
        >
          <Image
            src="/images/vrushali-hero.jpeg"
            alt="Vrushali"
            fill
            className="object-cover"
            sizes="380px"
          />
        </div>
      </div>

      <div className="mt-11 flex flex-wrap justify-center gap-13.5 pb-9">
        {STATS.map((s) => (
          <div key={s.label} className="sh-stat">
            <div className="font-serif text-4xl text-mango">
              {s.target !== null ? (
                <span className="sh-stat-num" data-target={s.target}>
                  0
                </span>
              ) : (
                s.display
              )}
            </div>
            <div className="mt-1.5 font-sans text-xs font-semibold tracking-[0.08em] text-ink/50 uppercase">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
