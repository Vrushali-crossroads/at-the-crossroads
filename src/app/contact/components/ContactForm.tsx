"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "../../components/useMagnetic";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";
import { submitContactForm } from "../actions";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REASONS = ["Guest pitch", "Brand partnership", "Speaking enquiry", "Something else"];

const EMPTY_FORM = { name: "", email: "", reason: REASONS[0], message: "" };

// How long the "ON AIR" confirmation stays up before the form reappears.
const SUCCESS_DISPLAY_MS = Number(process.env.NEXT_PUBLIC_CONTACT_SUCCESS_DURATION_MS) || 6000;

export default function ContactForm() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const successBlockRef = useRef<HTMLDivElement | null>(null);
  const hasResetRef = useRef(false);
  const [state, formAction, pending] = useActionState(submitContactForm, undefined);
  const [form, setForm] = useState(EMPTY_FORM);
  const [showConfirmation, setShowConfirmation] = useState(false);

  useMagnetic(submitRef, 0.2);

  // Landing here with a #form hash (e.g. the hero's "Collaborate" CTA on
  // /episodes) — smooth-scroll to the form once the page has settled,
  // offsetting for the fixed nav the same way the home page's hash links do.
  useEffect(() => {
    if (typeof window === "undefined" || window.location.hash !== "#form") return;
    const el = rootRef.current;
    if (!el) return;
    const raf = requestAnimationFrame(() => {
      setTimeout(() => {
        const navHeight = document.querySelector("nav")?.getBoundingClientRect().height ?? 0;
        const y = el.getBoundingClientRect().top + window.scrollY - navHeight - 20;
        window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
      }, 60);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  // Auto-return to a blank form a few seconds after the confirmation shows.
  useEffect(() => {
    if (!state?.success) return;
    setShowConfirmation(true);

    const resetToForm = () => {
      // The success view's infinite ring-radiate / spark-twinkle loops don't
      // get cleaned up by the entrance effect's own scope (only a new
      // submission does that) — kill them explicitly before it unmounts.
      gsap.killTweensOf(".cf-ring");
      gsap.killTweensOf(".cf-success-spark");
      hasResetRef.current = true;
      setShowConfirmation(false);
      setForm(EMPTY_FORM);
    };

    const timer = setTimeout(() => {
      if (prefersReducedMotion() || !successBlockRef.current) {
        resetToForm();
        return;
      }
      gsap.to(successBlockRef.current, {
        opacity: 0,
        y: -16,
        scale: 0.96,
        duration: 0.45,
        ease: "power2.in",
        onComplete: resetToForm,
      });
    }, SUCCESS_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, [state]);

  // Form reappearing after auto-reset — skipped on first mount since the
  // scroll-triggered card entrance below already handles that.
  useGSAP(
    () => {
      if (showConfirmation || !hasResetRef.current) return;

      if (prefersReducedMotion()) {
        gsap.set(".cf-field", { clearProps: "all", opacity: 1, y: 0 });
        return;
      }

      gsap.set(".cf-field", { opacity: 0, y: 14 });
      gsap.to(".cf-field", { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: "power3.out" });
    },
    { scope: cardRef, dependencies: [showConfirmation] }
  );

  useGSAP(
    () => {
      if (prefersReducedMotion()) {
        gsap.set(cardRef.current, { clearProps: "all", opacity: 1, y: 0, scale: 1 });
        return;
      }

      gsap.set(cardRef.current, { opacity: 0, y: 50, scale: 0.97 });
      gsap.to(cardRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 88%",
          end: "top 45%",
          scrub: 0.6,
        },
      });
    },
    { scope: rootRef }
  );

  // "Sending" cue: a little audio waveform + recording pulse inside the
  // button, like the message is being broadcast out.
  useGSAP(
    () => {
      if (!pending || prefersReducedMotion()) {
        gsap.set(".cf-wave-bar", { scaleY: 1 });
        gsap.set(".cf-rec-dot", { opacity: 1, scale: 1 });
        return;
      }

      const bars = gsap.utils.toArray<HTMLElement>(".cf-wave-bar");
      bars.forEach((bar, i) => {
        gsap.to(bar, {
          scaleY: 1.9 + (i % 3) * 0.5,
          duration: 0.32 + (i % 3) * 0.1,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.07,
        });
      });

      gsap.to(".cf-rec-dot", {
        opacity: 0.3,
        scale: 0.75,
        duration: 0.55,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: rootRef, dependencies: [pending] }
  );

  // Success entrance: play-button badge pops in, badge/copy reveal, sparks
  // twinkle, then broadcast rings radiate outward on loop — "you're on air."
  useGSAP(
    () => {
      if (!state?.success) return;

      if (prefersReducedMotion()) {
        gsap.set(
          [".cf-success-check", ".cf-success-badge", ".cf-success-heading", ".cf-success-copy", ".cf-success-spark"],
          { clearProps: "all", opacity: 1, scale: 1, y: 0, rotate: 0, filter: "none" }
        );
        gsap.set(".cf-ring", { opacity: 0 });
        return;
      }

      gsap.set(".cf-success-check", { scale: 0 });
      gsap.set(".cf-success-badge", { scale: 0, rotate: 8 });
      gsap.set([".cf-success-heading", ".cf-success-copy"], { opacity: 0, y: 16, filter: "blur(6px)" });
      gsap.set(".cf-success-spark", { scale: 0, opacity: 0, rotate: -45 });
      gsap.set(".cf-ring", { opacity: 0 });

      const tl = gsap.timeline();
      tl.to(".cf-success-check", { scale: 1, duration: 0.55, ease: "back.out(2.6)" })
        .to(".cf-success-badge", { scale: 1, rotate: -1, duration: 0.6, ease: "elastic.out(1, 0.6)" }, "-=0.2")
        .to(".cf-success-heading", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }, "-=0.25")
        .to(".cf-success-copy", { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.5, ease: "power3.out" }, "-=0.3")
        .to(
          ".cf-success-spark",
          { scale: 1, opacity: 1, rotate: 0, duration: 0.5, stagger: 0.12, ease: "back.out(2.6)" },
          "-=0.4"
        )
        .call(() => {
          gsap.fromTo(
            ".cf-ring",
            { scale: 0.7, opacity: 0.7 },
            { scale: 1.9, opacity: 0, duration: 1.8, repeat: -1, stagger: 0.6, ease: "power1.out" }
          );
        });

      gsap.to(".cf-success-spark", {
        scale: 1.15,
        opacity: 0.75,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        stagger: 0.3,
        ease: "sine.inOut",
        delay: 1.2,
      });
    },
    { scope: cardRef, dependencies: [state?.success] }
  );

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const inputClass =
    "rounded-xl border-2 border-ink/15 bg-cream px-4 py-3 font-sans text-[15px] text-ink placeholder:text-ink/40 focus:border-ink focus:outline-none";

  return (
    <section ref={rootRef} id="form" className="bg-white px-6 py-16 sm:px-11">
      <div
        ref={cardRef}
        className="mx-auto max-w-2xl rounded-[18px] border-2 border-ink bg-white p-8 shadow-[8px_8px_0_#1A1714] sm:p-11"
      >
        {showConfirmation ? (
          <div ref={successBlockRef} className="relative py-10 text-center">
            <svg
              aria-hidden
              className="cf-success-spark absolute left-[16%] top-1 w-5 text-teal"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
            </svg>
            <svg
              aria-hidden
              className="cf-success-spark absolute right-[14%] top-5 w-4 text-mango"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
            </svg>
            <svg
              aria-hidden
              className="cf-success-spark absolute left-[24%] bottom-2 w-3 text-ink/40"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path d="M12 0L14 10L24 12L14 14L12 24L10 14L0 12L10 10L12 0Z" fill="currentColor" />
            </svg>

            <div className="cf-success-check relative mx-auto mb-4 flex h-16 w-16 items-center justify-center">
              <span className="cf-ring pointer-events-none absolute inset-0 rounded-full border-2 border-mango" aria-hidden />
              <span className="cf-ring pointer-events-none absolute inset-0 rounded-full border-2 border-mango" aria-hidden />
              <span className="cf-ring pointer-events-none absolute inset-0 rounded-full border-2 border-mango" aria-hidden />
              <span className="relative z-10 flex h-16 w-16 items-center justify-center rounded-full border-2 border-ink bg-mango">
                <svg viewBox="0 0 16 16" className="ml-0.5 h-6 w-6 fill-ink" aria-hidden>
                  <path d="M4 2.5v11l10-5.5-10-5.5z" />
                </svg>
              </span>
            </div>

            <div className="cf-success-badge mb-3 inline-block -rotate-1 rounded-[7px] bg-mango px-2.5 py-1.5 font-archivo text-xs font-black text-ink">
              ON AIR
            </div>
            <h3 className="cf-success-heading mb-3 font-archivo text-2xl font-black text-ink">
              Thanks, {form.name.split(" ")[0]} — got it.
            </h3>
            <p className="cf-success-copy mx-auto max-w-sm font-sans text-ink/66">
              Your message just went out live to the studio. I read every note myself and reply within a few days.
            </p>
          </div>
        ) : (
          <form action={formAction} className="flex flex-col gap-5">
            <div className="cf-field grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[13px] font-bold text-ink/60">Name</span>
                <input
                  type="text"
                  name="name"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Your name"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[13px] font-bold text-ink/60">Email</span>
                <input
                  type="email"
                  name="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="cf-field flex flex-col gap-2">
              <span className="font-sans text-[13px] font-bold text-ink/60">This is about</span>
              <select name="reason" value={form.reason} onChange={handleChange("reason")} className={inputClass}>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="cf-field flex flex-col gap-2">
              <span className="font-sans text-[13px] font-bold text-ink/60">Message</span>
              <textarea
                name="message"
                required
                rows={5}
                value={form.message}
                onChange={handleChange("message")}
                placeholder="What's on your mind?"
                className={`resize-none ${inputClass}`}
              />
            </label>

            {state?.error && (
              <p role="alert" className="font-sans text-sm font-semibold text-red-600">
                {state.error}
              </p>
            )}

            <button
              ref={submitRef}
              type="submit"
              disabled={pending}
              className="cf-field magnetic-btn mt-1 flex cursor-pointer items-center gap-2 self-start rounded-full border-2 border-ink bg-mango px-8 py-4 font-archivo text-sm font-black text-ink shadow-[4px_4px_0_#1A1714] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending && <span className="cf-rec-dot h-2 w-2 shrink-0 rounded-full bg-ink" aria-hidden />}
              {pending ? "BROADCASTING" : "SEND MESSAGE"}
              {pending && (
                <span className="flex h-4 items-end gap-0.75" aria-hidden>
                  <span className="cf-wave-bar h-1.5 w-0.75 origin-bottom rounded-full bg-ink" />
                  <span className="cf-wave-bar h-2.5 w-0.75 origin-bottom rounded-full bg-ink" />
                  <span className="cf-wave-bar h-1 w-0.75 origin-bottom rounded-full bg-ink" />
                  <span className="cf-wave-bar h-3 w-0.75 origin-bottom rounded-full bg-ink" />
                  <span className="cf-wave-bar h-1.5 w-0.75 origin-bottom rounded-full bg-ink" />
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
