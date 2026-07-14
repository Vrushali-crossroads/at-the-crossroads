"use client";

import { Archivo } from "next/font/google";
import StickerNav from "../components/StickerNav";
import StickerFooter from "../components/StickerFooter";
import MarqueeTape from "../components/MarqueeTape";
import ContactHero from "./components/ContactHero";
import ContactReasons from "./components/ContactReasons";
import ContactForm from "./components/ContactForm";

// Matches the "Sticker Studio" poster language used on /episodes — bright
// yellow, black poster type, hard offset shadows, halftone dots.
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-archivo",
});

export default function ContactPage() {
  return (
    <div className={`${archivo.variable} bg-[#FFF7DA] text-[#161310]`}>
      <StickerNav />
      <ContactHero />
      <MarqueeTape />
      <ContactReasons />
      <ContactForm />
      <StickerFooter />
    </div>
  );
}
