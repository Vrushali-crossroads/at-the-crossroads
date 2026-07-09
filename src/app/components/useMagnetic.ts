"use client";

import { useEffect, type RefObject } from "react";
import gsap from "gsap";
import { prefersReducedMotion } from "./usePrefersReducedMotion";

export function useMagnetic(ref: RefObject<HTMLElement | null>, strength = 0.35, lift = 0.045) {
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3" });

    const handleMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);
      xTo(relX * strength);
      yTo(relY * strength);
    };

    const handleEnter = () => {
      el.classList.add("is-magnet-active");
      gsap.to(el, { scale: 1 + lift, duration: 0.4, ease: "power3.out" });
    };

    const handleLeave = () => {
      xTo(0);
      yTo(0);
      el.classList.remove("is-magnet-active");
      gsap.to(el, { scale: 1, duration: 0.5, ease: "elastic.out(1, 0.5)" });
    };

    el.addEventListener("mousemove", handleMove);
    el.addEventListener("mouseenter", handleEnter);
    el.addEventListener("mouseleave", handleLeave);

    return () => {
      el.removeEventListener("mousemove", handleMove);
      el.removeEventListener("mouseenter", handleEnter);
      el.removeEventListener("mouseleave", handleLeave);
    };
  }, [ref, strength, lift]);
}
