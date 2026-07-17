import { getEpisodes } from "@/lib/episodes";
import StatCard from "../../components/StatCard";

export default async function EpisodeCountWidget() {
  const count = (await getEpisodes()).length;
  return (
    <StatCard label="Total episodes" value={count} hint="Published so far" accent="teal" />
  );
}
