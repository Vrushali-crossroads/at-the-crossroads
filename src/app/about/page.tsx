import Navbar from "../components/Navbar";
import StickerFooter from "../components/StickerFooter";
import SmoothScroll from "../components/SmoothScroll";
import SunHero from "./components/SunHero";
import SunEpisodes from "./components/SunEpisodes";
import SunThoughts from "./components/SunThoughts";
import SunHost from "./components/SunHost";
import SunNewsletter from "./components/SunNewsletter";
import SunGuests from "./components/SunGuests";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <SmoothScroll>
        <SunHero />
        <SunEpisodes />
        <SunThoughts />
        <SunHost />
        <SunNewsletter />
        <SunGuests />
        <StickerFooter />
      </SmoothScroll>
    </>
  );
}
