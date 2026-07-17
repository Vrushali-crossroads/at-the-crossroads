import { getEpisodes } from "@/lib/episodes";
import StatCard from "../../components/StatCard";

export default function MissingLinksWidget() {
  const episodes = getEpisodes();
  const missing = episodes.filter((ep) => !ep.link).length;

  return (
    <StatCard
      label="Missing links"
      value={missing}
      hint={missing > 0 ? "Episodes without a listen link" : "All episodes linked"}
      accent={missing > 0 ? "mango" : "teal"}
    />
  );
}
