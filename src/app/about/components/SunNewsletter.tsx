"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "../../components/useMagnetic";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function SunNewsletter() {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const subscribeRef = useRef<HTMLButtonElement | null>(null);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useMagnetic(subscribeRef, 0.25);

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(panelRef.current, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(panelRef.current, { opacity: 0, y: 50 });
      gsap.to(panelRef.current, {
        opacity: 1,
        y: 0,
        ease: "none",
        scrollTrigger: {
          trigger: panelRef.current,
          start: "top 92%",
          end: "top 55%",
          scrub: 0.6,
        },
      });

      // A slow, near-imperceptible "breathing" scale — kept on its own axis
      // (scale only, never touching y/opacity) so it never fights the
      // scroll-driven rise above. Just enough so the panel is never fully
      // still.
      gsap.to(panelRef.current, {
        scale: 1.008,
        duration: 4,
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
    },
    { scope: panelRef }
  );

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-white px-(--space-section-x) py-(--space-section-y)">
      <div
        ref={panelRef}
        className="rounded-[22px] bg-teal px-8 py-12 text-center text-cream sm:px-13"
      >
        <h2 className="mb-2.5 text-cream">The Crossroad Note</h2>
        <p className="mx-auto mb-6.5 max-w-md text-cream/78">
          One lesson from the week&apos;s conversation, in your inbox every Sunday.
        </p>

        {submitted ? (
          <div className="mx-auto inline-flex items-center justify-center rounded-full bg-cream px-6 py-4 font-sans text-sm font-bold text-ink">
            You&apos;re in — see you Sunday.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="mx-auto flex max-w-md items-center gap-2.5 rounded-full bg-cream p-1.5 pl-5.5"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              aria-label="Email address"
              className="min-w-0 flex-1 bg-transparent text-left font-sans text-[15px] font-medium text-ink placeholder:text-ink/45 focus:outline-none"
            />
            <button
              ref={subscribeRef}
              type="submit"
              className="magnetic-btn shrink-0 rounded-full bg-mango px-5.5 py-3.5 font-sans text-sm font-bold text-ink"
            >
              Subscribe
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
