"use client";

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useMagnetic } from "../../components/useMagnetic";
import { prefersReducedMotion } from "../../components/usePrefersReducedMotion";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const REASONS = ["Guest pitch", "Brand partnership", "Speaking enquiry", "Something else"];

export default function ContactForm() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", reason: REASONS[0], message: "" });

  useMagnetic(submitRef, 0.2);

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

  const handleChange =
    (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
  };

  const inputClass =
    "rounded-xl border-2 border-[#161310]/15 bg-[#FFF7DA] px-4 py-3 font-sans text-[15px] text-[#161310] placeholder:text-[#161310]/40 focus:border-[#161310] focus:outline-none";

  return (
    <section ref={rootRef} className="bg-white px-6 py-16 sm:px-11">
      <div
        ref={cardRef}
        className="mx-auto max-w-2xl rounded-[18px] border-2 border-[#161310] bg-white p-8 shadow-[8px_8px_0_#161310] sm:p-11"
      >
        {submitted ? (
          <div className="py-10 text-center">
            <div className="mb-3 inline-block -rotate-1 rounded-[7px] bg-[#FFC21F] px-2.5 py-1.5 font-archivo text-xs font-black text-[#161310]">
              MESSAGE SENT
            </div>
            <h3 className="mb-3 font-archivo text-2xl font-black text-[#161310]">
              Thanks, {form.name.split(" ")[0]} — got it.
            </h3>
            <p className="mx-auto max-w-sm font-sans text-[#161310]/66">
              I read every message myself and reply within a few days. Talk soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[13px] font-bold text-[#161310]/60">Name</span>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={handleChange("name")}
                  placeholder="Your name"
                  className={inputClass}
                />
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-sans text-[13px] font-bold text-[#161310]/60">Email</span>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={handleChange("email")}
                  placeholder="you@email.com"
                  className={inputClass}
                />
              </label>
            </div>

            <label className="flex flex-col gap-2">
              <span className="font-sans text-[13px] font-bold text-[#161310]/60">This is about</span>
              <select value={form.reason} onChange={handleChange("reason")} className={inputClass}>
                {REASONS.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2">
              <span className="font-sans text-[13px] font-bold text-[#161310]/60">Message</span>
              <textarea
                required
                rows={5}
                value={form.message}
                onChange={handleChange("message")}
                placeholder="What's on your mind?"
                className={`resize-none ${inputClass}`}
              />
            </label>

            <button
              ref={submitRef}
              type="submit"
              className="magnetic-btn mt-1 self-start rounded-full border-2 border-[#161310] bg-[#FFC21F] px-8 py-4 font-archivo text-sm font-black text-[#161310] shadow-[4px_4px_0_#161310]"
            >
              SEND MESSAGE
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
