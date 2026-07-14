import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Gives each element a continuous scroll-scrubbed "bump": scale peaks at
 * maxScale as the element crosses the viewport center and eases back to
 * minScale near the edges. Used for the "centered item gets emphasis,
 * neighbors shrink" effect across card grids/rows.
 */
export function applyCenterEmphasis(
  elements: Element[],
  { minScale = 0.92, maxScale = 1.05 }: { minScale?: number; maxScale?: number } = {}
) {
  return elements.map((el) =>
    ScrollTrigger.create({
      trigger: el,
      start: "top bottom",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        const distance = Math.abs(self.progress - 0.5) * 2;
        const scale = maxScale - distance * (maxScale - minScale);
        gsap.set(el, { scale });
      },
    })
  );
}

/** Slow, continuous idle motion for CTAs/badges so nothing sits dead-still. */
export function floatIdle(
  el: string | Element,
  { distance = 6, duration = 2.6 }: { distance?: number; duration?: number } = {}
) {
  return gsap.to(el, {
    y: -distance,
    duration,
    ease: "sine.inOut",
    repeat: -1,
    yoyo: true,
  });
}
