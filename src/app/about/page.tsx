import Navbar from "../components/Navbar";
import StickerFooter from "../components/StickerFooter";
import SmoothScroll from "../components/SmoothScroll";
import SunHero from "./components/SunHero";
import SunEpisodes from "./components/SunEpisodes";
import SunThoughts from "./components/SunThoughts";
import SunHost from "./components/SunHost";
import SunNewsletter from "./components/SunNewsletter";
import SunGuests from "./components/SunGuests";
import { getEpisodes } from "@/lib/episodes";

export default async function AboutPage() {
  const episodes = await getEpisodes();

  return (
    <>
      <Navbar />
      <SmoothScroll>
        <SunHero />
        <SunEpisodes episodes={episodes} />
        <SunThoughts />
        <SunHost />
        <SunNewsletter />
        <SunGuests />
        <StickerFooter />
      </SmoothScroll>
    </>
  );
}
