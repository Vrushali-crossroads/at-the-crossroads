"use client";

import { useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "./useMagnetic";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother, useGSAP);

type NavLink =
  | { label: string; type: "route"; href: string }
  | { label: string; type: "anchor"; id: string };

const LINKS: NavLink[] = [
  { label: "Episodes", type: "route", href: "/episodes" },
  // { label: "Thoughts", type: "anchor", id: "thoughts" },
  { label: "About", type: "route", href: "/about" },
  { label: "Collaborate", type: "route", href: "/contact" },
];

export function scrollToSection(id: string, navHeight: number) {
  const target = document.getElementById(id);
  if (!target) return;
  const smoother = ScrollSmoother.get();
  if (smoother && !prefersReducedMotion()) {
    smoother.scrollTo(target, true, `top top+=${navHeight}`);
  } else {
    const y = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

export default function Navbar() {
  const navRef = useRef<HTMLElement | null>(null);
  const subscribeRef = useRef<HTMLButtonElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);
  const pathname = usePathname();
  const isHome = pathname === "/";

  useMagnetic(subscribeRef, 0.3);

  const handleNavClick = (id: string) => (e: React.MouseEvent) => {
    if (!isHome) return; // let the browser navigate to /#id instead
    e.preventDefault();
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;
    scrollToSection(id, navHeight);
    setIsOpen(false);
  };

  // Landing on the home page with a #section hash (e.g. navigated in from
  // another page) — scroll to it once ScrollSmoother has finished mounting.
  useLayoutEffect(() => {
    if (!isHome || typeof window === "undefined" || !window.location.hash) return;
    const id = window.location.hash.slice(1);
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;
    const raf = requestAnimationFrame(() => {
      setTimeout(() => scrollToSection(id, navHeight), 60);
    });
    return () => cancelAnimationFrame(raf);
  }, [isHome]);

  useLayoutEffect(() => {
    const el = navRef.current;
    if (!el) return;
    const update = () => {
      document.documentElement.style.setProperty(
        "--nav-h",
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
        gsap.set(".nav-reveal", { clearProps: "all", opacity: 1, y: 0 });
      } else {
        gsap.set(".nav-reveal", { y: -18, opacity: 0 });

        const tl = gsap.timeline({ delay: 0.15 });

        tl.to(".nav-logo", { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }).to(
          ".nav-link",
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" },
          "-=0.45"
        ).to(
          ".nav-cta",
          { y: 0, opacity: 1, duration: 0.6, ease: "back.out(2)" },
          "-=0.4"
        );
      }

      ScrollTrigger.create({
        start: "top -60",
        end: 99999,
        toggleClass: { targets: navRef.current, className: "nav-scrolled" },
      });

      // Active-section indicator: highlight the nav link for whichever
      // section currently occupies the middle of the viewport (home page only —
      // route-type links like "Episodes" are matched against pathname instead).
      LINKS.forEach((link) => {
        if (link.type !== "anchor") return;
        const section = document.getElementById(link.id);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: "top 55%",
          end: "bottom 55%",
          onEnter: () => setActiveId(link.id),
          onEnterBack: () => setActiveId(link.id),
        });
      });
    },
    { scope: navRef }
  );

  useGSAP(
    () => {
      const panel = mobilePanelRef.current;
      if (!panel) return;
      const d = prefersReducedMotion() ? 0 : undefined;

      if (isOpen) {
        gsap.set(panel, { display: "flex" });
        gsap.fromTo(
          panel,
          { autoAlpha: 0, y: -12 },
          { autoAlpha: 1, y: 0, duration: d ?? 0.35, ease: "power2.out" }
        );
        gsap.fromTo(
          panel.querySelectorAll(".mobile-link"),
          { y: -8, opacity: 0 },
          { y: 0, opacity: 1, duration: d ?? 0.4, stagger: d === 0 ? 0 : 0.05, delay: d === 0 ? 0 : 0.05, ease: "power2.out" }
        );
      } else {
        gsap.to(panel, {
          autoAlpha: 0,
          y: -12,
          duration: d ?? 0.25,
          ease: "power2.in",
          onComplete: () => gsap.set(panel, { display: "none" }),
        });
      }
    },
    { dependencies: [isOpen], scope: navRef }
  );

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-(--space-section-x) py-5 transition-[padding,box-shadow,background-color,backdrop-filter] duration-300 [&.nav-scrolled]:bg-cream/85 [&.nav-scrolled]:py-3.5 [&.nav-scrolled]:shadow-[0_8px_30px_-18px_rgba(26,23,20,0.4)] [&.nav-scrolled]:backdrop-blur-md"
    >
      <Link href="/" className="nav-reveal nav-logo flex flex-col leading-[0.85]">
        <span className="font-script ml-0.5 text-[17px]">at the</span>
        <span className="font-serif text-[17px] font-semibold tracking-[0.34em] text-ink">
          CROSSROADS
        </span>
      </Link>

      <div className="hidden items-center gap-7 font-sans text-[13.5px] font-semibold text-ink/72 md:flex">
        {LINKS.map((link) => {
          const active = link.type === "route" ? pathname === link.href : isHome && activeId === link.id;
          const className = `nav-reveal nav-link group relative py-1 transition-colors duration-300 ${
            active ? "text-ink" : ""
          }`;
          const underline = (
            <span
              className={`absolute inset-x-0 -bottom-0.5 h-[1.5px] origin-left bg-mango transition-transform duration-300 ease-out group-hover:scale-x-100 ${
                active ? "scale-x-100" : "scale-x-0"
              }`}
            />
          );
          if (link.type === "route") {
            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
                {underline}
              </Link>
            );
          }
          return (
            <Link
              key={link.id}
              href={isHome ? `#${link.id}` : `/#${link.id}`}
              onClick={handleNavClick(link.id)}
              className={className}
            >
              {link.label}
              {underline}
            </Link>
          );
        })}
        <button
          ref={subscribeRef}
          className="nav-reveal nav-cta magnetic-btn rounded-full bg-ink px-[18px] py-[11px] font-sans text-[13.5px] font-bold text-cream transition-colors hover:bg-teal"
        >
          Subscribe
        </button>
      </div>

      <button
        type="button"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((v) => !v)}
        className="nav-reveal nav-cta relative z-10 flex h-9 w-9 flex-col items-center justify-center gap-[5px] md:hidden"
      >
        <span
          className={`h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
            isOpen ? "translate-y-[6.5px] rotate-45" : ""
          }`}
        />
        <span
          className={`h-[1.5px] w-6 bg-ink transition-opacity duration-300 ${
            isOpen ? "opacity-0" : "opacity-100"
          }`}
        />
        <span
          className={`h-[1.5px] w-6 bg-ink transition-transform duration-300 ${
            isOpen ? "-translate-y-[6.5px] -rotate-45" : ""
          }`}
        />
      </button>

      <div
        ref={mobilePanelRef}
        className="absolute left-0 right-0 top-full hidden flex-col gap-1 border-t border-ink/10 bg-cream px-(--space-section-x) py-5 shadow-[0_20px_30px_-20px_rgba(26,23,20,0.35)] md:hidden"
        style={{ visibility: "hidden" }}
      >
        {LINKS.map((link) => {
          const active = link.type === "route" ? pathname === link.href : isHome && activeId === link.id;
          const className = `mobile-link py-2.5 font-sans text-[15px] font-semibold ${
            active ? "text-ink" : "text-ink/80"
          }`;
          if (link.type === "route") {
            return (
              <Link key={link.href} href={link.href} onClick={() => setIsOpen(false)} className={className}>
                {link.label}
              </Link>
            );
          }
          return (
            <Link
              key={link.id}
              href={isHome ? `#${link.id}` : `/#${link.id}`}
              onClick={handleNavClick(link.id)}
              className={className}
            >
              {link.label}
            </Link>
          );
        })}
        <button className="mobile-link mt-2 self-start rounded-full bg-ink px-5 py-2.5 font-sans text-[13.5px] font-bold text-cream">
          Subscribe
        </button>
      </div>
    </nav>
  );
}
