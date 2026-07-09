"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "./useMagnetic";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function AboutHost() {
  const rootRef = useRef<HTMLElement | null>(null);
  const subscribeBtnRef = useRef<HTMLButtonElement | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useMagnetic(subscribeBtnRef, 0.25);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".ah-photo", ".ah-badge", ".ah-reveal", ".ah-community"], {
          clearProps: "all",
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          filter: "none",
        });
        gsap.set(".ah-photo-wrap", { clipPath: "inset(0 0 0 0%)" });
        gsap.set(".ah-badge", { rotate: -3 });
        return;
      }

      gsap.set(".ah-photo-wrap", { clipPath: "inset(0 0 0 100%)" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });

      tl.to(".ah-photo-wrap", {
        clipPath: "inset(0 0 0 0%)",
        duration: 1.1,
        ease: "power4.out",
      })
        .to(
          ".ah-photo",
          {
            scale: 1.05,
            opacity: 1,
            filter: "blur(0px) grayscale(0%) saturate(1)",
            duration: 1.4,
            ease: "power2.out",
          },
          "<"
        )
        .to(
          ".ah-badge",
          {
            x: 0,
            rotate: -3,
            opacity: 1,
            duration: 0.7,
            ease: "back.out(2.2)",
          },
          "-=0.9"
        )
        .to(
          ".ah-reveal",
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.7,
            stagger: 0.12,
            ease: "power3.out",
          },
          "-=1.1"
        )
        .to(
          ".ah-community",
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.7)",
          },
          "-=0.3"
        );
    },
    { scope: rootRef }
  );

  const handlePhotoEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion()) return;
    const photo = e.currentTarget.querySelector<HTMLElement>(".ah-photo");
    if (photo) gsap.to(photo, { scale: 1.1, duration: 0.6, ease: "power2.out" });
  };

  const handlePhotoLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    const photo = e.currentTarget.querySelector<HTMLElement>(".ah-photo");
    if (photo) gsap.to(photo, { scale: 1.05, duration: 0.6, ease: "power2.out" });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section
      ref={rootRef}
      id="about"
      className="bg-cream px-(--space-section-x) py-(--space-section-y)"
    >
      <div className="grid grid-cols-1 items-center gap-(--space-hero-gap) md:grid-cols-[0.82fr_1.18fr]">
        <div className="relative mx-auto w-full max-w-md">
          <div
            className="ah-photo-wrap hover-elevate relative aspect-square w-full overflow-hidden rounded-2xl"
            style={{ clipPath: "inset(0 0 0 100%)" }}
            onMouseEnter={handlePhotoEnter}
            onMouseLeave={handlePhotoLeave}
          >
            <Image
              src="/images/vrushali-hero.jpeg"
              alt="Vrushali, host of At The Crossroads"
              fill
              className="ah-photo object-cover"
              style={{
                transform: "scale(1.15)",
                opacity: 0,
                filter: "blur(6px) grayscale(100%) saturate(0.4)",
              }}
              sizes="(min-width: 768px) 40vw, 80vw"
            />
          </div>
          <div
            className="ah-badge absolute -left-3.5 bottom-4 rounded-[11px] bg-mango px-[15px] py-2.5 font-sans text-[13px] font-bold text-ink opacity-0 sm:-left-4"
            style={{ transform: "translateX(-30px) rotate(0deg)" }}
          >
            Your host
          </div>
        </div>

        <div>
          <span className="ah-reveal reveal-fade font-script block text-(length:--text-script-lg)">
            Hi, I&apos;m
          </span>
          <h2 className="ah-reveal reveal-fade mt-1 mb-5">Vrushali</h2>
          <p className="ah-reveal reveal-fade mb-4 text-ink/74">
            Think about the one conversation that changed how you see things. For
            me, that happens almost every episode. That&apos;s what this podcast is
            built around — the crossroads where paths meet.
          </p>
          <p className="ah-reveal reveal-fade text-ink/74">
            Every guest leaves me with a lesson I can apply to my own life and
            work. My hope is that you walk away with the same — a piece of wisdom
            that stays useful long after the episode ends.
          </p>
        </div>
      </div>

      <div
        className="ah-community mt-(--space-hero-gap) grid grid-cols-1 items-center gap-8 rounded-[22px] p-9 opacity-0 sm:p-11 md:grid-cols-[1fr_0.9fr] md:gap-10 md:p-13"
        style={{
          background: "linear-gradient(120deg, var(--color-mango), var(--color-mango-light))",
          color: "var(--color-ink)",
          transform: "scale(0.94)",
        }}
      >
        <div>
          <h2 className="mb-2.5 text-(length:--text-h3)">The Crossroad Note</h2>
          <p className="text-ink/82 text-[16.5px] leading-snug font-medium">
            One lesson from the week&apos;s conversation, in your inbox every
            Sunday. No noise — just the line worth keeping.
          </p>
        </div>

        {submitted ? (
          <div className="flex items-center justify-center rounded-full bg-cream px-6 py-4 font-sans text-sm font-bold text-ink sm:justify-start">
            You&apos;re in — see you Sunday.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2.5 rounded-full bg-cream p-1.5 pl-5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent font-sans text-[15px] font-medium text-ink placeholder:text-ink/45 focus:outline-none"
            />
            <button
              ref={subscribeBtnRef}
              type="submit"
              className="magnetic-btn shrink-0 rounded-full bg-ink px-6 py-3.5 font-sans text-sm font-bold text-cream transition-colors hover:bg-teal"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
