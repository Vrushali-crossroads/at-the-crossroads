"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "./useMagnetic";
import { prefersReducedMotion } from "./usePrefersReducedMotion";
import { scrollToSection } from "./Navbar";

type SNLink =
  | { label: string; type: "anchor"; id: string }
  | { label: string; type: "route"; href: string };

// Shared between /episodes and /contact (both "poster" pages) — Episodes and
// Thoughts only physically exist on /episodes, so elsewhere they become real
// links to that page instead of dead in-page anchors.
function buildLinks(pathname: string): SNLink[] {
  const onEpisodes = pathname === "/episodes";
  return [
    onEpisodes
      ? { label: "EPISODES", type: "anchor", id: "drops" }
      : { label: "EPISODES", type: "route", href: "/episodes" },
    // onEpisodes
    //   ? { label: "THOUGHTS", type: "anchor", id: "thoughts" }
    //   : { label: "THOUGHTS", type: "route", href: "/episodes#thoughts" },
    { label: "ABOUT", type: "route", href: "/about" },
    { label: "COLLAB", type: "route", href: "/contact" },
  ];
}

export default function StickerNav() {
  const navRef = useRef<HTMLElement | null>(null);
  const subscribeRef = useRef<HTMLButtonElement | null>(null);
  const pathname = usePathname();
  const links = buildLinks(pathname);

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
        return;
      }
      gsap.set(".sn-reveal", { y: -16, opacity: 0 });
      gsap.to(".sn-reveal", {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.06,
        ease: "power3.out",
        delay: 1,
      });
    },
    { scope: navRef, dependencies: [pathname] }
  );

  const handleClick = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const navHeight = navRef.current?.getBoundingClientRect().height ?? 0;
    scrollToSection(id, navHeight);
  };

  return (
    <nav
      ref={navRef}
      className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center justify-between gap-4 bg-[#FFC21F] px-6 py-5 sm:px-11"
    >
      <Link href="/" className="sn-reveal flex flex-col leading-[0.82]">
        <span className="ml-0.5 text-lg text-[#161310]" style={{ fontFamily: "var(--font-script)" }}>
          at the
        </span>
        <span className="font-archivo text-[17px] font-black tracking-[0.06em] text-[#161310]">
          CROSSROADS
        </span>
      </Link>

      <div className="flex flex-wrap items-center gap-6 font-sans text-[13px] font-extrabold text-[#161310]">
        {links.map((link) => {
          const className = "sn-reveal text-[#161310]/70 transition-colors hover:text-[#161310]";
          if (link.type === "route") {
            return (
              <Link key={link.href} href={link.href} className={className}>
                {link.label}
              </Link>
            );
          }
          return (
            <a
              key={link.id}
              href={`#${link.id}`}
              onClick={handleClick(link.id)}
              className={className}
            >
              {link.label}
            </a>
          );
        })}
        <button
          ref={subscribeRef}
          className="sn-reveal magnetic-btn rounded-[9px] bg-[#161310] px-[17px] py-[11px] font-archivo text-[13px] font-black text-[#FFC21F]"
        >
          SUBSCRIBE
        </button>
      </div>
    </nav>
  );
}
