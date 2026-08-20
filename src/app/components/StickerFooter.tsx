"use client";

import { useRef } from "react";
import Link from "next/link";
import { Archivo } from "next/font/google";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "./usePrefersReducedMotion";
import { YOUTUBE_CHANNEL_URL, INSTAGRAM_URL } from "@/lib/social";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Loaded here (not just on /episodes and /contact) so this footer's
// "CROSSROADS" wordmark renders correctly on every page that uses it,
// including ones that never otherwise touch the Sticker Studio font.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
});

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="1" y="3" width="14" height="10" rx="3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M6.5 5.5v5l4.5-2.5-4.5-2.5z" fill="currentColor" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" aria-hidden>
      <rect x="1.5" y="1.5" width="13" height="13" rx="4" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
      <circle cx="11.7" cy="4.3" r="0.8" fill="currentColor" />
    </svg>
  );
}

const SOCIALS = [
  { label: "YouTube", href: YOUTUBE_CHANNEL_URL, Icon: YouTubeIcon },
  { label: "Instagram", href: INSTAGRAM_URL, Icon: InstagramIcon },
  // Not live yet — uncomment and give these a real URL (plus an icon above)
  // once the accounts are ready to link.
  // { label: "LinkedIn", href: "#" },
  // { label: "Spotify", href: "#" },
  // { label: "Apple", href: "#" },
];

const EXPLORE_LINKS = [
  { label: "Home", href: "/" },
  { label: "Episodes", href: "/episodes" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const ICON_ROTATION = [-8, 6, -6, 8, -5];

export default function StickerFooter() {
  // The trigger element stays untransformed so ScrollTrigger's own position
  // measurements never drift — only the inner wrapper is animated.
  const rootRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set([".sf-reveal", ".sf-social-link"], { clearProps: "all", opacity: 1, y: 0, rotate: 0 });
        gsap.set(innerRef.current, { clearProps: "all" });
        return;
      }

      gsap.set(innerRef.current, { y: 60 });
      gsap.set(".sf-social-link", { y: 14, opacity: 0, rotate: (i: number) => ICON_ROTATION[i] });
      gsap.set(".sf-spark", { opacity: 0, scale: 0, rotate: -45 });

      // A scrub tied to the footer's own height (instead of a fixed play-once
      // trigger) used to work when the footer was a single thin row, but now
      // that it's a taller multi-column block, that same scroll distance
      // stretches the fade-in out much further — so it plays once, fully,
      // as soon as the footer is mostly in view instead.
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      tl.to(innerRef.current, { y: 0, duration: 0.9, ease: "power3.out" }, 0)
        .to(".sf-reveal", { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: "power3.out" }, 0)
        .to(
          ".sf-social-link",
          {
            y: 0,
            opacity: 1,
            rotate: 0,
            duration: 1,
            stagger: 0.1,
            onComplete: () => gsap.set(".sf-social-link", { clearProps: "transform" }),
          },
          0.1
        )
        .to(
          ".sf-spark",
          { opacity: 1, scale: 1, rotate: 0, duration: 0.8, stagger: 0.2, ease: "back.out(2)" },
          0.2
        );

      // Ambient twinkle — small idle motion so the footer still feels alive
      // once the scroll-in reveal has settled.
      gsap.to(".sf-spark", {
        scale: 1.2,
        opacity: 0.75,
        duration: 2.2,
        repeat: -1,
        yoyo: true,
        stagger: 0.5,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef }
  );

  return (
    <footer
      ref={rootRef}
      className={`${archivo.variable} relative overflow-hidden bg-[#161310] text-[#FFF7DA]`}
    >
      <svg
        className="sf-spark pointer-events-none absolute left-[6%] top-9 w-6 text-mango will-change-transform"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
      </svg>
      <svg
        className="sf-spark pointer-events-none absolute right-[12%] top-14 w-4 text-teal/60 will-change-transform"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
      </svg>
      <svg
        className="sf-spark pointer-events-none absolute left-[45%] bottom-8 w-5 text-[#FFC21F]/50 will-change-transform"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
      >
        <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
      </svg>

      <div ref={innerRef} className="relative px-6 py-10 will-change-transform sm:px-11 sm:py-12">
        <div className="grid grid-cols-1 gap-8 border-b border-white/10 pb-8 sm:grid-cols-[1.2fr_0.8fr_0.8fr]">
          <div className="sf-reveal opacity-0" style={{ transform: "translateY(12px)" }}>
            <div className="flex flex-col leading-[0.82]">
              <span className="ml-0.5 text-base text-[#FFC21F]" style={{ fontFamily: "var(--font-script)" }}>
                at the
              </span>
              <span className="font-archivo text-xl font-black tracking-[0.05em]">CROSSROADS</span>
            </div>
            <p className="mt-3.5 max-w-xs font-sans text-sm text-[#FFF7DA]/55">
              Honest conversations at the turning points of life — new episodes every week.
            </p>
          </div>

          <div className="sf-reveal opacity-0" style={{ transform: "translateY(12px)" }}>
            <div className="mb-3.5 font-archivo text-xs font-black tracking-[0.14em] text-[#FFF7DA]/40 uppercase">
              Explore
            </div>
            <nav className="flex flex-col gap-2.5">
              {EXPLORE_LINKS.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="group relative inline-block w-fit font-sans text-[13.5px] font-semibold text-[#FFF7DA]/80 transition-colors hover:text-[#FFC21F]"
                >
                  {l.label}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#FFC21F] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </nav>
          </div>

          <div className="sf-reveal opacity-0" style={{ transform: "translateY(12px)" }}>
            <div className="mb-3.5 font-archivo text-xs font-black tracking-[0.14em] text-[#FFF7DA]/40 uppercase">
              Connect
            </div>
            <div className="flex flex-col gap-2.5">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="sf-social-link inline-flex w-fit items-center gap-2 font-sans text-[13.5px] font-extrabold text-[#FFF7DA]/80 transition-transform duration-300 hover:-translate-y-1 hover:text-[#FFC21F]"
                >
                  <s.Icon />
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-5">
          <div className="sf-reveal font-sans text-xs font-medium text-[#FFF7DA]/50 opacity-0" style={{ transform: "translateY(12px)" }}>
            © 2026 atcrossroads.in
          </div>
          <div className="sf-reveal font-sans text-xs font-medium text-[#FFF7DA]/40 opacity-0" style={{ transform: "translateY(12px)" }}>
            Made with care, one honest conversation at a time.
          </div>
        </div>
      </div>
    </footer>
  );
}
