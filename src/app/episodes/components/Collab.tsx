"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { useMagnetic } from "../../components/useMagnetic";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STATS = [
  { value: 55, label: "episodes", color: "text-mango" },
  { value: 9, label: "long-form pods", color: "text-teal" },
  { value: "Weekly", label: "new episodes", color: "text-white" },
  { value: "India", label: "growing reach", color: "text-mango" },
];

export default function Collab() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const mediaKitRef = useRef<HTMLAnchorElement | null>(null);
  const enquireRef = useRef<HTMLAnchorElement | null>(null);

  useMagnetic(mediaKitRef, 0.3);
  useMagnetic(enquireRef, 0.3);

  useGSAP(
    () => {
      const reduced = prefersReducedMotion();

      if (reduced) {
        gsap.set([".cl-reveal", ".cl-cta", ".cl-stat-label"], { clearProps: "all", opacity: 1, y: 0 });
        gsap.utils.toArray<HTMLElement>(".cl-stat-num[data-count]").forEach((el) => {
          el.textContent = el.dataset.count ?? "";
        });
        return;
      }

      gsap.set(".cl-reveal", { y: 24, opacity: 0 });
      gsap.set(".cl-copy", { y: 24, opacity: 0 });
      gsap.set(".cl-cta", { y: 24, opacity: 0 });
      gsap.set(".cl-stat-label", { y: 16, opacity: 0 });
      gsap.set(".cl-stat-num[data-count]", { opacity: 0 });
      gsap.set(".cl-stat-text", { opacity: 0, scale: 0.85 });
      gsap.utils.toArray<HTMLElement>(".cl-stat-num[data-count]").forEach((el) => {
        el.textContent = "0";
      });

      // Background shape spins continuously and very slowly, independent of scroll.
      gsap.to(".cl-shape", { rotate: 360, duration: 40, ease: "none", repeat: -1 });

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1024px)", () => {
        const tl = buildTimeline();
        const st = ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top top",
          end: "+=70%",
          pin: true,
          scrub: 1,
          animation: tl,
        });
        return () => st.kill();
      });

      mm.add("(max-width: 1023px)", () => {
        const tl = buildTimeline();
        gsap.timeline({
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 85%",
            end: "top 25%",
            scrub: 0.6,
          },
        }).add(tl);
      });

      function buildTimeline() {
        const tl = gsap.timeline({ defaults: { ease: "none" } });
        tl.to(".cl-reveal", { y: 0, opacity: 1, duration: 1, stagger: 0.15 }, 0)
          .to(".cl-copy", { y: 0, opacity: 1, duration: 1 }, 0.05)
          .to(".cl-cta", { y: 0, opacity: 1, duration: 1 }, 0.1);

        STATS.forEach((stat, i) => {
          const pos = 0.25 + i * 0.15;
          if (typeof stat.value === "number") {
            const counter = { val: 0 };
            tl.to(
              counter,
              {
                val: stat.value,
                duration: 0.5,
                onUpdate: () => {
                  const el = document.querySelector<HTMLElement>(`.cl-stat-num[data-index="${i}"]`);
                  if (el) el.textContent = Math.round(counter.val).toString();
                },
              },
              pos
            ).to(`.cl-stat-num[data-index="${i}"]`, { opacity: 1, duration: 0.2 }, pos);
          } else {
            tl.to(`.cl-stat-text[data-index="${i}"]`, { opacity: 1, scale: 1, duration: 0.4, ease: "back.out(2)" }, pos);
          }
          tl.to(`.cl-stat-label[data-index="${i}"]`, { y: 0, opacity: 1, duration: 0.4 }, pos);
        });

        return tl;
      }

      return () => mm.revert();
    },
    { scope: sectionRef }
  );

  return (
    <section id="collab" ref={sectionRef} className="relative px-6 pt-18 sm:px-11">
      <div
        ref={panelRef}
        className="relative overflow-hidden rounded-[18px] bg-ink p-8 text-cream sm:p-13"
      >
        <span
          aria-hidden
          className="cl-shape pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-[30%] border-2 border-mango/20 will-change-transform"
        />
        <div className="relative grid grid-cols-1 gap-9 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="cl-reveal mb-4 inline-block rounded-[7px] bg-mango px-2.5 py-1.5 font-archivo text-xs font-black text-ink">
              WORK WITH ME
            </div>
            <h2 className="cl-reveal mb-4 font-archivo text-[clamp(1.5rem,1.1rem+1.8vw,2rem)] font-black leading-[1.06] uppercase">
              Speaking · Training · Brand collabs
            </h2>
            <p className="cl-copy mb-6.5 max-w-107.5 font-sans text-base font-medium text-cream/72">
              Bring the crossroads conversation to your stage, team or campaign.
            </p>
            <div className="cl-cta flex flex-wrap gap-3">
              <a
                ref={mediaKitRef}
                href="#contact"
                className="magnetic-btn rounded-[11px] bg-mango px-5.5 py-3.5 font-archivo text-[13px] font-black text-ink shadow-[4px_4px_0_#1A1714]"
              >
                DOWNLOAD MEDIA KIT
              </a>
              <a
                ref={enquireRef}
                href="#contact"
                className="magnetic-btn rounded-[11px] border-2 border-cream/45 px-5.5 py-3.5 font-archivo text-[13px] font-black text-cream"
              >
                ENQUIRE →
              </a>
            </div>
          </div>
          <div className="grid grid-cols-2 content-center gap-4">
            {STATS.map((s, i) => (
              <div key={s.label}>
                {typeof s.value === "number" ? (
                  <div
                    data-index={i}
                    data-count={s.value}
                    className={`cl-stat-num font-archivo text-[2.625rem] font-black leading-none ${s.color}`}
                  >
                    0
                  </div>
                ) : (
                  <div
                    data-index={i}
                    className={`cl-stat-text font-archivo text-[2.625rem] font-black leading-none ${s.color}`}
                  >
                    {s.value}
                  </div>
                )}
                <div
                  data-index={i}
                  className="cl-stat-label mt-1.5 font-sans text-[13px] leading-[1.3] font-semibold text-cream/60"
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
