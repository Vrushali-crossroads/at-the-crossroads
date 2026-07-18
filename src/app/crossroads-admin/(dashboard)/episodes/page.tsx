import { getEpisodes } from "@/lib/episodes";
import EpisodesModule from "./EpisodesModule";

export default async function AdminEpisodesPage() {
  const episodes = await getEpisodes();
  return <EpisodesModule episodes={episodes} />;
}
