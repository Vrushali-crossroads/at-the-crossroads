import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LatestEpisodes from "./components/LatestEpisodes";
import ThoughtsFeed from "./components/ThoughtsFeed";
import AboutHost from "./components/AboutHost";
import PastGuests from "./components/PastGuests";
import StickerFooter from "./components/StickerFooter";
import SmoothScroll from "./components/SmoothScroll";
import SoundwaveDivider from "./components/SoundwaveDivider";
import { getEpisodes } from "@/lib/episodes";

export default async function Home() {
  const episodes = await getEpisodes();

  return (
    <>
      <Navbar />
      <SmoothScroll>
        <Hero />
        <LatestEpisodes episodes={episodes} />
        <SoundwaveDivider />
        <ThoughtsFeed />
        <AboutHost />
        <SoundwaveDivider />
        <PastGuests />
        <StickerFooter />
      </SmoothScroll>
    </>
  );
}
