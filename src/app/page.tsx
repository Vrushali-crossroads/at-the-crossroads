import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import LatestEpisodes from "./components/LatestEpisodes";
import ThoughtsFeed from "./components/ThoughtsFeed";
import AboutHost from "./components/AboutHost";
import PastGuests from "./components/PastGuests";
import Footer from "./components/Footer";
import SmoothScroll from "./components/SmoothScroll";
import SoundwaveDivider from "./components/SoundwaveDivider";

export default function Home() {
  return (
    <>
      <Navbar />
      <SmoothScroll>
        <Hero />
        <LatestEpisodes />
        <SoundwaveDivider />
        <ThoughtsFeed />
        <AboutHost />
        <SoundwaveDivider />
        <PastGuests />
        <Footer />
      </SmoothScroll>
    </>
  );
}
