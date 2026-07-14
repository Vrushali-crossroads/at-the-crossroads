"use client";

import { Archivo } from "next/font/google";
import StickerNav from "../components/StickerNav";
import StickerFooter from "../components/StickerFooter";
import MarqueeTape from "../components/MarqueeTape";
import StickerHero from "./components/StickerHero";
import LatestDrops from "./components/LatestDrops";
import ThoughtsSection from "./components/ThoughtsSection";
import AboutSection from "./components/AboutSection";
import Newsletter from "./components/Newsletter";
import PastGuestsPills from "./components/PastGuestsPills";
import Collab from "./components/Collab";
import Contact from "./components/Contact";

// "Sticker Studio" is a deliberate, punchier departure from the rest of the
// site's Editorial Sun language — bright yellow, black poster type, hard
// offset shadows, halftone dots — reserved for this page only.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
});

export default function EpisodesPage() {
  return (
    <div className={`${archivo.variable} bg-[#FFF7DA] text-[#161310]`}>
      <StickerNav />
      <StickerHero />
      <MarqueeTape />
      <LatestDrops />
      <ThoughtsSection />
      <AboutSection />
      <Newsletter />
      <PastGuestsPills />
      <Collab />
      <Contact />
      <StickerFooter />
    </div>
  );
}
