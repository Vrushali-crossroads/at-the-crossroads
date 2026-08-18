"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "./useMagnetic";
import { prefersReducedMotion } from "./usePrefersReducedMotion";
import { YOUTUBE_CHANNEL_URL } from "@/lib/social";

gsap.registerPlugin(ScrollTrigger, useGSAP);

type SNLink = { label: string; type: "route"; href: string };

function buildLinks(): SNLink[] {
  return [
    { label: "Episodes", type: "route", href: "/episodes" },
    { label: "About", type: "route", href: "/about" },
    { label: "Collaborate", type: "route", href: "/contact" },
  ];
}

export default function StickerNav() {
  const navRef = useRef<HTMLElement | null>(null);
  const subscribeRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();
  const links = buildLinks();

  useMagnetic(subscribeRef, 0.3);

  // Nav is fixed, so it's removed from document flow — measure its real
  // rendered height (it can wrap to two rows on narrow screens) and expose
  // it as a CSS var so the content below can pad itself to match, instead
  // of guessing a fixed pixel value.
  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty(
        "--sticker-nav-h",
        `${el.getBoundingClientRect().height}px`
      );
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(".sn-reveal", { clearProps: "all", opacity: 1, y: 0 });
      } else {
        gsap.set(".sn-reveal", { y: -16, opacity: 0 });
        gsap.to(".sn-reveal", {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.06,
          ease: "power3.out",
          delay: 0.15,
        });
      }

      ScrollTrigger.create({
        start: "top -60",
        end: 99999,
        toggleClass: { targets: navRef.current, className: "nav-scrolled" },
      });
    },
    { scope: navRef, dependencies: [pathname] }
  );

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-(--space-section-x) py-5 transition-[padding,box-shadow,background-color,backdrop-filter] duration-300 [&.nav-scrolled]:bg-cream/85 [&.nav-scrolled]:py-3.5 [&.nav-scrolled]:shadow-[0_8px_30px_-18px_rgba(26,23,20,0.4)] [&.nav-scrolled]:backdrop-blur-md"
    >
      <Link href="/" className="sn-reveal flex flex-col leading-[0.85]">
        <span className="font-script ml-0.5 text-[17px]">at the</span>
        <span className="font-serif text-[17px] font-semibold tracking-[0.34em] text-ink">
          CROSSROADS
        </span>
      </Link>

      <div className="hidden items-center gap-7 font-sans text-[13.5px] font-semibold text-ink/72 md:flex">
        {links.map((link) => {
          const active = pathname === link.href;
          const className = `sn-reveal group relative py-1 transition-colors duration-300 ${
            active ? "text-ink" : "text-ink/72 hover:text-ink"
          }`;
          const underline = (
            <span
              className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left bg-mango transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          );

          return (
            <Link key={link.href} href={link.href} className={className}>
              {link.label}
              {underline}
            </Link>
          );
        })}
        <a
          ref={subscribeRef}
          href={YOUTUBE_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="sn-reveal magnetic-btn rounded-full bg-ink px-[18px] py-[11px] font-sans text-[13.5px] font-bold text-cream transition-colors hover:bg-teal"
        >
          Subscribe
        </a>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        className="sn-reveal relative z-10 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
      >
        <span className="h-[1.5px] w-6 bg-ink" />
        <span className="h-[1.5px] w-6 bg-ink" />
        <span className="h-[1.5px] w-6 bg-ink" />
      </button>
    </nav>
  );
}
