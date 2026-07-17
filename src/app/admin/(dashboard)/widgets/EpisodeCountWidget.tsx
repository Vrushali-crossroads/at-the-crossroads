import { getEpisodes } from "@/lib/episodes";
import StatCard from "../../components/StatCard";

export default function EpisodeCountWidget() {
  const count = getEpisodes().length;
  return (
    <StatCard label="Total episodes" value={count} hint="Published so far" accent="teal" />
  );
}
