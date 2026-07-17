import { getEpisodes } from "@/lib/episodes";
import StatCard from "../../components/StatCard";

export default async function LatestEpisodeWidget() {
  const [latest] = await getEpisodes();

  return (
    <StatCard
      label="Latest episode"
      value={latest ? latest.number.replace("EPISODE ", "#") : "—"}
      hint={latest?.title ?? "No episodes yet"}
      accent="mango"
    />
  );
}
