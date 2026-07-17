import { getEpisodes } from "@/lib/episodes";
import EpisodesModule from "./EpisodesModule";

export default function AdminEpisodesPage() {
  const episodes = getEpisodes();
  return <EpisodesModule episodes={episodes} />;
}
