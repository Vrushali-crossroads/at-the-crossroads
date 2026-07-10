"use client";

import { useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "./useMagnetic";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

function AnimatedWords({ text, className = "" }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.1em] -mb-[0.1em]">
          <span className={`hero-word inline-block origin-bottom-left ${className}`}>
            {word}
            {i < words.length - 1 ? " " : ""}
          </span>
        </span>
      ))}
    </>
  );
}

const TAPE_ITEMS = ["LEADERSHIP", "RESILIENCE", "ENTREPRENEURSHIP", "CHANGEMAKERS"];

function TapeMarquee() {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      tweenRef.current = gsap.to(trackRef.current, {
        xPercent: -50,
        duration: 22,
        ease: "none",
        repeat: -1,
        paused: true,
      });

      gsap.fromTo(
        wrapRef.current,
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.1,
          ease: "power4.inOut",
          onComplete: () => tweenRef.current?.play(),
          scrollTrigger: {
            trigger: wrapRef.current,
            start: "top 92%",
            toggleActions: "play none none none",
          },
        }
      );

      gsap.fromTo(
        trackRef.current,
        { skewX: -8 },
        { skewX: 0, duration: 1.1, ease: "power4.inOut" }
      );
    },
    { scope: wrapRef }
  );

  return (
    <div
      ref={wrapRef}
      className="overflow-hidden bg-teal py-3.5"
      style={{ clipPath: "inset(0 100% 0 0)" }}
      onMouseEnter={() => tweenRef.current?.pause()}
      onMouseLeave={() => tweenRef.current?.play()}
    >
      <div ref={trackRef} className="flex w-max whitespace-nowrap">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex items-center" aria-hidden={copy === 1}>
            {TAPE_ITEMS.map((item) => (
              <span key={item} className="flex items-center">
                <span className="px-6 font-sans text-sm font-semibold tracking-[0.14em] text-cream">
                  {item}
                </span>
                <span className="px-6 text-mango">&#10022;</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Hero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const textColRef = useRef<HTMLDivElement | null>(null);
  const photoColRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<SVGSVGElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const cardInnerRef = useRef<HTMLDivElement | null>(null);
  const badgeRef = useRef<HTMLDivElement | null>(null);
  const underlineRef = useRef<SVGPathElement | null>(null);
  const cta1Ref = useRef<HTMLAnchorElement | null>(null);
  const cta2Ref = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(cta1Ref, 0.2);
  useMagnetic(cta2Ref, 0.2);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        // Skip motion entirely: reveal everything in its resting state.
        gsap.set(
          [
            ".hero-word",
            ".hero-fade",
            ".hero-eyebrow-line",
            underlineRef.current,
            cardRef.current,
            ringRef.current,
            badgeRef.current,
            ".hero-spark",
          ],
          { clearProps: "all", opacity: 1, scale: 1, x: 0, y: 0, rotate: 0, rotateX: 0, rotateY: 0, filter: "none" }
        );
        gsap.set(".hero-eyebrow-line", { scaleX: 1 });
        gsap.set(underlineRef.current, { attr: { "stroke-dashoffset": 0 } });
        return;
      }

      // 1. Setup Initial States
      gsap.set(".hero-word", { y: "110%", rotate: 5, filter: "blur(6px)" });
      gsap.set(".hero-fade", { y: 30, opacity: 0, filter: "blur(6px)" });
      gsap.set(underlineRef.current, { attr: { "stroke-dashoffset": 1, "stroke-dasharray": 1 } });
      gsap.set(cardRef.current, { opacity: 0, scale: 0.9, rotateY: 15, rotateX: -10 });
      gsap.set(ringRef.current, { opacity: 0, scale: 0.8, rotate: -45 });
      gsap.set(badgeRef.current, { opacity: 0, scale: 0.5, x: 20 });
      gsap.set(".hero-spark", { opacity: 0, scale: 0, rotate: -45 });

      const tl = gsap.timeline({ delay: 0.3 });

      // 2. Entrance Sequence
      tl.to(".hero-eyebrow-line", { scaleX: 1, duration: 0.8, ease: "expo.out" })
        .to(".hero-fade.hero-eyebrow", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 }, "<0.1")
        .to(".hero-word", {
            y: "0%",
            rotate: 0,
            filter: "blur(0px)",
            duration: 1.2,
            stagger: 0.03,
            ease: "expo.out"
        }, "-=0.6")
        .to(underlineRef.current, {
            attr: { "stroke-dashoffset": 0 },
            duration: 1.1,
            ease: "sine.inOut"
        }, "-=0.35")
        .to(".hero-fade.hero-copy", { y: 0, opacity: 1, filter: "blur(0px)", duration: 0.8 }, "-=0.7")
        .to(".hero-fade.hero-cta", {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            stagger: 0.1,
            ease: "back.out(1.7)"
        }, "-=0.6")
        .to(cardRef.current, { 
            opacity: 1, 
            scale: 1, 
            rotateY: 0, 
            rotateX: 0, 
            rotate: -1.5, 
            duration: 1.4, 
            ease: "expo.out" 
        }, "-=1.2")
        .to(ringRef.current, { opacity: 1, scale: 1, rotate: 0, duration: 1.5, ease: "power2.out" }, "-=1.2")
        .to(badgeRef.current, { 
            opacity: 1, 
            scale: 1, 
            x: 0, 
            duration: 1, 
            ease: "elastic.out(1, 0.75)" 
        }, "-=0.8")
        .to(".hero-spark", { 
            opacity: 1, 
            scale: 1, 
            rotate: 0, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "back.out(2)" 
        }, "-=0.8");

      // 3. Ambient Idle Animations (Floating)
      gsap.to(ringRef.current, { rotate: 360, duration: 60, repeat: -1, ease: "none" });
      
      // Advanced Floating for Badge
      gsap.to(badgeRef.current, {
        y: -10,
        x: 5,
        rotate: 1,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      // Sparks "twinkle"
      gsap.to(".hero-spark", {
        scale: 1.2,
        opacity: 0.8,
        duration: 2,
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        ease: "sine.inOut"
      });

      // 4. Scroll Parallax
      ScrollTrigger.create({
        trigger: rootRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.timeline()
            .to(textColRef.current, { y: 100, ease: "none" }, 0)
            .to(photoColRef.current, { y: -50, ease: "none" }, 0)
            .to(badgeRef.current, { y: -120, ease: "none" }, 0)
            .to(ringRef.current, { scale: 1.2, rotate: 45, ease: "none" }, 0)
      });
    },
    { scope: rootRef }
  );

  const handleCardMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    const inner = cardInnerRef.current;
    if (!el || !inner || prefersReducedMotion()) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const px = (x / rect.width) - 0.5;
    const py = (y / rect.height) - 0.5;

    // Tilt the card
    gsap.to(el, {
      rotateY: px * 15,
      rotateX: -py * 15,
      duration: 0.4,
      ease: "power2.out",
    });

    // Parallax the image inside (moves slightly opposite to the tilt)
    gsap.to(inner, {
      x: -px * 20,
      y: -py * 20,
      scale: 1.05,
      duration: 0.4,
      ease: "power2.out",
    });
  };

  const handleCardLeave = () => {
    gsap.to([cardRef.current, cardInnerRef.current], {
      rotateY: 0,
      rotateX: 0,
      rotate: (_i, target) => (target === cardRef.current ? -1.5 : 0),
      x: 0,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "elastic.out(1, 0.4)",
    });
  };

  return (
    <>
    <section
      ref={rootRef}
      className="relative overflow-hidden bg-cream px-(--space-section-x) pb-24 pt-10 md:pt-20"
      style={{
        backgroundImage: "radial-gradient(circle at 80% 20%, rgba(235,166,58,0.15), transparent 50%)",
      }}
    >
      {/* Decorative Sparks */}
      <svg className="hero-spark absolute left-[8%] top-[20%] w-8 text-mango" viewBox="0 0 24 24" fill="none">
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
      </svg>
      <svg className="hero-spark absolute bottom-[15%] left-[5%] w-5 text-teal/40" viewBox="0 0 24 24" fill="none">
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
      </svg>

      <div className="grid items-center gap-(--space-hero-gap) md:grid-cols-[1.1fr_0.9fr]">
        
        {/* Text Content */}
        <div ref={textColRef} className="z-10">
          <div className="hero-fade hero-eyebrow eyebrow mb-6 inline-flex items-center gap-3 text-[13px] font-bold tracking-widest text-teal">
            <span className="hero-eyebrow-line h-[2px] w-8 origin-left scale-x-0 bg-teal" />
            THE PODCAST &middot; 55 EPISODES
          </div>

          <h1 className="mb-8 text-(length:--text-h1) font-extrabold leading-[1.1] tracking-tight">
            <AnimatedWords text="Honest conversations at the" />{" "}
            <span className="relative inline-block">
              <AnimatedWords text="turning points" className="italic text-mango" />
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 14" preserveAspectRatio="none">
                <path
                  ref={underlineRef}
                  d="M2 10 C 40 2, 160 2, 198 10"
                  fill="none"
                  stroke="var(--color-mango)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  pathLength={1}
                  strokeDasharray={1}
                  strokeDashoffset={1}
                />
              </svg>
            </span>{" "}
            <AnimatedWords text="of life." />
          </h1>

          <p className="hero-fade hero-copy mb-10 max-w-md text-lg leading-relaxed text-ink/70">
            Candid talks with leaders and changemakers about the hard-won lessons worth carrying forward.
          </p>

          <div className="flex flex-wrap gap-4">
            <a ref={cta1Ref} href="#" className="hero-fade hero-cta magnetic-btn group relative overflow-hidden rounded-full bg-mango px-8 py-4 font-bold text-ink shadow-lg">
                <span className="relative z-10 flex items-center gap-2">
                    <svg viewBox="0 0 16 16" className="h-4 w-4 fill-current"><path d="M4 2.5v11l10-5.5-10-5.5z" /></svg>
                    Subscribe on YouTube
                </span>
            </a>
            <a ref={cta2Ref} href="#" className="hero-fade hero-cta magnetic-btn rounded-full border-2 border-teal px-8 py-4 font-bold text-teal transition-colors hover:bg-teal hover:text-cream">
              Collaborate &rarr;
            </a>
          </div>
        </div>

        {/* Interactive Photo Area */}
        <div ref={photoColRef} className="relative mx-auto flex w-full max-w-95 justify-center perspective-1000">
          {/* Rotating Dashed Ring */}
          <svg
            ref={ringRef}
            className="absolute h-[110%] w-[110%] opacity-40"
            viewBox="0 0 200 200"
            style={{ opacity: 0, transform: "scale(0.8) rotate(-45deg)" }}
          >
            <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="8 12" className="text-teal" />
          </svg>

          {/* 3D Card */}
          <div
            ref={cardRef}
            onMouseMove={handleCardMove}
            onMouseLeave={handleCardLeave}
            className="relative z-10 w-full max-w-95 cursor-pointer rounded-3xl bg-white p-4 pb-8 shadow-2xl transition-shadow hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)]"
            style={{
              transformStyle: "preserve-3d",
              opacity: 0,
              transform: "scale(0.9) rotateY(15deg) rotateX(-10deg)",
            }}
          >
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-gray-100">
              <div ref={cardInnerRef} className="relative h-full w-full scale-110">
                <Image
                  src="/images/vrushali-hero.jpeg"
                  alt="Vrushali"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
            </div>
            <div className="mt-6 text-center text-3xl font-serif italic text-teal">
              with Vrushali
            </div>

            {/* Floating Badge */}
            <div
                ref={badgeRef}
                className="absolute -right-2 -bottom-2 z-20 rounded-2xl bg-ink px-6 py-4 shadow-xl sm:-right-6 sm:-bottom-4"
                style={{ opacity: 0, transform: "scale(0.5) translateX(20px)" }}
            >
                <div className="text-[10px] uppercase tracking-[0.2em] text-mango/60 font-bold">New Episode</div>
                <div className="text-sm font-black text-white">EP 09 &middot; OUT NOW</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <TapeMarquee />
    </>
  );
}