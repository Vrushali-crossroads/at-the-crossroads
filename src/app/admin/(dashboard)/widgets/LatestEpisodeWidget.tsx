import { getEpisodes } from "@/lib/episodes";
import StatCard from "../../components/StatCard";

export default function LatestEpisodeWidget() {
  const [latest] = getEpisodes();

  return (
    <StatCard
      label="Latest episode"
      value={latest ? latest.number.replace("EPISODE ", "#") : "—"}
      hint={latest?.title ?? "No episodes yet"}
      accent="mango"
    />
  );
}
